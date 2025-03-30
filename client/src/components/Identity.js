import React, { useEffect, useState } from "react";

function Identity({ onUserFetched }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch("https://bop-it-final-project-back.onrender.com/api/v1/users/myIdentity", {
          credentials: "include",
        });
        let identity = await response.json();

        if (identity.status === "loggedin") {
          setUser(identity.userInfo);
          onUserFetched(identity.userInfo);
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    }

    checkLoginStatus();
  }, [onUserFetched]);

  // KEY POINT HERE!!!
  // Redirect to Express routes!!!
  const handleLogin = () => {
    window.location.href = "https://bop-it-final-project-back.onrender.com/signin"; 
  };
  
  const handleLogout = () => {
    window.location.href = "https://bop-it-final-project-back.onrender.com/signout"; 
  };

  return (
    <div>
      {user ? (
        <button className="logout-button" onClick={handleLogout}>
          LOGOUT
        </button>
      ) : (
        <button className="login-button" onClick={handleLogin}>
          LOGIN
        </button>
      )}
    </div>
  );
}

export default Identity;
