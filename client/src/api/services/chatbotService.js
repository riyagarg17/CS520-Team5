/**
 * Chatbot service handling communication with the AI chatbot backend.
 * Manages message history and context for personalized responses.
 */

import fetchClient from "../client";
import { ENDPOINTS } from "../endpoint";

const sendChatMessage = async (url, message, chat_history, userInformation) => {
    const request = {
        message: message,
        chat_history: chat_history,
        userInformation: userInformation,
    };
    return fetchClient(url, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export const sendChatMessageWithContext = async (message, chat_history, userInformation) => {
    try {
        const url = `${ENDPOINTS.chatbot}`;
        return sendChatMessage(url, message, chat_history, userInformation);
    } catch (error) {
        throw error;
    }
}