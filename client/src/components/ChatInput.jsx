import React from "react";
import "../styles/Chatbot.css"; // Assuming styles are in Chatbot.css

const ChatInput = ({ value, onChange, onSend, isLoading }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading && value.trim()) {
      onSend();
    }
  };

  const handleSendClick = () => {
    if (!isLoading && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="chat-input-area">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={isLoading}
        className="chat-input"
      />
      <button
        onClick={handleSendClick}
        disabled={isLoading || !value.trim()}
        className="send-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
