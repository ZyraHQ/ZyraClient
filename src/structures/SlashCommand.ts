import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  type TextBasedChannel,
  type InteractionReplyOptions,
} from "discord.js";
import {
  SlashCommandSchema,
  SlashOptionTypes,
  type SlashCommandType,
  type SlashOptionType,
} from "../types/SlshCommandOptions";
import {
  parseMessage,
  type ButtonData,
  type ActionRowData,
  type EmbedData,
} from "../utils/parseMessage";
import chalk from "chalk";
import consola from "consola";

const buildEmbed = (data: EmbedData): EmbedBuilder =>
  new EmbedBuilder({
    title: data.title,
    description: data.description,
    color: data.color,
    footer: data.footer,
    image: data.image ? { url: data.image } : undefined,
    thumbnail: data.thumbnail ? { url: data.thumbnail } : undefined,
    author: data.author,
    fields: data.fields,
    url: data.url,
    timestamp: data.timestamp ? new Date().toISOString() : undefined,
  });

const buildComponents = (
  buttons: Record<number, ButtonData>,
  actionRows: ActionRowData[],
): ActionRowBuilder<ButtonBuilder>[] => {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];

  for (const row of actionRows) {
    const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

    for (const index of row.buttonIndices) {
      const btn = buttons[index];
      if (!btn) continue;

      const style =
        ButtonStyle[btn.style as keyof typeof ButtonStyle] ??
        ButtonStyle.Primary;

      const button = new ButtonBuilder()
        .setCustomId(btn.customId)
        .setLabel(btn.label)
        .setStyle(style)
        .setDisabled(btn.disabled ?? false);

      if (btn.emoji) button.setEmoji(btn.emoji);

      rowBuilder.addComponents(button);
    }

    rows.push(rowBuilder);
  }

  return rows;
};

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

    const embeds = res.embeds
      ? Object.keys(res.embeds)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => buildEmbed(res.embeds![Number(key)]!))
      : undefined;

    const components =
      res.buttons && res.actionRows
        ? buildComponents(res.buttons, res.actionRows)
        : undefined;

    const payload: {
      content?: string;
      embeds?: EmbedBuilder[];
      components?: ActionRowBuilder<ButtonBuilder>[];
      allowedMentions?: InteractionReplyOptions["allowedMentions"];
    } = {
      content: res.content || undefined,
      embeds,
      components,
      allowedMentions: res.allowedMentions,
    };

    try {
      if (res.reply) {
        await ctx.reply(payload);
      } else if (ctx.channel?.isTextBased() && "send" in ctx.channel) {
        await (ctx.channel as TextBasedChannel & { send: Function }).send(
          payload,
        );
      }
    } catch (err) {
      consola.error(chalk.bold.red("Failed to send message:", err));
    }
  }

  public toJSON() {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      type: this.type,
      ...(this.options?.length && {
        options: this.options.map((opt) => ({
          name: opt.name,
          nameLocalizations: opt.nameLocalizations,
          description: opt.description,
          descriptionLocalizations: opt.descriptionLocalizations,
          required: opt.required,
          type: SlashOptionTypes[opt.type as keyof typeof SlashOptionTypes],
          ...(opt.choices?.length && { choices: opt.choices }),
        })),
      }),
    };
  }
}
