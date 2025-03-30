import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import '../css/Chatbox.css';

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [newChat, setNewChat] = useState("");

  // fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/chats/messages", {
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data);                  // set the chat messages
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newChat.trim()) {
      alert("The chat message cannot be empty.");
      return;
    }

    try {
      console.log("Sending chat message:", newChat);
      const response = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newChat }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {

        // refresh the chat messages after posting
        const refreshResponse = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/chats/messages", {
          credentials: "include",
        });

        const refreshedMessages = await refreshResponse.json();
        setMessages(refreshedMessages);
        setNewChat("");                   // clear the input field
      }
    } catch (error) {
      console.error("Error posting chat message:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="grey-box">
        <h1 className="chatbox-text">Chatbox</h1>
        {messages.length > 0 ? (
          <div className="chatbox-messages">
            {messages.map((message, index) => (
              // <div key={index} className="chatbox-row">
              //   <p><strong>{message.username}</strong>: {message.message}</p>
              // </div>

              <div className="chatbox-row">
              <p>
                <strong>{message.username}:</strong> 
                <span className="message"> {message.message}</span>
              </p>
              </div>

            ))}
          </div>
        ) : (
          <p>No messages available.</p>
        )}
      
        <form onSubmit={handleSubmit} className="chatbox-form">
          <input
            type="text"
            value={newChat}
            onChange={(e) => setNewChat(e.target.value)}
            placeholder="Type your message..."
            className="chatbox-input"
          />

          <button type="submit" className="chatbox-submit">
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default Chatbox;