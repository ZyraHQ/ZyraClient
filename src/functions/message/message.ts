import { Function } from "@/structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "message",
  args: [
    { name: "index", type: "number", optional: true },
    { name: "end", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!(ctx instanceof Message)) return "";

    const parts = ctx.content.trim().split(/\s+/).slice(1);

    const hasIndex = args?.index !== undefined && args?.index !== null && args.index !== "";
    const hasEnd = args?.end !== undefined && args?.end !== null && args.end !== "";

    if (!hasIndex && !hasEnd) {
      return parts.join(" ");
    }

    const index = hasIndex ? Number(args.index) : 0;
    const end = hasEnd ? Number(args.end) : undefined;

    if (Number.isNaN(index)) return "";
    if (end !== undefined && Number.isNaN(end)) return "";

    if (end !== undefined) {
      return parts.slice(index, end + 1).join(" ");
    }

    return parts[index] ?? "";
  },
});