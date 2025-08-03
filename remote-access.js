import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🌐 Remote Access Options for Your Server\n');

console.log('1. Local Network Access:');
console.log(`   Your server is now accessible at: http://10.2.0.2:3000`);
console.log('   Anyone on your local network can access it using this IP.\n');

console.log('2. Using ngrok (for internet access):');
console.log('   Run this command in a new terminal:');
console.log('   ngrok http 3000\n');

console.log('3. Port Forwarding (for permanent access):');
console.log('   - Configure your router to forward port 3000 to 10.2.0.2');
console.log('   - Use your public IP address (find it at whatismyipaddress.com)\n');

console.log('4. Cloud Deployment:');
console.log('   - Deploy to Vercel, Heroku, or similar platforms\n');

// Test if ngrok is available
try {
  const { stdout } = await execAsync('ngrok version');
  console.log('✅ ngrok is installed and ready to use');
  console.log(`   Version: ${stdout.trim()}`);
} catch (error) {
  console.log('❌ ngrok not found. Install it with: npm install -g ngrok');
}

console.log('\n🔒 Security Note:');
console.log('   - Your server is now accessible from your local network');
console.log('   - Consider adding authentication if needed');
console.log('   - Be aware of your firewall settings'); 