const app = require('./app-mock');

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('\n Game Recommendation Server running on port ' + PORT);
    console.log('\n Login: http://localhost:' + PORT + '/login');
    console.log('   Demo: username: demo | password: demo');
    console.log('\n Sign Up: http://localhost:' + PORT + '/signup');
    console.log('   Create your own account!');
    console.log('\nAfter login, you\'ll be taken to: http://localhost:' + PORT + '/dashboard/1/games\n');
    console.log('AI recommendations require:');
    console.log('   1. COHERE_API_KEY environment variable (in .env file)');
    console.log('   2. Run: node generate-embeddings-mock.js\n');
});
