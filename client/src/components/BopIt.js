import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import BopItImg from '../images/bopit.png';
import '../css/BopIt.css';

function BopIt() {

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [command, setCommand] = useState("");
  const [hasClicked, setHasClicked] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [time, setTime] = useState(4000);

  const commands = ["Bop it!", "Twist it!", "Pull it!"];


  const correctInput = (input) => {
      if (!gameOver && (input !== command || hasClicked)) {
        setGameOver(true);
        saveScore(score);
      } else {
        addScore();
        setHasClicked(true);
      }
  }

  const getRandomCommand = () => {
    const randomIndex = Math.floor(Math.random() * commands.length);
    return commands[randomIndex];
  }

  // Currently: every 5 seconds, a new command is shown, the highlight effect flashes, 
  // and hasClicked is reset. If a player doesn't respond within those 5 seconds, 
  // the game is over and score is saved. The return values at the end make sure that 
  // only one interval and timeout run at a time.
  
  useEffect(() => {
    if (gameOver) {
      return;
    }
    const interval = setInterval(() => {
      setCommand(getRandomCommand());
      setHasClicked(false);
      setHighlight(true);

      setTimeout(() => setHighlight(false), 500);
    }, time);

    const inputTimeout = setTimeout(() => {
      if (!hasClicked) {
        setGameOver(true);
        saveScore(score);
      }
    }, time);

    return () => {
      clearInterval(interval);
      clearTimeout(inputTimeout); 
    }
  }, [gameOver, command, hasClicked]);


  // adds + 1 to the score if the game is not over
  const addScore = () => {
    if (!gameOver) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore % 5 === 0 && time >= 500) {
        setTime(time - (newScore >= 20 ? 250 : 500));
      }
    }
  }

  // sends score to the /game endpoint in scores.js
  async function saveScore(newScore) {
    try {
      const response= await fetch(`https://bop-it-final-project-back.onrender.com/api/v1/scores/game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({score: newScore})
      })

      const responsejson = await response.json();
      console.log(responsejson);
    } catch (error) {
        console.log(error);
    }
    
  }

  // triggered when PLAY button is clicked, this resets all state variables to their appropriate defaults
  // setTimeout is used to highlight the first command for half a second
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setCommand(getRandomCommand());
    setHasClicked(false);
    setHighlight(true);
    setTime(4000);

    setTimeout(() => setHighlight(false), 500);
  }



  return (
    <>
      <NavBar />
      <h1>Score: {score}</h1>
      {!gameOver && <h2 className={`command ${highlight ? "highlight" : ""}`}>{command}</h2>}
      <div className='main-container'>
        <div className="game-container">
          <div className="image-wrapper">
            <img src={BopItImg} alt="Bop It Game" className="bop-it-image" />
            <div className="clickable bop-it" onClick={() => correctInput("Bop it!")}></div>
            <div className="clickable twist-it" onClick={() => correctInput("Twist it!")}></div>
            <div className="clickable pull-it" onClick={() => correctInput("Pull it!")}></div>
          </div>
        </div>
        {gameOver && <button className='play-button' onClick={startGame}>PLAY</button>}
      </div>
    </>
  );
}

export default BopIt;
