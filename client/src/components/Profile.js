import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import '../css/Profile.css';

function Profile() {
  const [analytics, setAnalytics] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/users/myIdentity", {
          credentials: "include", 
        });
        const identity = await response.json();

        if (identity.status === "loggedin") {
          setUsername(identity.userInfo.username);  // set the current user's username
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    }

    fetchUsername();
  }, []);

  useEffect(() => {
    if (!username) return; // dont fetch if username is not set

    async function fetchAnalytics() {
      try {
        const response = await fetch(`https://bop-it-final-project-back.onrender.com/api/v1/scores/analytics?username=${encodeURIComponent(username)}`, {
          credentials: "include", 
        });
        const data = await response.json(); 
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    }

    fetchAnalytics();
  }, [username]); // is username ever changes, refetch 

  return (
    <>
      <NavBar />
      <div className="grey-box">
        <h1 className="profile-text">Your Metrics</h1>
        {analytics ? (
          <div className="metrics">
            <p><strong>Number of Games Played:</strong>{analytics.totalGames}</p>
            <p><strong>Highest Achieved Score:</strong>{analytics.highestScore}</p>
            <p><strong>Current Average Score:</strong>{analytics.meanScore}</p>
          </div>
        ) : (
          <p className="login-prompt">Login to Keep Track!</p>
          // <h3>Login to Keep Track!</h3>
        )}
      </div>
    </>
  );
}

export default Profile;