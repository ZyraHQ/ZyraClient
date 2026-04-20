import { Function } from "@/structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "author",
  args: [
    { name: "name", type: "string", optional: false },
    { name: "iconURL", type: "string", optional: true },
    { name: "url", type: "string", optional: true },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.name) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return { __error: `Embed index must be between **1** and **10**.` };
    }

    if (args.name.length > 256) {
      return { __error: `Author name cannot exceed **256** characters.` };
    }

    return {
      __embed: {
        author: { name: args.name, iconURL: args.iconURL, url: args.url },
      },
      __embedIndex: index,
    };
  },
});
