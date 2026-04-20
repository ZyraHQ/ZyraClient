import { Function } from "../../structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "thumbnail",
  args: [
    { name: "url", type: "string", optional: false },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.url) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return { __error: `Embed index must be between **1** and **10**.` };
    }

    return { __embed: { thumbnail: args.url }, __embedIndex: index };
  },
});
