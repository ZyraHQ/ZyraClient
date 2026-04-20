import { Function } from "../../structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "footer",
  args: [
    { name: "text", type: "string", optional: false },
    { name: "iconURL", type: "string", optional: true },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.text) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return { __error: `Embed index must be between **1** and **10**.` };
    }

    if (args.text.length > 2048) {
      return { __error: `Footer text cannot exceed **2048** characters.` };
    }

    return {
      __embed: { footer: { text: args.text, iconURL: args.iconURL } },
      __embedIndex: index,
    };
  },
});
