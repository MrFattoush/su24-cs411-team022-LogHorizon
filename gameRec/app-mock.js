var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var { CohereClient } = require('cohere-ai');
var mockGames = require('./mock-data');

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

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async function(req, res) {
    res.render('index', { 
        title: 'Game Recommendation System - Mock Mode',
        message: 'Running in mock mode with sample game data'
    });
});

app.get('/dashboard/:userId', async function(req,res) {
  res.render('dashboard', { userId: req.params.userId });
});

app.get('/dashboard/:userId/user', async function(req, res) {
  res.render('user', { userId: req.params.userId });
});

app.get('/dashboard/:userId/games', async function(req, res) {
  res.render('games', { userId: req.params.userId });
});

app.get('/dashboard/:userId/ratings', async function(req, res) {
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

module.exports = app;
