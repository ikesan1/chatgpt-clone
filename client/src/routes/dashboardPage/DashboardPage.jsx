import "./dashboardPage.css";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    // Check if userId is available
    if (userId) {
      setIsLoading(false); // Set loading to false when userId is ready
    }
  }, [userId]); // Re-run this effect when userId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    console.log(text);

    await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, text }),
    });
  };

  if (isLoading) {
    // Render a loading indicator while waiting for userId
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" className="dashboardLogo" />
          <h1>TOYAI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
          <div className="option">
            <img src="robochat.png" alt="" />
            <span>Speak with AI Voice</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
