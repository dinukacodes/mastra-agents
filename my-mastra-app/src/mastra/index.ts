// src/mastra/index.ts
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { createFinancialAgent } from "./agents/financial-agent";
import { getTransactionsTool } from "./tools/get-transactions-tool";
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    // ...add servers here...
  },
});

export const mastraPromise = (async () => {
  const mcpTools = await mcp.getTools();
  const financialAgent = createFinancialAgent({ getTransactionsTool, ...mcpTools });

  return new Mastra({
    workflows: { weatherWorkflow },
    agents: { weatherAgent, financialAgent },
    storage: new LibSQLStore({ url: ":memory:" }),
    logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
  });
})();