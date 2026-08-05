import { existsSync } from "node:fs";
import process from "node:process";

if (existsSync(".env")) {
  process.loadEnvFile();
}

const configuredPort = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

export const config = {
  port: configuredPort,
} as const;
