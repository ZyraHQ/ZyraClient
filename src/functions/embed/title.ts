import { Function } from "@/structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "title",
  args: [
    { name: "title", type: "string", optional: false },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.title) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return { __error: `Embed index must be between **1** and **10**.` };
    }
    
    if (args.title.length > 256) {
      return { __error: `Title cannot exceed **256** characters.` };
    }

    return { __embed: { title: args.title }, __embedIndex: index };
  },
});