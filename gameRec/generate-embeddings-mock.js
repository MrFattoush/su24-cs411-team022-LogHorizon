require('dotenv').config();
const { CohereClient } = require('cohere-ai');
const fs = require('fs');
const path = require('path');
const mockGames = require('./mock-data');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || 'YOUR_COHERE_API_KEY_HERE'
});

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

async function generateMockGameEmbeddings() {
    try {
        console.log('Using mock game data for testing...');
        console.log(`Found ${mockGames.length} games`);
        
        const gameEmbeddings = [];
        
        for (let i = 0; i < mockGames.length; i++) {
            const game = mockGames[i];
            
            console.log(`Processing game ${i + 1}/${mockGames.length}: ${game.Title}`);
            
            try {
                const response = await cohere.embed({
                    texts: [game.Description],
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
                    description: game.Description,
                    embedding: response.embeddings[0]
                });
                
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (error) {
                console.error(`Error processing game ${game.Title}:`, error);
                continue;
            }
        }
        
        const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
        fs.writeFileSync(embeddingsPath, JSON.stringify(gameEmbeddings, null, 2));
        
        console.log(`\nGenerated embeddings for ${gameEmbeddings.length} games`);
        console.log(`Saved to: ${embeddingsPath}`);
        
        return gameEmbeddings;
        
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw error;
    }
}

async function testSemanticSearch(query, gameEmbeddings) {
    try {
        console.log(`\nTesting semantic search for: "${query}"`);
        
        const response = await cohere.embed({
            texts: [query],
            model: 'embed-english-v3.0',
            inputType: 'search_query'
        });
        
        const queryEmbedding = response.embeddings[0];
        
        const similarities = gameEmbeddings.map(game => ({
            ...game,
            similarity: cosineSimilarity(queryEmbedding, game.embedding)
        }));
        
        const topResults = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
        
        console.log('\nTop 5 recommendations:');
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

async function main() {
    try {
        console.log('Starting Cohere embedding generation with mock data...\n');
        
        if (!process.env.COHERE_API_KEY || process.env.COHERE_API_KEY === 'YOUR_COHERE_API_KEY_HERE') {
            console.log('⚠️  Please set your COHERE_API_KEY environment variable');
            console.log('   You can get a free API key at: https://cohere.ai/');
            console.log('   Then run: export COHERE_API_KEY=your_key_here');
            return;
        }
        
        const gameEmbeddings = await generateMockGameEmbeddings();
        
        const testQueries = [
            "I want a relaxing farming simulation game",
            "Looking for an action-packed shooter with multiplayer",
            "I enjoy puzzle games that challenge my mind",
            "Show me open-world adventure games",
            "I want something with great graphics and story"
        ];
        
        console.log('\nTesting semantic search with sample queries...\n');
        
        for (const query of testQueries) {
            await testSemanticSearch(query, gameEmbeddings);
        }
        
        console.log('\nEmbedding generation and testing complete!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    generateMockGameEmbeddings,
    testSemanticSearch,
    cosineSimilarity
};
