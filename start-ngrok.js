import ngrok from 'ngrok';

console.log('🚀 Starting ngrok tunnel...\n');

async function startNgrok() {
  try {
    const url = await ngrok.connect({
      addr: 3000,
      authtoken: null // Will use free tier
    });
    
    console.log('✅ ngrok tunnel created successfully!');
    console.log(`🌐 Your public URL: ${url}`);
    console.log('\n📋 Copy this URL and share it with anyone who needs access.');
    console.log('⚠️  Note: This URL will change if you restart ngrok.');
    console.log('\n🔄 To stop the tunnel, press Ctrl+C');
    
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping ngrok tunnel...');
      await ngrok.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting ngrok:', error.message);
    console.log('\n💡 Make sure your server is running on port 3000 first.');
    console.log('   Run: node server.js');
  }
}

startNgrok(); 