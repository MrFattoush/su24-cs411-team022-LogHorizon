const { CohereClient } = require('cohere-ai');
const fs = require('fs');
const path = require('path');
const mockGames = require('./mock-data');

async function testMockCohereIntegration() {
    console.log('Testing Cohere Integration with Mock Data...\n');
    
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_COHERE_API_KEY_HERE') {
        console.log('❌ COHERE_API_KEY not set!');
        console.log('   Please set your API key: export COHERE_API_KEY=your_key_here');
        console.log('   Get a free key at: https://cohere.ai/');
        return false;
    }
    
    try {
        const cohere = new CohereClient({ token: apiKey });
        console.log('✅ Cohere client initialized');
        
        console.log('Testing embedding generation with mock games...');
        const response = await cohere.embed({
            texts: ['I want a relaxing farming simulation game'],
            model: 'embed-english-v3.0',
            inputType: 'search_query'
        });
        
        console.log(`✅ Generated embedding with ${response.embeddings[0].length} dimensions`);
        
        const embeddingsPath = path.join(__dirname, 'game-embeddings.json');
        if (fs.existsSync(embeddingsPath)) {
            const embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
            console.log(`✅ Found ${embeddings.length} game embeddings`);
        } else {
            console.log('⚠️  No embeddings file found. Run generate-embeddings-mock.js first.');
        }
        
        console.log('\nMock Cohere integration test passed!');
        console.log('\nNext steps:');
        console.log('1. Run: node generate-embeddings-mock.js');
        console.log('2. Start mock server: node server-mock.js');
        console.log('3. Visit: http://localhost:3000/dashboard/1/games');
        console.log('4. Try the AI recommendations!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Mock Cohere integration test failed:', error.message);
        return false;
    }
}

async function testMockAPIEndpoints() {
    console.log('\n Testing mock API endpoints...');
    
    try {
        // Test embeddings status endpoint
        const response = await fetch('http://localhost:3000/api/embeddings/status');
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Embeddings status: ${data.totalEmbeddings} embeddings loaded`);
        } else {
            console.log('⚠️  Mock server not running or embeddings not loaded');
        }
        
        // Test recommendation endpoint
        const recommendResponse = await fetch('http://localhost:3000/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'I want a puzzle game' })
        });
        
        if (recommendResponse.ok) {
            const data = await recommendResponse.json();
            console.log(`✅ Recommendation API working: ${data.recommendations.length} results`);
        } else {
            const error = await recommendResponse.json();
            console.log(`⚠️  Recommendation API error: ${error.error}`);
        }
        
    } catch (error) {
        console.log('⚠️  Mock API test failed (server may not be running):', error.message);
    }
}

// Main test function
async function main() {
    console.log(' Mock Cohere Integration Test Suite\n');
    console.log('=' .repeat(50));
    
    const cohereTest = await testMockCohereIntegration();
    
    if (cohereTest) {
        await testMockAPIEndpoints();
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log(' Mock test complete!');
}

// Run tests
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testMockCohereIntegration, testMockAPIEndpoints };
