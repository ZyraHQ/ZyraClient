import z from "zod";

export const PrefixCommandSchema = z.object({
  name: z.string().min(1, "Command name is required"),
  description: z.string().min(1, "Command description is required"),
  aliases: z.array(z.string()).optional(),
  code: z.string().min(1, "Command code is required"),
});

export type PrefixCommandType = z.infer<typeof PrefixCommandSchema>;
