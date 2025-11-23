# Steam API TypeScript Client

A fully typed TypeScript client for the Steam Web API with automatic type generation from the official API definition.

## Note

This library is very young and not fully tested. By the idea and the implementation, it should work properly, but bear in mind that it may not work as expected right away. If you find any issues, please open an issue on the GitHub repository. If you find any open issues, resolve them :)

The library is a side project from the main one - we were in need some simple **typed** Steam API client, and I personally wanted to be able to call methods easily without copypasting the url string into some utility get() or post() functions. The changes to this library will be happening by the requests of the main project.

## Features

- 🔒 **Fully Typed** - All API methods and parameters are strongly typed
- 🚀 **Auto-generated Types** - Types are generated directly from Steam's API definition
- 🎯 **Intuitive API** - Clean, promise-based interface with method chaining
- 🔑 **Built-in Authentication** - API key is automatically included in all requests
- 📦 **Zero Dependencies** - Uses native `fetch` API

## Installation

```bash
npm install @skhashaev/steamapi-ts
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
import { createSteamClient } from '@skhashaev/steamapi-ts';
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

### Working with BigInt Parameters

Some Steam API parameters use 64-bit integers (like Steam IDs) that exceed JavaScript's safe integer range. For these parameters, you **must** use BigInt literals with the `n` suffix:

```typescript
// ✅ Correct - Using BigInt literal
const friendList = await steam.ISteamUser.GetFriendList_v1({
  steamid: 76561199699144174n, // Note the 'n' suffix
});

// ✅ Also correct - Converting from string
const steamId = BigInt('76561199699144174');
const friendList = await steam.ISteamUser.GetFriendList_v1({
  steamid: steamId,
});

// ❌ Wrong - Number literal loses precision
const friendList = await steam.ISteamUser.GetFriendList_v1({
  steamid: 76561199699144174, // TypeScript error + precision loss!
});
```

> [!IMPORTANT]
> Steam IDs and other 64-bit integers **will lose precision** if you use regular number literals. Always use BigInt (`n` suffix) or convert from strings using `BigInt()`.

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

## Automated API Updates

This package includes an automated workflow that keeps Steam API types up to date:

- **Daily checks** for Steam API changes
- **Automatic PR creation** when updates are detected
- **Type regeneration** and build verification

See [`.github/AUTOMATED_UPDATES.md`](.github/AUTOMATED_UPDATES.md) for details.

## Notes

- The `key` parameter is automatically excluded from method signatures since it's provided when creating the client
- Methods are named with their version suffix (e.g., `GetAppList_v1`, `GetAppList_v2`)
- The API definition returned by Steam may vary based on your API key's permissions
- Some Steam API endpoints may return 404 errors depending on the method or your API key's access level
- **BigInt parameters**: Parameters typed as `bigint` (like Steam IDs) must use BigInt literals (`76561199699144174n`) or be converted from strings (`BigInt('76561199699144174')`) to prevent precision loss

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run `npm run format` to format your code
5. Submit a pull request
