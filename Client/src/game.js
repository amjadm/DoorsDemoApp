import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [openedDoor, setOpenedDoor] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createGame = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/games`);
      setGameId(response.data.gameId);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const selectDoor = async (doorNumber) => {
    console.log("doorNumber: ", doorNumber);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/games/${gameId}/select`, { doorNumber: doorNumber });
      setSelectedDoor(doorNumber);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const openDoor = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/games/${gameId}/open`);
      console.log("response: ", response.data.openedDoor);
      setOpenedDoor(response.data.openedDoor);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const makeFinalChoice = async (doorNumber) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/games/${gameId}/final`, { doorNumber: doorNumber });
      setFinalChoice(doorNumber);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getGameOutcome = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/games/${gameId}`);
      console.log("response: ", response.data);
      setOutcome(response.data.outcome);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameId(null);
    setSelectedDoor(null);
    setOpenedDoor(null);
    setFinalChoice(null);
    setOutcome(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (gameId && selectedDoor !== null && openedDoor !== null && finalChoice !== null) {
      getGameOutcome();
    }
  }, [gameId, selectedDoor, openedDoor, finalChoice]);


  // Render game component
  return (

    
    <div className="wrapper">
      <div className="container">
        {!gameId && (
          <>
            <h2>Welcome to Let's Make a Deal!</h2>
            <button className="start-button" onClick={createGame} disabled={loading}>
              Start Game
            </button>
          </>
        )}
        {gameId && !outcome && (
          <>
            <h2>Select a Door</h2>
            <div className="door-container">
              <button className={selectedDoor == 1 ? "door-button selectedDoorButton" : "door-button"}     onClick={() => selectDoor(1)} disabled={selectedDoor !== null || loading}>
                Door 1
              </button>
              <button className={selectedDoor == 2 ? "door-button selectedDoorButton" : "door-button"}  onClick={() => selectDoor(2)} disabled={selectedDoor !== null || loading}>
                Door 2
              </button>
              <button className={selectedDoor == 3 ? "door-button selectedDoorButton" : "door-button"}  onClick={() => selectDoor(3)} disabled={selectedDoor !== null || loading}>
                Door 3
              </button>
            </div>
          </>
        )}
        {gameId && selectedDoor !== null && !openedDoor && (
          <>
            <h2>One of the Other Doors Will Be Opened</h2>
            <button className="open-button" onClick={openDoor} disabled={loading}>
              Open a Door
            </button>
          </>
        )}
        {gameId && selectedDoor !== null && openedDoor !== null && !finalChoice && (
          <>
            <h2>Do You Want to Switch Doors?</h2>
            <div>
              <button className="door-button" onClick={() => makeFinalChoice(selectedDoor)} disabled={loading}>
                Stay with Door {selectedDoor}
              </button>
              <button className="door-button" onClick={() => makeFinalChoice(6 - selectedDoor - openedDoor)} disabled={loading}>
                Switch to Door {6 - parseInt(selectedDoor) - parseInt(openedDoor)}
              </button>
            </div>
          </>
        )}
        {outcome && (
          <>
            <h2>The Game is Over!</h2>
            <p className='outcome'>You {outcome === 'win' ? <text>won<code>&#x1F3C6;</code></text>: 'lost'}!</p>
            <button className="play-again-button" onClick={resetGame}>Play Again</button>
          </>
        )}
        {error && <p>An error occurred: {error}</p>}
      </div>
    </div>
    

  );
};

export default Game;