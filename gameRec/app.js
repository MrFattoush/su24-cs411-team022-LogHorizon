var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var fs = require('fs');
var { CohereClient } = require('cohere-ai');
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
        console.log('No embeddings file found. Run generate-embeddings.js first.');
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

var connection = mysql.createConnection({
                host: '34.27.8.241', //34.27.8.241
                user: 'root',
                password: 'abc123',
                database: 'GameRecommender'
});

connection.connect;

var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



/* GET home page, respond by rendering index.ejs */
app.get('/', async function(req, res) {

  var developers;
  var top_games;
  // find developers that make above average games
  const sql_one = `SELECT d.Name, AVG(r.Rating) as AvgRating, COUNT(g.GameID) as GameCount
    FROM Developer d
    JOIN Game g ON d.DeveloperID = g.DeveloperID
    JOIN Recommendation r ON g.GameID = r.GameID
    GROUP BY d.DeveloperID
    HAVING AVG(r.Rating) > (
        SELECT AVG(r2.Rating)
        FROM Recommendation r2
    )
    ORDER BY AvgRating DESC, GameCount DESC
    LIMIT 15;
    `;
  // top rated games
  const sql_two = `SELECT g.GameID, g.Title, d.Name AS Developer, AVG(r.Rating) AS AvgRating
    FROM Game g
    JOIN Recommendation r ON g.GameID = r.GameID
    JOIN Developer d ON g.DeveloperID = d.DeveloperID
    GROUP BY g.GameID, g.Title, d.Name
    ORDER BY AvgRating DESC
    LIMIT 15;
    `;
  // recommendations based on games played
  /*
  let UserId = 'merp'
  const sql_three = `SELECT g.Title, g.Price, COUNT(p2.GameID) as PlayCount
    FROM Game g
    JOIN Plays p2 ON g.GameID = p2.GameID
    JOIN GameTags gt ON g.GameID = gt.GameID
    JOIN Tag t ON gt.TagID = t.TagID
    WHERE t.TagName IN (
        SELECT DISTINCT t2.TagName
        FROM GameTags gt2
        JOIN Tag t2 ON gt2.TagID = t2.TagID
        JOIN Plays p ON gt2.GameID = p.GameID
    )
    AND g.GameID NOT IN (
        SELECT GameID
        FROM Plays
        WHERE UserID = @${UserId}
    )
    GROUP BY g.GameID
    ORDER BY PlayCount DESC, g.Price ASC
    LIMIT 15;
    `;
    */
  
    // query one
    connection.query(sql_one, function(err, results) {
      if (err) {
        console.error('Error fetching developer data:', err);
        res.status(500).send({ message: 'Error fetching user data', error: err });
        return;
      }
      if (results.length === 0) {
        res.status(401).send({ message: 'No above-average developers found' });
        return;
      }
      developers = results;
      // res.render('index', { title: 'Developer List', developers: developers });
    });

    // query two
    connection.query(sql_two, function(err, results) {
      if (err) {
        console.error('Error fetching top rated games data:', err);
        res.status(500).send({ message: 'Error fetching games data', error: err });
        return;
      }
      if (results.length === 0) {
        res.status(401).send({ message: 'No top rated games found' });
        return;
      }

      top_games = results;
      // res.render('index', { title: 'Top Rated Games', top_games: top_games});
    });


    res.render('index', { 
        title: 'Index', 
        developers: developers,
        top_games: top_games
        // recommended_games: recommended_games  // Include the third query result
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
  let userId = req.params.userId;
  const sql = `
        SELECT g.GameID, g.Title
        FROM Game g
        JOIN Plays p ON g.GameID = p.GameID
        JOIN Developer d ON g.DeveloperID = d.DeveloperID
        WHERE p.UserID = ?
    `;
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send({ message: 'Error fetching user data', error: err });
      return;
    }
    if (results.length === 0) {
      res.status(401).send({ message: 'No games found' });
      return;
    }
    console.log('Login successful:', results);
    res.json({ games: results });
  });
});



app.post('/api/login', function(req, res) {
  const umail = req.body.umail;
  const password = req.body.password;
  const sql = `SELECT * FROM User WHERE Email='${umail}' OR Username='${umail}'`;

  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send({ message: 'Error fetching user data', error: err });
      return;
    }
    if (results.length === 0) {
      res.status(401).send({ message: 'Invalid email or password asdf' });
      return;
    }

    const user = results[0];
    if (user.Password !== password) {
      res.status(401).send({ message: 'Incorrect email or password' });
      return;
    }
    else {
      // req.session.userId = user.UserId;
      res.json({ userId: user.UserId });
    }
  });
});

app.get('/api/user/:id', (req, res, next) => {
  const userId = req.params.id;

  // SQL to fetch user information
  const userSql = 'SELECT * FROM User WHERE UserId = ?';

  // SQL to fetch games played by the user
  const gamesSql = `
    SELECT g.Title, g.ReleaseDate, g.Price
    FROM Game g
    JOIN Plays p ON g.GameID = p.GameID
    WHERE p.UserID = ?
  `;

  // SQL to fetch recommendations made by the user
  const recommendationsSql = `
    SELECT r.Rating, r.RecommendDate, g.Title AS GameTitle
    FROM Recommendation r
    JOIN Game g ON r.GameID = g.GameID
    WHERE r.UserID = ?
  `;

  connection.query(userSql, [userId], (err, userResults) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return next(err);
    }
    if (userResults.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const user = userResults[0];

    connection.query(gamesSql, [userId], (err, gamesResults) => {
      if (err) {
        console.error('Error fetching games data:', err);
        return next(err);
      }

      connection.query(recommendationsSql, [userId], (err, recommendationsResults) => {
        if (err) {
          console.error('Error fetching recommendations data:', err);
          return next(err);
        }

        // Combine all the results into one response object
        const userProfile = {
          user,
          gamesPlayed: gamesResults,
          recommendations: recommendationsResults
        };
        console.log('Login successful:', userProfile);
        res.json(userProfile);
      });
    });
  });
});

app.get('/api/dashboard/:id', (req, res, next) => {
  const userId = req.params.id;
  console.log('Fetching dashboard data for user ID:', userId);

  // Query to get top developers based on average rating of their games
  const topDevelopersSql = `
      SELECT d.DeveloperID, d.Name, AVG(r.Rating) as AvgRating, COUNT(g.GameID) as GameCount
      FROM Developer d
      JOIN Game g ON d.DeveloperID = g.DeveloperID
      JOIN Recommendation r ON g.GameID = r.GameID
      GROUP BY d.DeveloperID
      HAVING AVG(r.Rating) > (
          SELECT AVG(r2.Rating)
          FROM Recommendation r2
      )
      ORDER BY AvgRating DESC, GameCount DESC
      LIMIT 15;
  `;

  // Query to get top-rated games
  const topRatedGamesSql = `
      SELECT g.GameID, g.Title, d.Name AS Developer, AVG(r.Rating) AS AvgRating
      FROM Game g
      JOIN Recommendation r ON g.GameID = r.GameID
      JOIN Developer d ON g.DeveloperID = d.DeveloperID
      GROUP BY g.GameID, g.Title, d.Name
      ORDER BY AvgRating DESC
      LIMIT 15;
  `;

  connection.query(topDevelopersSql, (err, topDevelopersResults) => {
      if (err) {
          console.error('Error fetching top developers:', err);
          return next(err);
      }
      // console.log('Top developers data:', topDevelopersResults);

      connection.query(topRatedGamesSql, (err, topRatedGamesResults) => {
          if (err) {
              console.error('Error fetching top rated games:', err);
              return next(err);
          }
          // console.log('Top rated games data:', topRatedGamesResults);

          const dashboardData = {
              topDevelopers: topDevelopersResults,
              topRatedGames: topRatedGamesResults
          };
          console.log('dashboard successful:', dashboardData);

          res.json(dashboardData);
      });
  });
});


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const checkUserSql = 'SELECT * FROM User WHERE Email = ?';
  connection.query(checkUserSql, [email], async (err, results) => {
      if (err) {
          console.error('Error checking user existence:', err);
          res.status(500).send({ message: 'Error checking user existence', error: err });
          return;
      }
      if (results.length > 0) {
          res.status(409).send({ message: 'Email already used' });
          return;
      }

      // Hash the password

      // Insert the new user into the database
      const insertUserSql = 'INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)';
      connection.query(insertUserSql, [username, email, password], (err, result) => {
          if (err) {
              console.error('Error registering user:', err);
              res.status(500).send({ message: 'Error registering user', error: err });
              return;
          }
          res.send({ message: 'Registration successful!' });
      });
  });
});

app.get('/api/recommendation/:userId', (req, res, next) => {
  const userId = req.params.userId;

  const sql = `
      SELECT r.Rating, r.RecommendDate, g.Title AS GameTitle
      FROM Recommendation r
      JOIN Game g ON r.GameID = g.GameID
      WHERE r.UserID = ?
  `;

  connection.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching recommendations:', err);
          return next(err);
      }

      res.json(results);
  });
});


app.post('/api/recommendation', async (req, res) => {
  const { userId, gameId, rating, recommendDate } = req.body;

  const checkRecommendationSql = 'SELECT * FROM Recommendation WHERE UserID = ? AND GameID = ?';
  connection.query(checkRecommendationSql, [userId, gameId], (err, results) => {
    if (err) {
      console.error('Error checking recommendation existence:', err);
      res.status(500).send({ message: 'Error checking recommendation existence', error: err });
      return;
    }

    if (results.length > 0) {
      // Recommendation exists, update it
      const updateRecommendationSql = 'UPDATE Recommendation SET Rating = ?, RecommendDate = ? WHERE UserID = ? AND GameID = ?';
      connection.query(updateRecommendationSql, [rating, recommendDate, userId, gameId], (err, result) => {
        if (err) {
          console.error('Error updating recommendation:', err);
          res.status(500).send({ message: 'Error updating recommendation', error: err });
          return;
        }
        res.send({ message: 'Recommendation updated successfully!' });
      });
    } else {
      // Recommendation does not exist, insert a new one
      const insertRecommendationSql = 'INSERT INTO Recommendation (UserID, GameID, Rating, RecommendDate) VALUES (?, ?, ?, ?)';
      connection.query(insertRecommendationSql, [userId, gameId, rating, recommendDate], (err, result) => {
        if (err) {
          console.error('Error adding recommendation:', err);
          res.status(500).send({ message: 'Error adding recommendation', error: err });
          return;
        }
        res.send({ message: 'Recommendation added successfully!', recommendationId: result.insertId });
      });
    }
  });
});

app.delete('/api/recommendations/:recommendationId', (req, res, next) => {
  const recommendationId = req.params.recommendationId;

  const sql = 'DELETE FROM Recommendation WHERE RecommendationID = ?';
  connection.query(sql, [recommendationId], (err, result) => {
    if (err) {
      console.error('Error deleting recommendation:', err);
      res.status(500).send({ message: 'Error deleting recommendation', error: err });
      return;
    }
    res.send({ message: 'Recommendation deleted successfully!' });
  });
});

app.post('/api/game', async (req, res) => {
  const { title,releaseDate, price, developerId} = req.body;
  const sql = 'INSERT INTO Game (Title, ReleaseDate, Price, DeveloperID) VALUES (?, ?, ?, ?)';
  
  connection.query(sql, [title, releaseDate, price, developerId], (err, result) => {
    if (err) {
      console.error('Error adding game:', err);
      res.status(500).send({ message: 'Error adding game', error: err });
      return;
    }
    res.send({ message: 'Game added successfully!', gameId: result.insertId });
  });
});

app.get('/api/game', (req, res, next) => {
  const sql = `
      SELECT g.GameID, g.Title, g.AvgRating, d.Name AS Developer, g.Price
      FROM Game g
      JOIN Developer d ON g.DeveloperID = d.DeveloperID
      LIMIT 100
  `;

  connection.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching games:', err);
          return next(err);
      }

      res.json(results);
  });
});

app.delete('/api/games/:gameId', (req, res, next) => {
  const gameId = req.params.gameId;

  const deleteRecommendationsSql = 'DELETE FROM Recommendation WHERE GameID = ?';
  const deletePlaysSql = 'DELETE FROM Plays WHERE GameID = ?';
  const deleteGameTagsSql = 'DELETE FROM GameTags WHERE GameID = ?';
  const deleteGameSql = 'DELETE FROM Game WHERE GameID = ?';

  connection.query(deleteRecommendationsSql, [gameId], (err, results) => {
    if (err) {
      console.error('Error deleting recommendations:', err);
      return next(err);
    }

    connection.query(deletePlaysSql, [gameId], (err, results) => {
      if (err) {
        console.error('Error deleting plays:', err);
        return next(err);
      }

      connection.query(deleteGameTagsSql, [gameId], (err, results) => {
        if (err) {
          console.error('Error deleting game tags:', err);
          return next(err);
        }

        connection.query(deleteGameSql, [gameId], (err, results) => {
          if (err) {
            console.error('Error deleting game:', err);
            return next(err);
          }
          res.send({ message: 'Game deleted successfully!' });
        });
      });
    });
  });
});

app.post('/api/user/:userId/games', (req, res, next) => {
  const userId = req.params.userId;
  const { gameId } = req.body;

  const sql = 'INSERT INTO Plays (UserID, GameID) VALUES (?, ?)';
  connection.query(sql, [userId, gameId], (err, result) => {
    if (err) {
      console.error('Error adding game to user profile:', err);
      res.status(500).send({ message: 'Error adding game to user profile', error: err });
      return;
    }
    res.send({ message: 'Game added to user profile successfully!' });
  });
});

app.get('/api/search', (req, res, next) => {
  const keyword = req.query.keyword;

  const sql = `
      SELECT g.GameID, g.Title, g.ReleaseDate, g.Price, d.Name AS Developer
      FROM Game g
      JOIN Developer d ON g.DeveloperID = d.DeveloperID
      WHERE g.Title LIKE ? OR d.Name LIKE ?
  `;

  connection.query(sql, [`%${keyword}%`, `%${keyword}%`], (err, results) => {
      if (err) {
          console.error('Error searching for games:', err);
          return next(err);
      }

      console.log('Query results:', results);
      res.json(results);
  });
});
app.post('/api/recommend', async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    if (gameEmbeddings.length === 0) {
      return res.status(500).json({ 
        error: 'No game embeddings available. Please run generate-embeddings.js first.' 
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