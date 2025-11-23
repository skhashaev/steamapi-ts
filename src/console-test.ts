import { createSteamClient } from './index.js';
import 'dotenv/config';

async function main() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('❌ Error: API_KEY is not defined in .env file');
    process.exit(1);
  }

  console.log('🎮 Initializing Steam Client...');
  const steam = createSteamClient(apiKey);

  try {
    // 1. Get Supported API List
    // console.log('\n📡 Fetching Supported API List...');
    // const apiList = await steam.ISteamWebAPIUtil.GetSupportedAPIList_v1({});
    // console.log(`✅ Success! Found ${apiList.apilist.interfaces.length} interfaces.`);

    // 2. Get News for Team Fortress 2 (AppID: 440)
    // const appId = 440;
    // const count = 3;
    // console.log(`\n📰 Fetching latest ${count} news items for AppID ${appId} (TF2)...`);
    // const news = await steam.ISteamNews.GetNewsForApp_v2({ appid: appId, count: count });

    // console.log(`✅ Success! Retrieved ${news.appnews.newsitems.length} news items:`);
    // news.appnews.newsitems.forEach((item: any, index: number) => {
    //   console.log(
    //     `   ${index + 1}. ${item.title} (${new Date(item.date * 1000).toLocaleDateString()})`,
    //   );
    //   console.log(`      ${item.url}`);
    // });
    const appList = await steam.IStoreService.GetAppList_v1();
    console.log(appList);
  } catch (error: any) {
    console.error('\n❌ API Call Failed:');
    if (error.message) {
      console.error(`   ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

main();
