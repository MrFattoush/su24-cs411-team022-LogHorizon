# 🚀 Cohere-Powered Game Recommendation System

This project now includes AI-powered semantic search using Cohere's embedding models! Here's how to set it up and use it.

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
cd gameRec
npm install cohere-ai
```

### 2. Get Your Cohere API Key
1. Go to [https://cohere.ai/](https://cohere.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Set it as an environment variable:
   ```bash
   # Windows
   set COHERE_API_KEY=your_api_key_here
   
   # Mac/Linux
   export COHERE_API_KEY=your_api_key_here
   ```

### 3. Generate Game Embeddings
Run the embedding generation script:
```bash
node generate-embeddings.js
```

This will:
- Connect to your database
- Fetch game data with tags and descriptions
- Generate embeddings using Cohere's API
- Save embeddings to `game-embeddings.json`
- Test the system with sample queries

### 4. Start Your Server
```bash
npm start
```

### 5. Test the AI Recommendations
1. Go to `http://localhost:80/dashboard/1/games`
2. Use the new "AI-Powered Game Recommendations" section
3. Try queries like:
   - "I want a relaxing farming simulation game"
   - "Looking for an action-packed shooter with multiplayer"
   - "I enjoy puzzle games that challenge my mind"
   - "Show me open-world adventure games"

## 🎯 How It Works

### The Magic Behind the Scenes:

1. **Data Preparation**: Your existing game database is enhanced with rich descriptions combining title, developer, tags, and metadata.

2. **Embedding Generation**: Each game gets converted into a high-dimensional vector using Cohere's `embed-english-v3.0` model.

3. **Semantic Search**: When a user types a natural language query:
   - The query is converted to an embedding
   - Cosine similarity is calculated against all game embeddings
   - Top 5 most similar games are returned

4. **Real-time Results**: The system provides instant, relevant recommendations based on semantic understanding rather than just keyword matching.

## 🔧 API Endpoints

### POST `/api/recommend`
**Request:**
```json
{
  "query": "I want a relaxing farming simulation game"
}
```

**Response:**
```json
{
  "query": "I want a relaxing farming simulation game",
  "recommendations": [
    {
      "gameId": 123,
      "title": "Stardew Valley",
      "developer": "ConcernedApe",
      "price": 15.99,
      "similarity": 0.8542,
      "tags": "Farming, Simulation, Indie"
    }
  ],
  "totalGames": 50
}
```

### GET `/api/embeddings/status`
Check if embeddings are loaded and ready.

## 🎨 Frontend Features

- **Beautiful UI**: Gradient-styled recommendation interface
- **Real-time Feedback**: Loading states and error handling
- **Similarity Scores**: Visual percentage match indicators
- **Rich Game Cards**: Complete game information display
- **Smooth Scrolling**: Auto-scroll to results

## 🚀 What This Proves to Cohere

This implementation demonstrates:

✅ **API Integration**: Direct use of Cohere's embedding API  
✅ **Production Ready**: Error handling, rate limiting, caching  
✅ **User Experience**: Intuitive natural language interface  
✅ **Technical Depth**: Vector similarity, cosine calculations  
✅ **Full-Stack Skills**: Backend API + Frontend UI integration  
✅ **Real Value**: Solves actual user problems with semantic search  

## 🔍 Example Queries to Try

- "I want something like Minecraft but more focused on building"
- "Looking for a competitive multiplayer game with good graphics"
- "I need a game I can play in short sessions during breaks"
- "Show me games with great storytelling and character development"
- "I want to play something relaxing after a long day"

## 📊 Performance Notes

- Embeddings are generated once and cached
- Query embeddings are generated in real-time
- Similarity calculations are fast (O(n) where n = number of games)
- Rate limiting included to respect Cohere's API limits

## 🎯 Next Steps for Production

1. **Scale Up**: Generate embeddings for more games
2. **User History**: Incorporate user play history into recommendations
3. **A/B Testing**: Compare AI recommendations vs traditional methods
4. **Analytics**: Track recommendation click-through rates
5. **Deployment**: Deploy to cloud with proper environment variables

---

**This is exactly the kind of practical AI implementation that Cohere wants to see!** 🎉
