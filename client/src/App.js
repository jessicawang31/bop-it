import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BopIt from './components/BopIt.js';
import Leaderboard from './components/Leaderboard.js';
import Chatbox from './components/Chatbox.js';
import Profile from './components/Profile.js';
import './css/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BopIt />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
