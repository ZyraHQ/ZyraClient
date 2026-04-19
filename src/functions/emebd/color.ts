import { Function } from "@/structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "color",
  args: [
    { name: "color", type: "string", optional: false },
    { name: "index", type: "number", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.color) return "";

    const index = args.index ? Number(args.index) : 1;

    if (Number.isNaN(index) || index < 1 || index > 10) {
      return `**ZyraClient**: I detected an error while using the function "**$color**"\n> Embed index must be between **1** and **10**.`;
    }

    const hex = args.color.replace("#", "");
    const color = parseInt(hex, 16);

    if (Number.isNaN(color)) {
      return `**ZyraClient**: I detected an error while using the function "**$color**"\n> Invalid color "**${args.color}**".`;
    }

    return { __embed: { color }, __embedIndex: index };
  },
});
