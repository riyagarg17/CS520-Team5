const { DynamicTool, DynamicStructuredTool } = require("@langchain/core/tools");

const testTool = new DynamicTool({
  name: "test",
  description: "A test tool for demonstration purposes. Provide the user input and it will return a test message.",
  func: async (input) => {
    return `Test tool received input: ${input}`;
  },
});

// Create tools array
const tools = [testTool];

module.exports = tools;