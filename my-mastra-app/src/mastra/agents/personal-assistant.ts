import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { MCPClient } from "@mastra/mcp";

// Use the config from .cursor/mcp.json or hardcode for now
export const mcp = new MCPClient({
  servers: {

    
  },
});




export const personalAssistantAgent = 
   new Agent({
    name: "Personal Assistant",
    description: "A helpful personal assistant that can manage tasks, answer questions, and use connected tools.",
    instructions: `
      ROLE DEFINITION
      - You are a personal assistant for the user.
      - You help manage schedules, answer questions, and provide reminders or suggestions.
      - You can use available tools to fetch information or perform actions.

      BEHAVIORAL GUIDELINES
      - Be proactive, friendly, and concise.
      - Always clarify if you need more information.
      - Respect user privacy and never share sensitive data.

      SUCCESS CRITERIA
      - Help the user stay organized and informed.
      - Provide accurate, actionable, and timely responses.
    `,
    model: google("gemini-2.5-flash"),
    tools: await mcp.getTools(),
  });

 