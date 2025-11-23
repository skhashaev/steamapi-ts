import { createSteamClient } from './index.js';
import 'dotenv/config';

// Create the Steam API client
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error('❌ Error: API_KEY not found in environment variables');
  console.log('Please create a .env file with your Steam API key:');
  console.log('API_KEY=your_steam_api_key_here');
  process.exit(1);
}

console.log('🎮 Steam API Client Test\n');
console.log('Creating Steam API client...');
const steam = createSteamClient(apiKey);
console.log('✅ Client created successfully!\n');

// Test 1: Method without parameters - Get supported API list
console.log('📋 Test 1: Calling GetSupportedAPIList_v1 (no parameters)');
try {
  const apiList = await steam.ISteamWebAPIUtil.GetSupportedAPIList_v1();
  const interfaceCount = apiList?.apilist?.interfaces?.length || 0;
  console.log('✅ Success! Received API list with', interfaceCount, 'interfaces');
  console.log('First interface:', apiList?.apilist?.interfaces?.[0]?.name);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('❌ Error:', errorMessage);
}

console.log('\n---\n');

// Test 2: Method with parameters
console.log('📋 Test 2: Calling GetNewsForApp_v2 (with parameters)');
try {
  const news = await steam.ISteamNews.GetNewsForApp_v2({
    appid: 440, // Team Fortress 2
    count: 3,
    maxlength: 300,
  });
  console.log('✅ Success! Received', news?.appnews?.newsitems?.length || 0, 'news items');
  console.log('Latest news:', news?.appnews?.newsitems?.[0]?.title);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('❌ Error:', errorMessage);
}

console.log('\n---\n');

// Test 3: Another method without parameters
console.log('📋 Test 3: Calling GetServerList_v1 (no parameters)');
try {
  const servers = await steam.ISteamWebAPIUtil.GetServerInfo_v1();
  console.log('✅ Success! Server info:', servers);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('❌ Error:', errorMessage);
}

console.log('\n🎉 All tests completed!');
