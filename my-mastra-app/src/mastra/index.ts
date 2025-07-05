// src/mastra/index.ts
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { getTransactionsTool } from "./tools/get-transactions-tool";
// import { personalAssistantAgent } from './agents/personal-assistant';
import {financialAgent} from './agents/financial-agent'
import { memoryAgent } from './agents/memory-agent';
import { aiContentWorkflow} from './workflows/content-workflow';
import { contentAgent } from './agents/content-agent';
import { parallelAnalysisWorkflow } from './workflows/parralel-workflow';
import { conditionalWorkflow } from './workflows/conditional-workflow';

export const mastra = new Mastra({
  workflows: { weatherWorkflow ,aiContentWorkflow,parallelAnalysisWorkflow,conditionalWorkflow},
  agents: { weatherAgent ,financialAgent,memoryAgent ,contentAgent},
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});


