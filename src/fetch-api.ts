import { writeFile } from 'node:fs/promises';
import 'dotenv/config';

const apiKey = process.env.API_KEY;

async function main() {
  console.log('Fetching Steam API definition...');

  if (!apiKey) {
    throw new Error('API_KEY environment variable is required. Please set it in your .env file.');
  }

  // Using API key to get the full list of interfaces (~55 interfaces)
  const url = `https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/?key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch API definition: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();

  // Verify we got valid data
  if (!data?.apilist?.interfaces || data.apilist.interfaces.length === 0) {
    throw new Error('Received empty API definition. The API may be unavailable.');
  }

  await writeFile(
    new URL('./api-definition.json', import.meta.url),
    JSON.stringify(data, null, 2),
    { encoding: 'utf-8' },
  );

  console.log(`✅ Successfully fetched ${data.apilist.interfaces.length} API interfaces`);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
