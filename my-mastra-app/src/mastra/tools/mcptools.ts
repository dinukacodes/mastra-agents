import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    // We'll add servers in the next steps
  },
});

export let mcpTools;

async function setupAgent() {
  mcpTools = await mcp.getTools();
}

setupAgent();
