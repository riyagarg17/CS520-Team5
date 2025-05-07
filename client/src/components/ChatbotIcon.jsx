import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ChatbotIcon.css';
import doctorIcon from '../assets/doctor_icon.jpg'; // Import the image

const ChatbotIcon = () => {
  return (
    <Link to="/chatassist" className="chatbot-container">
      <div className="speech-bubble">
        Hello! How can I assist you today?
      </div>
      {/* Use the imported image variable */}
      <img src={doctorIcon} alt="Chatbot" className="chatbot-icon" />
    </Link>
  );
};

export default ChatbotIcon;
