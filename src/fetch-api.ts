import { writeFile } from 'node:fs/promises';

async function main() {
  console.log('Fetching Steam API definition...');

  // Note: GetSupportedAPIList works WITHOUT an API key and returns a basic list
  // When called WITH an API key, it may return 403 depending on key permissions
  const response = await fetch(
    'https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/',
  );

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
