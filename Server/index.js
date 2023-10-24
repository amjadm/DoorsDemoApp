const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbPath = 'games.json';

// Create the database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '{}');
}

// Load the games from the database file
const games = JSON.parse(fs.readFileSync(dbPath));

// Save the games to the database file
function saveGames() {
  fs.writeFileSync(dbPath, JSON.stringify(games));
}
// 
// Endpoint for creating a new game
app.post('/games', (req, res) => {
  const gameId = uuidv4();
  const game = {
    selectedDoor: null,
    openedDoor: null,
    finalChoice: null,
    prize: Math.floor(Math.random() * 3) + 1,
    outcome: null,
  };
  games[gameId] = game;
  saveGames();
  res.json({ gameId });
});

// Endpoint for selecting a door
app.post('/games/:gameId/select', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  const { doorNumber } = req.body;
  game.selectedDoor = doorNumber;
  saveGames();
  res.sendStatus(200);
});

// Endpoint for opening a door
app.post('/games/:gameId/open', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  
  const unopenedDoors = [1, 2, 3].filter(d => d !== game.selectedDoor);
  const openedDoor = unopenedDoors[Math.floor(Math.random() * unopenedDoors.length)];
  game.openedDoor = openedDoor;
  saveGames();
  res.json({ openedDoor });
});

// Endpoint for making a final choice
app.post('/games/:gameId/final', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  const { doorNumber } = req.body;
  game.finalChoice = doorNumber;
  game.outcome = game.finalChoice === game.prize ? 'win' : 'lose';
  saveGames();
  res.sendStatus(200);
});

// Endpoint for getting the game state and outcome
app.get('/games/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const game = games[gameId];
  if (!game) {
    res.sendStatus(404);
  } else {
    const { selectedDoor, openedDoor, finalChoice, prize, outcome } = game;
    res.json({ selectedDoor, openedDoor, finalChoice, prize, outcome });
  }
});

// Endpoint for deleting a game
app.delete('/games/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  delete games[gameId];
  saveGames();
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));