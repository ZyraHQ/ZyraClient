import { Function } from "@/structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "addField",
  args: [
    { name: "name", type: "string", optional: false },
    { name: "value", type: "string", optional: false },
    { name: "inline", type: "boolean", optional: true },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.name || !args?.value) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return { __error: `Embed index must be between **1** and **10**.` };
    }

    if (args.name.length > 256) {
      return { __error: `Field name cannot exceed **256** characters.` };
    }

    if (args.value.length > 1024) {
      return { __error: `Field value cannot exceed **1024** characters.` };
    }

    return {
      __embedField: {
        name: args.name,
        value: args.value,
        inline: args.inline === "true",
      },
      __embedIndex: index,
    };
  },
});
