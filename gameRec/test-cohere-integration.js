const { CohereClient } = require('cohere-ai');
const fs = require('fs');
const path = require('path');

async function testCohereIntegration() {
    console.log('🧪 Testing Cohere Integration...\n');
    
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_COHERE_API_KEY_HERE') {
        console.log('❌ COHERE_API_KEY not set!');
        console.log('   Please set your API key: export COHERE_API_KEY=your_key_here');
        return false;
    }
    
    try {
        const cohere = new CohereClient({ token: apiKey });
        console.log('✅ Cohere client initialized');
        
        console.log('🔍 Testing embedding generation...');
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
            console.log('⚠️  No embeddings file found. Run generate-embeddings.js first.');
        }
        
        console.log('\n🎉 Cohere integration test passed!');
        console.log('\n📋 Next steps:');
        console.log('1. Run: node generate-embeddings.js');
        console.log('2. Start your server: npm start');
        console.log('3. Visit: http://localhost:80/dashboard/1/games');
        console.log('4. Try the AI recommendations!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Cohere integration test failed:', error.message);
        return false;
    }
}

// Test API endpoints
async function testAPIEndpoints() {
    console.log('\n🌐 Testing API endpoints...');
    
    try {
        // Test embeddings status endpoint
        const response = await fetch('http://localhost:80/api/embeddings/status');
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Embeddings status: ${data.totalEmbeddings} embeddings loaded`);
        } else {
            console.log('⚠️  Server not running or embeddings not loaded');
        }
        
        // Test recommendation endpoint
        const recommendResponse = await fetch('http://localhost:80/api/recommend', {
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
        console.log('⚠️  API test failed (server may not be running):', error.message);
    }
}

// Main test function
async function main() {
    console.log('🚀 Cohere Integration Test Suite\n');
    console.log('=' .repeat(50));
    
    const cohereTest = await testCohereIntegration();
    
    if (cohereTest) {
        await testAPIEndpoints();
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('🏁 Test complete!');
}

// Run tests
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testCohereIntegration, testAPIEndpoints };
