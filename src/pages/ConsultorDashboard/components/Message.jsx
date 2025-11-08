// web-consultor/src/components/Message.jsx
import React from "react";

const Message = ({ content, user, type, timestamp }) => {
  const isMine = user === "Consultor" || type === "outbound";
  const isSystem = type === "system";

  const messageStyle = {
    maxWidth: "70%",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    wordWrap: "break-word",
    float: isMine ? "right" : "left",
    clear: "both",
    backgroundColor: isSystem ? "#fff3cd" : isMine ? "#364fab" : "#e2e2e2",
    color: isSystem ? "#856404" : isMine ? "white" : "#333",
    border: isSystem ? "1px solid #ffeaa7" : "none",
  };

  return (
    <div style={messageStyle}>
      {!isMine && !isSystem && (
        <div
          style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}
        >
          {user}
        </div>
      )}
      <div style={{ marginBottom: "5px" }}>{content}</div>
      {timestamp && (
        <div
          style={{
            fontSize: "10px",
            color: isSystem
              ? "#856404"
              : isMine
              ? "rgba(255,255,255,0.7)"
              : "#666",
            textAlign: "right",
          }}
        >
          {timestamp}
        </div>
      )}
    </div>
  );
};

export default Message;
