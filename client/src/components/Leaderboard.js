import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import '../css/Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/scores/leaderboard", {
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLeaderboard(data.leaderboard);     // set leaderboard data
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <NavBar />
      <div className="grey-box">
        <h1 className="leaderboard-text">Leaderboard</h1>
        {leaderboard.length > 0 ? (
          <div className="leaderboard-data">
            {leaderboard.map((user, index) => (
              <div className="leaderboard-row">
              <p>
                <strong>{index + 1}. {user._id}: </strong>
                <span className="score">{user.highestScore}</span>
              </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </div>
    </>
  );
}

export default Leaderboard;
