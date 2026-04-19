import { Function } from "@/structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "description",
  args: [
    { name: "description", type: "string", optional: false },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.description) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return `**ZyraClient**: I detected an error while using the function "**$description**"\n> Embed index must be between **1** and **10**.`;
    }

    return { __embed: { description: args.description }, __embedIndex: index };
  },
});