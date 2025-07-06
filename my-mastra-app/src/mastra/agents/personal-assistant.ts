import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import {MCPClient} from "@mastra/mcp";
import {groq} from "@ai-sdk/groq";
import { Memory } from "@mastra/memory";
import path from "path";
import { openai } from "@ai-sdk/openai";


import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    workingMemory: {
      enabled: true,
      template: `
      <user>
         <first_name></first_name>
         <username></username>
         <preferences></preferences>
         <interests></interests>
         <conversation_style></conversation_style>
       </user>`,
    },
  },
});




// export const mcp = new MCPClient({
//     servers: {
//       zapier: {
//         url: new URL(process.env.ZAPIER_MCP_URL || ""),
//       },
//       github: {
//         url: new URL(process.env.COMPOSIO_MCP_GITHUB || ""),
//       },
//       hackernews: {
//         command: "npx",
//         args: ["-y", "@devabdultech/hn-mcp-server"],
//       },
//       textEditor: {
//         command: "pnpx",
//         args: [
//           "@modelcontextprotocol/server-filesystem",
//           path.join(process.cwd(), "..", "..", "notes"),
//         ],
//       },
//     },
//   });


export const personalAssistantAgent = 
   new Agent({
    name: "Personal Assistant",
    memory,
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
          You are a helpful personal assistant that can help with various tasks such as email 
    and scheduling social media posts.

    You have access to the following tools:

    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    

    Keep your responses concise and friendly.
      3. Hackernews:
       - Use this tool to search for stories on Hackernews
       - You can use it to get the top stories or specific stories
       - You can use it to retrieve comments for stories
     4. Filesystem:
       - You also have filesystem read/write access to a notes directory. 
       - You can use that to store info for later use or organize info for the user.
       - You can use this notes directory to keep track of to-do list items for the user.
       - Notes dir: ${path.join(process.cwd(), "notes")}
    
    `,
    model: groq("deepseek-r1-distill-llama-70b"),
    // tools: await mcp.getTools(),
  });

 