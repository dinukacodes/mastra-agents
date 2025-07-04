import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

import { google } from "@ai-sdk/google";
// Create a basic memory instance
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db", // relative path from the `.mastra/output` directory
  }),
  options:{
    lastMessages:20,
  }
});

// Create an agent with memory
export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
  `,
  model: google("gemini-2.5-flash"), // You can use "gpt-3.5-turbo" if you prefer
  memory: memory,
});
