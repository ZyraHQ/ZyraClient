import { readdirSync, statSync } from "fs";
import { join } from "path";
import type { App } from "../structures/App";

export const loadListeners = async (client: App): Promise<void> => {
  const dir = join(import.meta.dirname, "../listeners");

  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".ts")) continue;

    const filePath = join(dir, file);
    const mod = await import(filePath);

    if (mod.default) {
      const event = file.replace(".ts", "");
      client.on(event, (...args) => mod.default(client, ...args));
    }
  }
};
