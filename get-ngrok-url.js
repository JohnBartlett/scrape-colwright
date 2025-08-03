import fetch from 'node-fetch';

console.log('🔍 Getting ngrok URL...\n');

async function getNgrokUrl() {
  try {
    // Try to get the ngrok URL from the local web interface
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();
    
    if (data.tunnels && data.tunnels.length > 0) {
      const httpsTunnel = data.tunnels.find(tunnel => tunnel.proto === 'https');
      if (httpsTunnel) {
        console.log('✅ ngrok is running!');
        console.log(`🌐 Your public URL: ${httpsTunnel.public_url}`);
        console.log('\n📋 Copy this URL and share it with anyone who needs access.');
        console.log('⚠️  Note: This URL will change if you restart ngrok.');
        return;
      }
    }
    
    console.log('❌ No HTTPS tunnel found. Please check if ngrok is running.');
    
  } catch (error) {
    console.log('❌ Could not connect to ngrok web interface.');
    console.log('This usually means ngrok is not running or not ready yet.');
  }
  
  console.log('\n📋 Manual Instructions:');
  console.log('1. Look for the ngrok window that opened');
  console.log('2. Find the line that says "Forwarding https://xxxx.ngrok.io -> http://localhost:3000"');
  console.log('3. Copy the https://xxxx.ngrok.io URL');
  console.log('4. Share that URL with anyone who needs access');
  console.log('\n💡 If you don\'t see the ngrok window, run: ngrok http 3000');
}

getNgrokUrl(); 