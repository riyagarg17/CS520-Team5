import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

const sendChatMessage = async (url, message, chat_history, name, email) => {
    const request = {
        message: message,
        chat_history: chat_history,
        name: name,
        email: email,
    };
    return fetchClient(url, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export const sendChatMessageWithContext = async (message, chat_history, name, email) => {
    try {
        const url = `${ENDPOINTS.chatbot}`;
        return sendChatMessage(url, message, chat_history, name, email);
    } catch (error) {
        throw error;
    }
}