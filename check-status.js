import fetch from 'node-fetch';

console.log('🔍 Checking ngrok status...\n');

async function checkStatus() {
  try {
    // Check if ngrok web interface is available
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();
    
    if (data.tunnels && data.tunnels.length > 0) {
      const httpsTunnel = data.tunnels.find(tunnel => tunnel.proto === 'https');
      if (httpsTunnel) {
        console.log('✅ ngrok is running successfully!');
        console.log(`🌐 Your public URL: ${httpsTunnel.public_url}`);
        console.log('\n📋 Copy this URL and share it with anyone who needs access.');
        console.log('⚠️  Note: This URL will change if you restart ngrok.');
        return;
      }
    }
    
    console.log('❌ No HTTPS tunnel found yet.');
    console.log('   ngrok might still be starting up...');
    
  } catch (error) {
    console.log('❌ ngrok web interface not accessible yet.');
    console.log('   This usually means ngrok is still starting up.');
  }
  
  console.log('\n📋 Manual Check:');
  console.log('1. Look for any ngrok output in your terminal');
  console.log('2. Look for a line like: "Forwarding https://xxxx.ngrok.io -> http://localhost:3000"');
  console.log('3. Copy the https://xxxx.ngrok.io URL');
  console.log('\n💡 If you don\'t see ngrok running, try: npx ngrok http 3000');
}

checkStatus(); 