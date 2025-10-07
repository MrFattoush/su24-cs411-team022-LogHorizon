require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var { CohereClient } = require('cohere-ai');
var mockGames = require('./mock-data');
var session = require('express-session');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'YOUR_COHERE_API_KEY_HERE'
});

let gameEmbeddings = [];
try {
    const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
    if (fs.existsSync(embeddingsPath)) {
        gameEmbeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
        console.log(`Loaded ${gameEmbeddings.length} game embeddings`);
    } else {
        console.log('No embeddings file found. Run generate-embeddings-mock.js first.');
    }
} catch (error) {
    console.error('Error loading embeddings:', error);
}

// Load users from JSON file
let users = [];
const usersPath = path.join(__dirname, 'users.json');
try {
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        console.log(`Loaded ${users.length} users`);
    }
} catch (error) {
    console.error('Error loading users:', error);
}

// Helper function to save users
function saveUsers() {
    try {
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

// Helper function to find user
function findUser(username, password) {
    return users.find(u => u.username === username && u.password === password);
}

// Helper function to check if username exists
function usernameExists(username) {
    return users.find(u => u.username === username);
}

// Helper function to check if email exists
function emailExists(email) {
    return users.find(u => u.email === email);
}

function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

var app = express();

// Session middleware
app.use(session({
    secret: 'game-recommender-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

// Login routes
app.get('/login', function(req, res) {
    res.render('login', { error: null });
});

app.post('/login', function(req, res) {
    const { username, password } = req.body;
    
    const user = findUser(username, password);
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/dashboard/1/games');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Sign-up routes
app.get('/signup', function(req, res) {
    res.render('signup', { error: null, success: null });
});

app.post('/signup', function(req, res) {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        return res.render('signup', { error: 'All fields are required', success: null });
    }
    
    if (username.length < 3) {
        return res.render('signup', { error: 'Username must be at least 3 characters', success: null });
    }
    
    if (password.length < 4) {
        return res.render('signup', { error: 'Password must be at least 4 characters', success: null });
    }
    
    if (password !== confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match', success: null });
    }
    
    if (usernameExists(username)) {
        return res.render('signup', { error: 'Username already exists', success: null });
    }
    
    if (emailExists(email)) {
        return res.render('signup', { error: 'Email already registered', success: null });
    }
    
    // Create new user
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: username,
        email: email,
        password: password // In production, this should be hashed!
    };
    
    users.push(newUser);
    
    if (saveUsers()) {
        // Auto-login after signup
        req.session.userId = newUser.id;
        req.session.username = newUser.username;
        res.redirect('/dashboard/1/games');
    } else {
        res.render('signup', { error: 'Error creating account. Please try again.', success: null });
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', async function(req, res) {
    res.redirect('/login');
});

app.get('/dashboard/:userId', requireAuth, async function(req,res) {
  res.render('dashboard', { userId: req.params.userId });
});

app.get('/dashboard/:userId/user', requireAuth, async function(req, res) {
  res.render('user', { userId: req.params.userId });
});

app.get('/dashboard/:userId/games', requireAuth, async function(req, res) {
  res.render('games', { userId: req.params.userId });
});

app.get('/dashboard/:userId/ratings', requireAuth, async function(req, res) {
  res.render('ratings', { userId: req.params.userId });
});

app.get('/api/games/:userId', async function(req, res) {
    res.json({ games: mockGames.slice(0, 10) });
});

app.get('/api/user/:id', (req, res, next) => {
    const userProfile = {
        user: { UserId: req.params.id, Username: 'Demo User', Email: 'demo@example.com' },
        gamesPlayed: mockGames.slice(0, 5),
        recommendations: []
    };
    res.json(userProfile);
});

app.get('/api/dashboard/:id', (req, res, next) => {
    const dashboardData = {
        topDevelopers: [
            { Name: 'ConcernedApe', AvgRating: 4.8, GameCount: 1 },
            { Name: 'CD Projekt Red', AvgRating: 4.7, GameCount: 2 },
            { Name: 'Valve', AvgRating: 4.6, GameCount: 2 }
        ],
        topRatedGames: mockGames.slice(0, 5).map(game => ({
            GameID: game.GameID,
            Title: game.Title,
            Developer: game.Developer,
            AvgRating: 4.5 + Math.random() * 0.5
        }))
    };
    res.json(dashboardData);
});

app.get('/api/game', (req, res, next) => {
    res.json(mockGames);
});

app.post('/api/recommend', async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    if (gameEmbeddings.length === 0) {
      return res.status(500).json({ 
        error: 'No game embeddings available. Please run generate-embeddings-mock.js first.' 
      });
    }
    
    console.log(`Processing semantic search for: "${query}"`);
    const response = await cohere.embed({
      texts: [query],
      model: 'embed-english-v3.0',
      inputType: 'search_query'
    });
    
    const queryEmbedding = response.embeddings[0];
    
    const similarities = gameEmbeddings.map(game => ({
      gameId: game.gameId,
      title: game.title,
      developer: game.developer,
      price: game.price,
      releaseDate: game.releaseDate,
      tags: game.tags,
      description: game.description,
      similarity: cosineSimilarity(queryEmbedding, game.embedding)
    }));
    
    const topResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
    
    console.log(`Found ${topResults.length} recommendations`);
    
    res.json({
      query: query,
      recommendations: topResults,
      totalGames: gameEmbeddings.length
    });
    
  } catch (error) {
    console.error('Error in semantic search:', error);
    res.status(500).json({ 
      error: 'Error processing semantic search',
      details: error.message 
    });
  }
});

app.get('/api/embeddings/status', (req, res) => {
  res.json({
    totalEmbeddings: gameEmbeddings.length,
    hasEmbeddings: gameEmbeddings.length > 0,
    lastUpdated: gameEmbeddings.length > 0 ? 'Available' : 'Not generated'
  });
});

// Delete game
app.delete('/api/games/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    
    // Find game index
    const gameIndex = mockGames.findIndex(g => g.GameID === gameId);
    const embeddingIndex = gameEmbeddings.findIndex(e => e.gameId === gameId);
    
    if (gameIndex === -1) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const deletedGame = mockGames[gameIndex];
    
    // Remove from arrays
    mockGames.splice(gameIndex, 1);
    if (embeddingIndex !== -1) {
      gameEmbeddings.splice(embeddingIndex, 1);
    }
    
    // Save to files
    const mockDataPath = path.join(__dirname, 'mock-data.js');
    const mockDataContent = `const mockGames = ${JSON.stringify(mockGames, null, 4)};\n\nmodule.exports = mockGames;\n`;
    fs.writeFileSync(mockDataPath, mockDataContent);
    
    const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
    fs.writeFileSync(embeddingsPath, JSON.stringify(gameEmbeddings, null, 2));
    
    console.log(`✅ Game deleted: ${deletedGame.Title}`);
    
    res.json({
      message: `Game "${deletedGame.Title}" deleted successfully!`,
      totalGames: mockGames.length
    });
    
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ 
      error: 'Error deleting game',
      details: error.message 
    });
  }
});

// Update game with AI embeddings
app.put('/api/games/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    const { title, developer, price, tags, releaseDate } = req.body;
    
    // Validate required fields
    if (!title || !developer || price === undefined || !tags || !releaseDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Find game index
    const gameIndex = mockGames.findIndex(g => g.GameID === gameId);
    const embeddingIndex = gameEmbeddings.findIndex(e => e.gameId === gameId);
    
    if (gameIndex === -1) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Create updated description for AI embeddings
    const description = `${title} by ${developer}. Tags: ${tags} Released: ${releaseDate}. Price: $${price}`;
    
    // Update game object
    mockGames[gameIndex] = {
      GameID: gameId,
      Title: title,
      Developer: developer,
      Price: parseFloat(price),
      ReleaseDate: releaseDate,
      Tags: tags,
      Description: description
    };
    
    console.log(`Updating game: ${title}`);
    
    // Generate new embeddings using Cohere
    try {
      const response = await cohere.embed({
        texts: [description],
        model: 'embed-english-v3.0',
        inputType: 'search_document'
      });
      
      // Update embedding object
      const updatedEmbedding = {
        gameId: gameId,
        title: title,
        developer: developer,
        price: parseFloat(price),
        releaseDate: releaseDate,
        tags: tags,
        description: description,
        embedding: response.embeddings[0]
      };
      
      if (embeddingIndex !== -1) {
        gameEmbeddings[embeddingIndex] = updatedEmbedding;
      } else {
        gameEmbeddings.push(updatedEmbedding);
      }
      
      // Save to files
      const mockDataPath = path.join(__dirname, 'mock-data.js');
      const mockDataContent = `const mockGames = ${JSON.stringify(mockGames, null, 4)};\n\nmodule.exports = mockGames;\n`;
      fs.writeFileSync(mockDataPath, mockDataContent);
      
      const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
      fs.writeFileSync(embeddingsPath, JSON.stringify(gameEmbeddings, null, 2));
      
      console.log(`✅ Game updated successfully with AI embeddings: ${title}`);
      
      res.json({
        message: `Game "${title}" updated successfully with new AI embeddings!`,
        game: mockGames[gameIndex],
        totalGames: mockGames.length
      });
      
    } catch (embeddingError) {
      console.error('Error generating embeddings:', embeddingError);
      
      // Save game data even if embeddings fail
      const mockDataPath = path.join(__dirname, 'mock-data.js');
      const mockDataContent = `const mockGames = ${JSON.stringify(mockGames, null, 4)};\n\nmodule.exports = mockGames;\n`;
      fs.writeFileSync(mockDataPath, mockDataContent);
      
      res.json({
        message: `Game "${title}" updated, but AI embeddings failed. You may need to regenerate embeddings.`,
        game: mockGames[gameIndex],
        warning: 'Embeddings generation failed',
        totalGames: mockGames.length
      });
    }
    
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ 
      error: 'Error updating game',
      details: error.message 
    });
  }
});

// Add new game with AI embeddings
app.post('/api/game', async (req, res) => {
  try {
    const { title, developer, price, tags, releaseDate } = req.body;
    
    // Validate required fields
    if (!title || !developer || price === undefined || !tags || !releaseDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Generate unique GameID
    const newGameId = mockGames.length > 0 ? Math.max(...mockGames.map(g => g.GameID)) + 1 : 1;
    
    // Create description for AI embeddings
    const description = `${title} by ${developer}. Tags: ${tags} Released: ${releaseDate}. Price: $${price}`;
    
    // Create new game object
    const newGame = {
      GameID: newGameId,
      Title: title,
      Developer: developer,
      Price: parseFloat(price),
      ReleaseDate: releaseDate,
      Tags: tags,
      Description: description
    };
    
    console.log(`Adding new game: ${title}`);
    
    // Generate embeddings using Cohere
    try {
      const response = await cohere.embed({
        texts: [description],
        model: 'embed-english-v3.0',
        inputType: 'search_document'
      });
      
      // Create embedding object
      const newEmbedding = {
        gameId: newGameId,
        title: title,
        developer: developer,
        price: parseFloat(price),
        releaseDate: releaseDate,
        tags: tags,
        description: description,
        embedding: response.embeddings[0]
      };
      
      // Add to arrays
      mockGames.push(newGame);
      gameEmbeddings.push(newEmbedding);
      
      // Save to files
      const mockDataPath = path.join(__dirname, 'mock-data.js');
      const mockDataContent = `const mockGames = ${JSON.stringify(mockGames, null, 4)};\n\nmodule.exports = mockGames;\n`;
      fs.writeFileSync(mockDataPath, mockDataContent);
      
      const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
      fs.writeFileSync(embeddingsPath, JSON.stringify(gameEmbeddings, null, 2));
      
      console.log(`✅ Game added successfully with AI embeddings: ${title}`);
      
      res.json({
        message: `Game "${title}" added successfully with AI embeddings! Now available for recommendations.`,
        game: newGame,
        totalGames: mockGames.length
      });
      
    } catch (embeddingError) {
      console.error('Error generating embeddings:', embeddingError);
      // Still add the game even if embeddings fail
      mockGames.push(newGame);
      
      const mockDataPath = path.join(__dirname, 'mock-data.js');
      const mockDataContent = `const mockGames = ${JSON.stringify(mockGames, null, 4)};\n\nmodule.exports = mockGames;\n`;
      fs.writeFileSync(mockDataPath, mockDataContent);
      
      res.json({
        message: `Game "${title}" added, but AI embeddings failed. You may need to regenerate embeddings.`,
        game: newGame,
        warning: 'Embeddings generation failed',
        totalGames: mockGames.length
      });
    }
    
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ 
      error: 'Error adding game',
      details: error.message 
    });
  }
});

module.exports = app;
