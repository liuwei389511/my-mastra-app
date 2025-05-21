/** @format */

import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { LibSQLStore } from "@mastra/libsql";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import dotenv from "dotenv";
dotenv.config();
import { weatherAgent } from "./agents";

// 从环境变量获取敏感信息
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const apiEmail = process.env.CLOUDFLARE_EMAIL;
const scope = process.env.CLOUDFLARE_SCOPE;

if (!apiToken || !apiEmail || !scope) {
  throw new Error("Missing Cloudflare API token or email");
}

console.log("apiToken", apiToken);
export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
  deployer: new CloudflareDeployer({
    scope,
    projectName: "my-mastra-app",
    workerNamespace: "my-mastra-app",
    auth: {
      apiToken,
      apiEmail,
    },
  }),
});
