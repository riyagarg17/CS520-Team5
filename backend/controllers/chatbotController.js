require('dotenv').config();

// filepath: /Users/samonuallain/CS520-Team5/backend/controllers/chatbotController.js
const { ChatOpenAI } = require("@langchain/openai");
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { HumanMessage, AIMessage, SystemMessage } = require("@langchain/core/messages");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const tools = require("./chatbotTools.js");

console.log('Creating agent...');

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

const systemPrompt = `You are a helpful assistant. You will be given a user message and you need to respond in a way that is helpful and informative. Only respond to requets related to answering questions about the patient's diabetes health dashboard.`;
const userInformation = "The patient's name is {name}. Their email is {email}."
const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt + userInformation],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
]);

const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
}).catch((error) => {
    console.error("Error creating agent:", error);
    throw error; // Rethrow the error to be handled by the caller
}
);

const agentExecutor = new AgentExecutor({
    agent,
    tools,
});
console.log('Agent created.');


exports.handleMessage = async (req, res) => {
    const { input, name, email, chat_history } = req.body;
    const result = await agentExecutor.invoke({
        input: input,
        name: name,
        email: email,
        chat_history: chat_history,
      }).catch((error) => {
        console.error("Error invoking agent:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      });

    res.status(200).json({
        result: result,
    });
}