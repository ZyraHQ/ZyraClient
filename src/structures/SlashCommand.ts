import {
  SlashCommandSchema,
  SlashOptionTypes,
  type SlashCommandType,
  type SlashOptionType,
} from "@/types/SlshCommandOptions";
import { parseMessage } from "@/utils/parseMessage";
import chalk from "chalk";
import consola from "consola";
import {
  type InteractionReplyOptions,
  ApplicationCommandType,
  ChatInputCommandInteraction,
} from "discord.js";

export class SlashCommand {
  public name: string;
  public nameLocalizations?: Record<string, string>;
  public description: string;
  public descriptionLocalizations?: Record<string, string>;
  public type!: ApplicationCommandType;
  public options?: SlashOptionType[];
  public code: string;

  constructor(slash: SlashCommandType) {
    const parsed = SlashCommandSchema.parse(slash);

    this.name = parsed.name;
    this.nameLocalizations = parsed.nameLocalizations;
    this.description = parsed.description;
    this.descriptionLocalizations = parsed.descriptionLocalizations;
    this.type = ApplicationCommandType.ChatInput;
    this.options = parsed.options;
    this.code = parsed.code;
  }

  public async execute(ctx: ChatInputCommandInteraction): Promise<void> {
    const res = await parseMessage(this.code, ctx);

    const payload: {
      content: string;
      allowedMentions?: InteractionReplyOptions["allowedMentions"];
    } = {
      content: res.content || " ",
      allowedMentions: res.allowedMentions,
    };

    try {
      if (res.reply) {
        await ctx.reply(payload);
      } else if (ctx.channel && "send" in ctx.channel) {
        await ctx.channel.send(payload);
      }
    } catch (err) {
      consola.error(chalk.bold.red("Failed to send message:", err));
    }
  }

  public toJSON() {
    return {
      name: this.name,
      name_localizations: this.nameLocalizations,
      description: this.description,
      description_localizations: this.descriptionLocalizations,
      type: this.type,
      options: this.options?.map((opt) => ({
        name: opt.name,
        name_localizations: opt.nameLocalizations,
        description: opt.description,
        description_localizations: opt.descriptionLocalizations,
        type: SlashOptionTypes[opt.type as keyof typeof SlashOptionTypes],
        required: opt.required,
        choices: opt.choices,
      })),
    };
  }
}
