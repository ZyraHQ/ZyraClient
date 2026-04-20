import { Function } from "@/structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "userDisplayName",
  args: [{ name: "userId", type: "string", optional: true }],
  execute: async (ctx: Message | ChatInputCommandInteraction, args) => {
    const userId =
      args?.userId || (ctx instanceof Message ? ctx.author.id : ctx.user.id);
    const user = await ctx.client.users.fetch(userId).catch(() => null);
    if (!user) return { __error: `User "**${userId}**" not found` };

    return user.displayName ?? "";
  },
});
