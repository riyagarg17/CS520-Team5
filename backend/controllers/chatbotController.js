// filepath: /Users/samonuallain/CS520-Team5/backend/controllers/chatbotController.js
require('dotenv').config();

const { ChatOpenAI } = require("@langchain/openai");
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const {doctor_tools, patient_tools} = require("./chatbotTools.js");

let doctorAgentExecutor, patientAgentExecutor; // Declare agentExecutor variable in the module scope

// Use an async IIFE to initialize the agent
(async () => {
    try {
        console.log('Creating agent...');

        const llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0,
        });

        const systemPrompt = `You are a helpful assistant. You will be given a user message and you need to respond in a way that is helpful and informative. \
                                Only respond to requets related to answering questions about the patient's diabetes health dashboard. Only use tools that are allowed to be used for the current user (either patient or doctor).\
                                Make sure your responses are clear and concise. Use their name when addressing them and be friendly.\
                                If the user is looking for more information that you do no have, point them towards the other dashboard features, which include: \
                                1. Health overview: This includes the patient's blood sugar levels, weight, and other health metrics.\
                                2. Appointments: This includes the patient's upcoming appointments with their doctor, and new ones can be scheduled.\
                                3. Chatbot: This is the current chat interface where the user can ask questions and get answers.\
                                `;
        const userInformation = "The patient's name is {name}. Their email is {email}. The user is a {userType}. The user's gender is {userGender}.\n";
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt + userInformation],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
            new MessagesPlaceholder("agent_scratchpad"),
        ]);

        const patient_agent = await createOpenAIFunctionsAgent({ // Now await is inside an async function
            llm,
            tools: patient_tools,
            prompt,
        }).catch(console.log);

        const doctor_agent = await createOpenAIFunctionsAgent({ // Now await is inside an async function
            llm,
            tools: doctor_tools,
            prompt,
        }).catch(console.log);

        patientAgentExecutor = new AgentExecutor({ // Assign the created executor to the module-scoped variable
            agent: patient_agent,
            tools: patient_tools,
        });

        doctorAgentExecutor = new AgentExecutor({ // Assign the created executor to the module-scoped variable
            agent: doctor_agent,
            tools: doctor_tools,
        });

        console.log('Agents created successfully.');
    } catch (error) {
        console.error("Error creating agent:", error);
        // Optionally handle the error more gracefully, e.g., prevent the server from starting
        process.exit(1); // Exit if agent creation fails
    }
})();


function convertHistory(messages) {
    return messages.map((message) => {
        if (message.sender === "user") {
            return new HumanMessage(message.text);
        } else if (message.sender === "bot") {
            return new AIMessage(message.text);
        }
        return null; // Handle unexpected message types
    })
}

exports.handleMessage = async (req, res) => {
    const { message, userInformation, chat_history } = req.body;
    let agent = null;
    if (userInformation.userType === "doctor") {
        agent = doctorAgentExecutor;
        console.log("Using doctor agent executor");
    }
    else if (userInformation.userType === "patient") {
        agent = patientAgentExecutor;
        console.log("Using patient agent executor");
    }

    // Check if agentExecutor is initialized
    if (!agent) {
        console.error("Agent not initialized yet.");
        return res.status(503).json({ error: "Service temporarily unavailable. Agent is initializing." });
    }

    try {
        let convertedHistory = convertHistory(chat_history); // Convert chat history to the expected format
        const result = await agent.invoke({
            input: message,
            name: userInformation.name,
            email: userInformation.email,
            userType: userInformation.userType,
            userGender: userInformation.userGender,
            chat_history: convertedHistory, // Ensure chat_history is an array
        });

        res.status(200).json({
            result: result.output,
        });
    } catch (error) {
        console.error("Error invoking agent:", error);
        res.status(500).json({ error: "Internal server error during agent invocation" });
    }
}