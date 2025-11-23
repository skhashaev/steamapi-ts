# Steam API TypeScript Client

A fully typed TypeScript client for the Steam Web API with automatic type generation from the official API definition.

## Features

- 🔒 **Fully Typed** - All API methods and parameters are strongly typed
- 🚀 **Auto-generated Types** - Types are generated directly from Steam's API definition
- 🎯 **Intuitive API** - Clean, promise-based interface with method chaining
- 🔑 **Built-in Authentication** - API key is automatically included in all requests
- 📦 **Zero Dependencies** - Uses native `fetch` API

## Installation

```bash
npm install steamapi-ts
```

## Quick Start

### 1. Set up your API key

Create a `.env` file in the project root:

```env
API_KEY=your_steam_api_key_here
```

Get your Steam API key from: https://steamcommunity.com/dev/apikey

### 2. Use the client

```typescript
import { createSteamClient } from 'steamapi-ts';
import 'dotenv/config';

const steam = createSteamClient(process.env.API_KEY!);

// Call API methods with full type safety
const appList = await steam.IStoreService.GetAppList_v1();
console.log(appList);
```

## Usage Examples

### Methods without parameters

For methods that don't require parameters, you can omit the argument entirely:

```typescript
// Both are valid
const status = await steam.ICSGOServers_730.GetGameServersStatus_v1();
const status = await steam.ICSGOServers_730.GetGameServersStatus_v1({});
```

### Methods with parameters

```typescript
// Parameters are fully typed
const news = await steam.ISteamNews.GetNewsForApp_v2({
  appid: 440,
  count: 5,
  maxlength: 300,
});
```

### Error Handling

```typescript
try {
  const result = await steam.ISomeInterface.SomeMethod_v1({ param: 'value' });
  console.log(result);
} catch (error) {
  console.error('API call failed:', error.message);
}
```

## Type Safety

The client provides full IntelliSense support:

```typescript
const steam = createSteamClient(apiKey);

// TypeScript knows all available interfaces
steam.IStoreService;
//    ^ IntelliSense shows all available interfaces

// TypeScript knows all methods for each interface
steam.IStoreService.GetAppList_v1;
//                  ^ IntelliSense shows all methods with their versions

// TypeScript knows the required parameters
steam.ISteamNews.GetNewsForApp_v2({
  appid: 440, // TypeScript knows this is required and should be a number
  count: 5, // TypeScript knows this is optional
});
```

## Notes

- The `key` parameter is automatically excluded from method signatures since it's provided when creating the client
- Methods are named with their version suffix (e.g., `GetAppList_v1`, `GetAppList_v2`)
- The API definition returned by Steam may vary based on your API key's permissions
- Some Steam API endpoints may return 404 errors depending on the method or your API key's access level

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run `npm run format` to format your code
5. Submit a pull request
