import { Function } from "../../structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "memberDisplayName",
  args: [
    { name: "guildId", type: "string", optional: true },
    { name: "userId", type: "string", optional: true },
  ],
  execute: async (ctx: Message | ChatInputCommandInteraction, args) => {
    const guildId = args?.guildId;
    const userId =
      args?.userId || (ctx instanceof Message ? ctx.author.id : ctx.user.id);

    const guild = guildId
      ? await ctx.client.guilds.fetch(guildId).catch(() => null)
      : ctx.guild;

    const member = await guild?.members.fetch(userId).catch(() => null);

    if (guildId && !guild) {
      return { __error: `Guild "**${guildId}**" not found` };
    }

    if (!member) {
      return {
        __error: `Member with ID "**${userId}**" not found in guild "${guild?.name}"`,
      };
    }

    return member?.displayName ?? "";
  },
});
