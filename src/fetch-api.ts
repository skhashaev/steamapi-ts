import { writeFile } from 'node:fs/promises';

const apiToken = process.env.API_TOKEN;

export async function fetchApi() {
  const response = await fetch(
    `https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/?key=${apiToken}`,
  );

  const data = await response.json();

  await writeFile(
    new URL('./api-definition.json', import.meta.url),
    JSON.stringify(data, null, 2),
    { encoding: 'utf-8' },
  );
}
