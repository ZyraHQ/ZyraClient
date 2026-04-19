import { GatewayIntentBits } from "discord.js";

export const IntentsOptions = {
  Guilds: GatewayIntentBits.Guilds,
  GuildMembers: GatewayIntentBits.GuildMembers,
  GuildMessages: GatewayIntentBits.GuildMessages,
  MessageContent: GatewayIntentBits.MessageContent,
} as const;

export type IntentsOptionsType = keyof typeof IntentsOptions;