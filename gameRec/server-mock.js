const app = require('./app-mock');

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('Mock Game Recommendation Server running on port ' + PORT);
    console.log('Visit: http://localhost:' + PORT + '/dashboard/1/games');
    console.log('AI recommendations require:');
    console.log('   1. COHERE_API_KEY environment variable');
    console.log('   2. Run: node generate-embeddings-mock.js');
});
