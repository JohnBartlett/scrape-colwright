import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🌐 Hotel Network Remote Access Setup\n');

console.log('📋 Step-by-Step Instructions:\n');

console.log('1. ✅ Your server is already running on port 3000');
console.log('2. 🔧 Now we need to create a public tunnel\n');

console.log('🚀 Starting ngrok tunnel...\n');

// Start ngrok using the local package
const ngrokProcess = spawn('node', [join(__dirname, 'node_modules', 'ngrok', 'bin', 'ngrok'), 'http', '3000'], {
  stdio: 'pipe',
  shell: true
});

let output = '';

ngrokProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(text);
  
  // Look for the ngrok URL in the output
  const urlMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/);
  if (urlMatch) {
    console.log('\n🎉 SUCCESS! Your public URL is: ' + urlMatch[0]);
    console.log('📋 Copy this URL and share it with anyone who needs access.');
    console.log('⚠️  This URL will change if you restart ngrok.');
  }
});

ngrokProcess.stderr.on('data', (data) => {
  console.log('ngrok stderr:', data.toString());
});

ngrokProcess.on('close', (code) => {
  console.log(`\nngrok process exited with code ${code}`);
});

console.log('💡 If you see any errors above, try these alternatives:\n');
console.log('Alternative 1: Manual ngrok');
console.log('   - Open a new PowerShell window');
console.log('   - Run: npx ngrok http 3000');
console.log('   - Copy the https://xxxx.ngrok.io URL\n');

console.log('Alternative 2: Cloudflare Tunnel');
console.log('   - Install: npm install -g cloudflared');
console.log('   - Run: cloudflared tunnel --url http://localhost:3000\n');

console.log('Alternative 3: LocalTunnel');
console.log('   - Install: npm install -g localtunnel');
console.log('   - Run: lt --port 3000\n');

console.log('\n🔄 To stop the tunnel, press Ctrl+C in the ngrok window'); 