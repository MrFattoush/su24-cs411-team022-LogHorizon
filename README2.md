# 🎮 Game Recommender v2 — Now with Cohere Embeddings

This project is an upgrade to my original [LogHorizon Game Recommender](https://github.com/cs411-alawini/su24-cs411-team022-LogHorizon).  
Instead of simple filters and SQL queries, this version uses **Cohere's Embed API** to provide **semantic search**.  

Users can type natural-language queries like:  
> "I want a cozy farming sim with multiplayer" or "I want to play a survival game"  

And the app returns the closest-matching games from the database using vector similarity.

---

## 🚀 Features
- Natural-language search powered by **Cohere Embed v3**  
- Game descriptions embedded into vectors and stored for fast retrieval  
- Query → vector → cosine similarity → ranked results  
- REST API endpoint (`/api/recommend`) for flexible integration  
- Simple React frontend for entering queries and displaying top games  

---

## 🛠 Tech Stack
- **Backend:** Node.js / Express (API + Cohere integration)  
- **Frontend:** React (query input + result display)  
- **Database:** MySQL / SQLite (games + embeddings)  
- **AI:** Cohere Embed API (text → vectors)  
- **Deployment:** Vercel (frontend) + Render (backend)  

---

## 🔧 Setup

### 1. Clone repo
```bash
git clone https://github.com/yourusername/game-recommender-v2
cd game-recommender-v2
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env`:
```
COHERE_API_KEY=your_api_key_here
```

Run backend:
```bash
npm start
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 💡 How it Works

1. Each game description is embedded once using Cohere's `embed-english-v3.0`.
2. Stored vectors are compared against query vectors with cosine similarity.
3. Top N matches are returned with metadata (title, description, etc.).

---

## 📸 Demo

Try queries like:
- "Open-world RPG with crafting and exploration"
- "Cozy farming sim with multiplayer"
- "Competitive team shooter with fast pace"

---

## 🔗 Links

- **Live Demo:** [Insert link here]
- **Repo:** [Insert link here]
- **Powered by Cohere**

---

## 🔥 Why this works:  
- Clearly shows **Cohere integration** (not just old project).  
- Recruiters can instantly see the "before → after" story.  
- Clean, professional README makes a small project look big.  

---

## 📋 Implementation Details

### Files Added/Modified:
- **Backend:** `app.js` - Added Cohere client, embeddings loading, cosine similarity, `/api/recommend` endpoint
- **Frontend:** `views/games.ejs` - Added AI recommendation UI with query input and results display
- **Mock Mode:** `generate-embeddings-mock.js`, `app-mock.js`, `server-mock.js` - For testing without database
- **Dependencies:** Added `cohere-ai` package to `package.json`

### API Endpoints:
- `POST /api/recommend` - Semantic search with natural language queries
- `GET /api/embeddings/status` - Check embeddings availability

### Quick Start (Mock Mode):
```bash
# Set API key
$env:COHERE_API_KEY="your_key_here"

# Generate embeddings
node generate-embeddings-mock.js

# Start server
node server-mock.js

# Visit: http://localhost:3000/dashboard/1/games
```