import React, {useState} from "react";
import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import Identity from "./Identity";

function NavBar() { 
  const [user, setUser] = useState(null);

  const handleUserFetched = (userInfo) => {
    setUser(userInfo);
  };
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><Link to="/chatbox">Chatbox</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <Identity onUserFetched={handleUserFetched} />
      </ul>
    </nav>
  );
};

export default NavBar;