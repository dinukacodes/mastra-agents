
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { financialAgent } from "./agents/financial-agent";
import { getTransactionsTool } from "./tools/get-transactions-tool";

import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    // We'll add servers in the next steps
  },
});
async function setupAgent() {
  const mcpTools = await mcp.getTools();
  // Now you can use mcpTools to configure your agent
}

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent ,financialAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});


