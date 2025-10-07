require('dotenv').config();
const mysql = require('mysql2');
const { CohereClient } = require('cohere-ai');
const fs = require('fs');
const path = require('path');

// Initialize Cohere client
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'YOUR_COHERE_API_KEY_HERE'
});

// Database connection
const connection = mysql.createConnection({
    host: '34.27.8.241',
    user: 'root',
    password: 'abc123',
    database: 'GameRecommender'
});

// Function to compute cosine similarity
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

// Function to get game data with descriptions
async function getGameData() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                g.GameID, 
                g.Title, 
                g.ReleaseDate, 
                g.Price,
                d.Name AS Developer,
                GROUP_CONCAT(t.TagName SEPARATOR ', ') AS Tags
            FROM Game g
            JOIN Developer d ON g.DeveloperID = d.DeveloperID
            LEFT JOIN GameTags gt ON g.GameID = gt.GameID
            LEFT JOIN Tag t ON gt.TagID = t.TagID
            GROUP BY g.GameID, g.Title, g.ReleaseDate, g.Price, d.Name
            LIMIT 50
        `;
        
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Function to generate embeddings for games
async function generateGameEmbeddings() {
    try {
        console.log('Fetching game data...');
        const games = await getGameData();
        console.log(`Found ${games.length} games`);
        
        const gameEmbeddings = [];
        
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            
            // Create a rich description for embedding
            const gameDescription = `${game.Title} by ${game.Developer}. ${game.Tags ? `Tags: ${game.Tags}` : ''} Released: ${game.ReleaseDate}. Price: $${game.Price}`;
            
            console.log(`Processing game ${i + 1}/${games.length}: ${game.Title}`);
            
            try {
                // Generate embedding using Cohere
                const response = await cohere.embed({
                    texts: [gameDescription],
                    model: 'embed-english-v3.0',
                    inputType: 'search_document'
                });
                
                gameEmbeddings.push({
                    gameId: game.GameID,
                    title: game.Title,
                    developer: game.Developer,
                    price: game.Price,
                    releaseDate: game.ReleaseDate,
                    tags: game.Tags,
                    description: gameDescription,
                    embedding: response.embeddings[0]
                });
                
                // Small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`Error processing game ${game.Title}:`, error);
                continue;
            }
        }
        
        // Save embeddings to file
        const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
        fs.writeFileSync(embeddingsPath, JSON.stringify(gameEmbeddings, null, 2));
        
        console.log(`\n✅ Generated embeddings for ${gameEmbeddings.length} games`);
        console.log(`📁 Saved to: ${embeddingsPath}`);
        
        return gameEmbeddings;
        
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw error;
    }
}

// Function to test semantic search
async function testSemanticSearch(query, gameEmbeddings) {
    try {
        console.log(`\n🔍 Testing semantic search for: "${query}"`);
        
        // Generate embedding for the query
        const response = await cohere.embed({
            texts: [query],
            model: 'embed-english-v3.0',
            inputType: 'search_query'
        });
        
        const queryEmbedding = response.embeddings[0];
        
        // Calculate similarities
        const similarities = gameEmbeddings.map(game => ({
            ...game,
            similarity: cosineSimilarity(queryEmbedding, game.embedding)
        }));
        
        // Sort by similarity and get top 5
        const topResults = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
        
        console.log('\n🎮 Top 5 recommendations:');
        topResults.forEach((game, index) => {
            console.log(`${index + 1}. ${game.title} (${game.developer}) - Similarity: ${game.similarity.toFixed(4)}`);
            console.log(`   Tags: ${game.tags || 'N/A'}`);
            console.log(`   Price: $${game.price}`);
            console.log('');
        });
        
        return topResults;
        
    } catch (error) {
        console.error('Error in semantic search:', error);
        throw error;
    }
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting Cohere embedding generation...\n');
        
        // Check if API key is set
        if (!process.env.COHERE_API_KEY && process.env.COHERE_API_KEY !== 'YOUR_COHERE_API_KEY_HERE') {
            console.log('⚠️  Please set your COHERE_API_KEY environment variable');
            console.log('   You can get a free API key at: https://cohere.ai/');
            return;
        }
        
        // Generate embeddings
        const gameEmbeddings = await generateGameEmbeddings();
        
        // Test with some example queries
        const testQueries = [
            "I want a relaxing farming simulation game",
            "Looking for an action-packed shooter with multiplayer",
            "I enjoy puzzle games that challenge my mind",
            "Show me open-world adventure games",
            "I want something with great graphics and story"
        ];
        
        console.log('\n🧪 Testing semantic search with sample queries...\n');
        
        for (const query of testQueries) {
            await testSemanticSearch(query, gameEmbeddings);
        }
        
        console.log('\n✅ Embedding generation and testing complete!');
        console.log('\n📋 Next steps:');
        console.log('1. Set up your Cohere API key in environment variables');
        console.log('2. Run: npm install cohere-ai');
        console.log('3. Add the semantic search endpoint to your Express app');
        console.log('4. Update your frontend to use the new recommendation system');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        connection.end();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    generateGameEmbeddings,
    testSemanticSearch,
    cosineSimilarity
};
