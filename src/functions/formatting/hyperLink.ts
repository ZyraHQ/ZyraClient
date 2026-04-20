import { Function } from "../../structures/Function";
import type { ChatInputCommandInteraction, Message } from "discord.js";

export default new Function({
  name: "hyperLink",
  args: [
    { name: "text", type: "string", optional: false },
    { name: "url", type: "string", optional: false },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.text || !args?.url) return "";
    return `[${args.text}\](${args.url})`;
  },
});
