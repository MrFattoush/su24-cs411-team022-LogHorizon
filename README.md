# 🎮 Game Recommender — AI-Powered with Cohere Embeddings

A full-stack game recommendation web application with **AI-powered semantic search** using Cohere's Embed API. Features user authentication, game reviews, and natural language search to find games based on what you describe, not just keywords.

Forked and enhanced from the original [CS411 LogHorizon project](https://github.com/cs411-alawini/su24-cs411-team022-LogHorizon).

---

## ✨ Key Features

### 🤖 AI-Powered Search
- **Natural language queries** powered by Cohere Embed v3
- Ask for games in plain English: *"I want a cozy farming sim with multiplayer"*
- Vector similarity search returns ranked results
- Real-time semantic matching with cosine similarity

### 👤 User Management
- User authentication with sessions
- Secure login/signup system
- User-specific data and review history

### ⭐ Review System
- Leave ratings (1-5 stars) and comments on games
- View your review history
- Edit and delete your reviews
- Prevent duplicate reviews per game

### 🎮 Game Management
- Browse all games with details
- Add new games (with automatic AI embedding generation)
- Edit game information
- Delete games

### 🔍 Advanced Search
- Traditional keyword search
- AI semantic search for contextual matching
- Filter by tags, price, and release date

---

## 🛠 Tech Stack

- **Backend:** Node.js + Express.js
- **Frontend:** EJS templates with Bootstrap 5
- **AI:** Cohere Embed API v3 (text → vector embeddings)
- **Database:** MySQL (production) / JSON files (mock mode)
- **Session Management:** express-session
- **Authentication:** Custom session-based auth

---

## 📁 Project Structure

```
su24-cs411-team022-LogHorizon/
├── gameRec/                      # Main application folder
│   ├── app.js                    # Database version (MySQL)
│   ├── app-mock.js              # Mock version (JSON files) ✅ Active
│   ├── server.js                 # Database server
│   ├── server-mock.js           # Mock server ✅ Active
│   ├── views/                    # EJS templates
│   │   ├── login.ejs            # Login page
│   │   ├── signup.ejs           # Signup page
│   │   ├── games.ejs            # Games page with AI search
│   │   ├── dashboard.ejs        # User dashboard
│   │   ├── ratings.ejs          # Ratings page
│   │   └── user.ejs             # User profile
│   ├── public/                   # Static assets
│   ├── users.json               # User data (mock mode)
│   ├── reviews.json             # Review data (mock mode)
│   ├── mock-data.js             # Game data (mock mode)
│   ├── game-embeddings.json     # Pre-computed AI embeddings
│   ├── generate-embeddings.js   # Generate embeddings (DB)
│   ├── generate-embeddings-mock.js  # Generate embeddings (mock)
│   ├── test-cohere-integration.js   # Test AI functionality
│   └── package.json             # Dependencies
├── doc/                          # Project documentation
├── README.md                     # This file
└── TeamInfo.md                   # Team information
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Cohere API key (get one free at [cohere.com](https://cohere.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MrFattoush/su24-cs411-team022-LogHorizon.git
   cd su24-cs411-team022-LogHorizon
   cd gameRec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `gameRec` folder:
   ```bash
   COHERE_API_KEY=your_api_key_here
   ```
   
   Or set it directly (Windows PowerShell):
   ```powershell
   $env:COHERE_API_KEY="your_api_key_here"
   ```

4. **Generate AI embeddings** (first time only)
   ```bash
   node generate-embeddings-mock.js
   ```
   
   This creates `game-embeddings.json` with vector embeddings for all games.

5. **Start the server**
   ```bash
   node server-mock.js
   ```

6. **Open in browser**
   ```
   http://localhost:3000/login
   ```


---

## Usage

### 1. **Login/Signup**
- Navigate to `http://localhost:3000/login`
- Use test credentials or create a new account

### 2. **Browse Games**
- After login, you'll see the games page
- View all available games with details

### 3. **AI-Powered Search** 🤖
- Use the purple search box at the top
- Enter natural language queries:
  - *"I want a relaxing farming simulation game"*
  - *"Looking for a competitive multiplayer shooter"*
  - *"Open world RPG with exploration and crafting"*
- AI returns top 5 matching games with similarity scores

### 4. **Leave Reviews** ⭐
- Click "⭐ Review" on any game
- Select rating (1-5 stars)
- Add optional comment
- Click "My Reviews" (top right) to see your history

### 5. **Manage Games**
- **Add:** Fill in game details → Auto-generates AI embeddings
- **Edit:** Modify game info → Updates embeddings
- **Delete:** Remove games from database

---

## 🔧 Configuration

### Running with Database (MySQL)
1. Set up MySQL database
2. Update database credentials in `app.js`
3. Run: `node generate-embeddings.js`
4. Start: `node server.js`

### Running in Mock Mode (Current)
- Uses JSON files instead of database
- No MySQL required
- Perfect for testing and development
- Data persists in:
  - `users.json` - User accounts
  - `reviews.json` - Game reviews
  - `mock-data.js` - Game catalog
  - `game-embeddings.json` - AI vectors

---

## 🌐 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /signup` - Signup page
- `POST /signup` - Create account
- `GET /logout` - End session

### Games
- `GET /dashboard/:userId/games` - Games page
- `GET /api/game` - Get all games
- `POST /api/game` - Add new game (with AI embeddings)
- `PUT /api/games/:gameId` - Update game
- `DELETE /api/games/:gameId` - Delete game

### AI Search
- `POST /api/recommend` - Semantic search with natural language
  ```json
  {
    "query": "cozy farming game with multiplayer"
  }
  ```
- `GET /api/embeddings/status` - Check embeddings availability

### Reviews
- `GET /api/reviews/user/:userId` - Get user's reviews
- `POST /api/reviews` - Create review
  ```json
  {
    "gameId": 1,
    "rating": 5,
    "comment": "Amazing game!"
  }
  ```
- `DELETE /api/reviews/:reviewId` - Delete review

---

## 💡 How AI Search Works

1. **Pre-computation Phase:**
   - Each game description is embedded using Cohere's `embed-english-v3.0`
   - Vectors (1024 dimensions) are stored in `game-embeddings.json`
   - This happens once when you run `generate-embeddings-mock.js`

2. **Search Phase:**
   - User enters a natural language query
   - Query is embedded into a vector
   - Cosine similarity computed against all game vectors
   - Top 5 matches returned with similarity scores

3. **Why it's better:**
   - **Semantic understanding** - "cozy farming" matches "relaxing agriculture sim"
   - **Context-aware** - Understands phrases, not just keywords
   - **Ranked results** - Shows best matches first with confidence scores

---

## 🎨 Features Showcase

### AI Recommendations
```
Query: "I want a cozy farming sim with multiplayer"
Results:
1. Stardew Valley - 92% Match ⭐⭐⭐⭐⭐
2. Farming Simulator - 87% Match ⭐⭐⭐⭐
3. Harvest Moon - 84% Match ⭐⭐⭐⭐
```

### Review System
- Real-time review submission
- Star ratings with visual feedback
- Comment support
- Review history modal
- One review per game per user

### User Experience
- Clean, modern Bootstrap 5 UI
- Responsive design
- Real-time feedback with alerts
- Smooth animations
- Loading states

---

## 🧪 Testing

### Test Cohere Integration
```bash
node test-cohere-integration.js
```

### Test Mock Integration
```bash
node test-mock-integration.js
```

---

## 📝 Recent Updates

### Latest (v2.1) - January 2025
- ✅ Fixed review system - reviews now save and display correctly
- ✅ Added session-based authentication (more secure)
- ✅ Cleaned up project structure (removed ~100MB of old files)
- ✅ Added comprehensive .gitignore
- ✅ Improved error handling and user feedback
- ✅ Enhanced UI with better modals and animations
- ✅ Added review history viewing and deletion

### v2.0 - Cohere Integration
- ✅ Integrated Cohere Embed API for semantic search
- ✅ Natural language game queries
- ✅ Vector similarity matching
- ✅ Real-time AI recommendations

---

## 🔗 Links

- **GitHub Repository:** https://github.com/MrFattoush/su24-cs411-team022-LogHorizon
- **Cohere Integration Branch:** https://github.com/MrFattoush/su24-cs411-team022-LogHorizon/tree/cohere-integration
- **Original Project:** https://github.com/cs411-alawini/su24-cs411-team022-LogHorizon
- **Powered by:** [Cohere AI](https://cohere.com)

---

## 🤝 Contributing

This is a personal fork and learning project. Feel free to:
- Fork the repository
- Submit issues
- Suggest improvements
- Use code for your own projects

---

## 📄 License

This project was created as part of CS 411 (Database Systems) coursework.

---

## 👨‍💻 Author

**Mohammad Fattoush (MrFattoush)**
- GitHub: [@MrFattoush](https://github.com/MrFattoush)
- Email: fattash76@gmail.com

---

## 🙏 Acknowledgments

- Original CS411 Team LogHorizon
- Professor and TAs at University of Illinois
- Cohere AI for their excellent embedding API
- Bootstrap team for the UI framework

---

**Built with ❤️ using Node.js, Express, and Cohere AI**
