#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎮 Cohere Game Recommendation Demo Setup\n');

console.log('📋 Here\'s how to test your Cohere integration:\n');

console.log('1️⃣  Get your Cohere API key:');
console.log('   • Visit: https://cohere.ai/');
console.log('   • Sign up for free account');
console.log('   • Get your API key from dashboard\n');

console.log('2️⃣  Set your API key:');
console.log('   Windows: set COHERE_API_KEY=your_key_here');
console.log('   Mac/Linux: export COHERE_API_KEY=your_key_here\n');

console.log('3️⃣  Generate embeddings:');
console.log('   node generate-embeddings-mock.js\n');

console.log('4️⃣  Start the server:');
console.log('   node server-mock.js\n');

console.log('5️⃣  Test the AI recommendations:');
console.log('   Visit: http://localhost:3000/dashboard/1/games\n');

console.log('🧪 Test queries to try:');
console.log('   • "I want a relaxing farming simulation game"');
console.log('   • "Looking for an action-packed shooter with multiplayer"');
console.log('   • "I enjoy puzzle games that challenge my mind"');
console.log('   • "Show me open-world adventure games"');
console.log('   • "I want something with great graphics and story"\n');

console.log('📊 What this demonstrates to Cohere:');
console.log('   ✅ Direct API integration with Cohere');
console.log('   ✅ Production-ready error handling');
console.log('   ✅ Natural language user interface');
console.log('   ✅ Vector similarity calculations');
console.log('   ✅ Full-stack development skills');
console.log('   ✅ Real-world problem solving\n');

console.log('🎯 This is perfect for your Cohere application!');
console.log('   No external database required');
console.log('   Fast setup and testing');
console.log('   Clear demonstration of AI capabilities');
console.log('   Easy to deploy and share\n');

if (process.env.COHERE_API_KEY && process.env.COHERE_API_KEY !== 'YOUR_COHERE_API_KEY_HERE') {
    console.log('✅ COHERE_API_KEY is set!');
    console.log('🚀 Ready to generate embeddings and start testing!');
} else {
    console.log('⚠️  COHERE_API_KEY not set yet');
    console.log('   Please set your API key first');
}

console.log('\n' + '='.repeat(60));
console.log('🎉 Ready to showcase your Cohere skills!');
