import { createSteamClient } from './client.js';
import 'dotenv/config';

async function main() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API_KEY is not defined in .env');
    process.exit(1);
  }

  const steam = createSteamClient(apiKey);

  try {
    console.log('Fetching supported API list...');
    const apiList = await steam.ISteamWebAPIUtil.GetSupportedAPIList_v1({});
    console.log('Success! Found', apiList.apilist.interfaces.length, 'interfaces.');

    // console.log('Fetching app list (v1)...');
    // const appList = await steam.ISteamApps.GetAppList_v1({});
    // console.log('Success! Found', appList.applist.apps.app.length, 'apps.');

    // console.log('Fetching app list (v2)...');
    // const appListV2 = await steam.ISteamApps.GetAppList_v2({});
    // console.log('Success! Found', appListV2.applist.apps.length, 'apps.');

    console.log('Fetching with params...');
    const news = await steam.ISteamNews.GetNewsForApp_v2({ appid: 440, count: 5 });
    console.log('Success! Got news items:', news.appnews.newsitems.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
