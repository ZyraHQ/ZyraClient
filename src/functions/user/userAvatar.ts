import { Function } from "@/structures/Function";
import {
  Message,
  type ChatInputCommandInteraction,
  type ImageExtension,
  type ImageSize,
} from "discord.js";

export default new Function({
  name: "userAvatar",
  args: [
    { name: "userId", type: "string", optional: true },
    { name: "format", type: "string", optional: true },
    { name: "size", type: "number", optional: true },
  ],
  execute: async (ctx: Message | ChatInputCommandInteraction, args) => {
    const userId =
      args?.userId || (ctx instanceof Message ? ctx.author.id : ctx.user.id);
    const user = await ctx.client.users.fetch(userId).catch(() => null);
    if (!user) return { __error: `User "**${userId}**" not found` };

    const format = (args?.format || "png") as ImageExtension;
    const size = (args?.size ? Number(args.size) : 512) as ImageSize;

    const validFormats: ImageExtension[] = [
      "png",
      "jpg",
      "jpeg",
      "webp",
      "gif",
    ];
    const validSizes: ImageSize[] = [
      16, 32, 64, 128, 256, 512, 1024, 2048, 4096,
    ];

    if (!validFormats.includes(format)) {
      return {
        __error: `Invalid format "**${format}**". Valid formats: ${validFormats.join(", ")}`,
      };
    }

    if (!validSizes.includes(size)) {
      return {
        __error: `Invalid size "**${size}**". Valid sizes: ${validSizes.join(", ")}`,
      };
    }

    return user.displayAvatarURL({ extension: format, size });
  },
});
