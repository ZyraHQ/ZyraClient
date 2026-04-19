import chalk from "chalk";
import {
  EmbedBuilder,
  Message,
  type MessageMentionOptions,
  type TextBasedChannel,
} from "discord.js";
import { PrefixCommandSchema } from "@/types/PrefixCommandOptions";
import { parseMessage, type EmbedData } from "@/utils/parseMessage";
import type { PrefixCommandType } from "@/types/PrefixCommandOptions";
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

export class PrefixCommand {
  public name: string;
  public description: string;
  public aliases?: string[];
  public code: string;

  constructor(options: PrefixCommandType) {
    const parsed = PrefixCommandSchema.parse(options);

    this.name = parsed.name;
    this.description = parsed.description;
    this.aliases = parsed.aliases;
    this.code = parsed.code;
  }

  public async execute(
    ctx: Message,
    args: string[] = [],
  ): Promise<void> {
    const res = await parseMessage(this.code, ctx);

    const embeds = res.embeds
      ? Object.keys(res.embeds)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => buildEmbed(res.embeds![Number(key)]!))
      : undefined;

    const payload: {
      content?: string;
      embeds?: EmbedBuilder[];
      allowedMentions?: MessageMentionOptions;
    } = {
      content: res.content || undefined,
      embeds,
      allowedMentions: res.allowedMentions,
    };

    try {
      if (res.reply) {
        await ctx.reply(payload);
      } else if (ctx.channel.isTextBased() && "send" in ctx.channel) {
        await (ctx.channel as TextBasedChannel & { send: Function }).send(payload);
      }
    } catch (err) {
      consola.error(chalk.bold.red("Failed to send message:", err));
    }
  }
}