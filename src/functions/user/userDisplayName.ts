import { Function } from "@/structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "userDisplayName",
  args: [
    { name: "id", type: "string", optional: true },
  ],
  execute: async (ctx: Message | ChatInputCommandInteraction, args) => {
    if (args?.id) {
      const user = await ctx.client.users.fetch(args.id).catch(() => null);
      return user?.displayName ?? "";
    }

    return ctx instanceof Message ? ctx.author.displayName : ctx.user.displayName;
  },
});