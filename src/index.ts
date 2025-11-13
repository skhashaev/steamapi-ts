import 'dotenv/config';
import axios from 'axios';
import { writeFile } from 'fs/promises';
// import api from './api.json' assert { type: 'json' };
const api = await import('./api-definition.json', { assert: { type: 'json' } });
import type { InterfaceName, MethodName } from './generated.js';

export type API = typeof api;
// export type Parameters = API['default']['apilist']['interfaces'][number]['methods'][number]{'pa'}
type ClientMethod<I extends InterfaceName, M extends MethodName<I>> = 
  (params: any ) => Promise<any>; 
  // You would replace 'any' with the specific parameter type logic if you generate it.

// 3. Define the full MyClientType using Mapped Types over the generated union types
export type MyClientType = {
  // Map over the literal interface names (e.g., 'Games', 'Users')
  [I in InterfaceName]: {
    // Map over the literal method names associated with that interface
    [M in MethodName<I>]: ClientMethod<I, M>;
  };
};

function createClient(): MyClientType {
  const defaultApi = api.default.apilist.interfaces

  const resultApi = defaultApi.reduce((acc: any, curr: any) => {
    acc[curr.name] = curr.methods

    return acc
  }, {} )



  return resultApi 
}

const steam = createClient();

console.log('---', steam.ISteamApps.GetAppList({}))

// init
const accessToken = process.env.ACCESS_TOKEN;

const steamApi = axios.create({
  baseURL: 'https://api.steampowered.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
});

const getSupporteApiList = "/ISteamApps/GetAppList/v1/";

const getSupportedApiList = "/ISteamWebAPIUtil/GetSupportedAPIList/v1"

// const response = await steamApi.get(getSupporteApiList);
// const response = await steamApi.get(getSupportedApiList);

// console.log(response.data.applist.apps.app.find((app: any) => app.appid === 570));
// console.log(response.data.apilist.interfaces.find((int: any) => int.name === 'ISteamApps'));

// await writeFile(
//   new URL('./api.json', import.meta.url),
//   JSON.stringify(response.data, null, 2),
//   { encoding: 'utf-8' },
// );

export {};



/*

1. Use /ISteamApps/GetAppList/v1/ to get supported api list
2. The result is object with apilist property, which has interfaces array
3. Each interface in interfaces array has 

*/