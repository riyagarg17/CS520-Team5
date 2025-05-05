import React from "react";
import "../styles/AlertBanner.css";

const AlertBanner = ({ type, message, onClose }) => {
  if (!message) return null;

  const typeClass = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
  }[type] || "alert-info";

  return (
    <div className={`alert-banner ${typeClass}`}>
      <span>{message}</span>
      <button onClick={onClose}>✖</button>
    </div>
  );
};

export default AlertBanner;
