import { ActivityType } from "discord.js";
import z from "zod";

export const StatusTypes = {
    Playing: ActivityType.Playing,
    Streaming: ActivityType.Streaming,
    Listening: ActivityType.Listening,
    Watching: ActivityType.Watching,
    Competing: ActivityType.Competing,
    Custom: ActivityType.Custom,
} as const;

const statusKeys = Object.keys(StatusTypes) as [string, ...string[]];
export const PresenceStatuses = ["online", "idle", "dnd", "invisible"] as const;

export const StatusOptionsSchema = z.object({
    type: z.enum(statusKeys),
    status: z.enum(PresenceStatuses).optional(),
    name: z.string().min(1, "Status name is required"),
    url: z.string().url("URL must be valid").optional(),
    interval: z.number().min(10000, "Interval must be at least 10 seconds").optional(),
});

export type StatusOptionsType = z.infer<typeof StatusOptionsSchema>;