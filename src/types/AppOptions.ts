import z from "zod";
import { IntentsOptions } from "./IntentsOptions";

const intentKeys = Object.keys(IntentsOptions) as [string, ...string[]];

export const AppOptionsSchema = z.object({
  token: z.string().min(1, "Token is required"),
  intents: z
    .array(z.enum(intentKeys))
    .min(1, "At least one intent is required"),
  prefix: z.union([z.string(), z.array(z.string())]).optional(),
});

export type AppOptions = z.infer<typeof AppOptionsSchema>;
