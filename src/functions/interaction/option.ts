import { Function } from "../../structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "option",
  args: [{ name: "name", type: "string", optional: false }],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (ctx instanceof Message) return "";

    const value = ctx.options.get(args?.name ?? "")?.value;

    if (value === undefined || value === null) return "";

    return String(value);
  },
});
