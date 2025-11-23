import {
  methodInfo,
  type InterfaceName,
  type MethodName,
  type MethodParamsMap,
} from './generated.js';

const BASE_URL = 'https://api.steampowered.com';

export type SteamClient = {
  [K in InterfaceName]: {
    [M in MethodName<K>]: (
      params: M extends keyof MethodParamsMap ? MethodParamsMap[M] : never,
    ) => Promise<any>;
  };
};

export function createSteamClient(apiKey: string): SteamClient {
  return new Proxy({} as SteamClient, {
    get(_target, interfaceName: string) {
      if (!(interfaceName in methodInfo)) {
        return undefined;
      }

      return new Proxy(
        {},
        {
          get(_target, methodName: string) {
            const ifaceInfo = methodInfo[interfaceName as InterfaceName];
            // @ts-ignore
            const methodMeta = ifaceInfo[methodName];

            if (!methodMeta) {
              return undefined;
            }

            return async (params: any) => {
              const { name, version, httpMethod } = methodMeta;
              const url = `${BASE_URL}/${interfaceName}/${name}/v${version}/`;

              const allParams = { ...params, key: apiKey };

              let fetchOptions: RequestInit = {
                method: httpMethod,
              };

              let finalUrl = url;

              if (httpMethod === 'GET') {
                const searchParams = new URLSearchParams();
                for (const [key, value] of Object.entries(allParams)) {
                  if (value !== undefined) {
                    searchParams.append(key, String(value));
                  }
                }
                finalUrl = `${url}?${searchParams.toString()}`;
              } else {
                // POST
                const formData = new URLSearchParams();
                for (const [key, value] of Object.entries(allParams)) {
                  if (value !== undefined) {
                    formData.append(key, String(value));
                  }
                }
                fetchOptions.body = formData;
                fetchOptions.headers = {
                  'Content-Type': 'application/x-www-form-urlencoded',
                };
              }

              const response = await fetch(finalUrl, fetchOptions);

              if (!response.ok) {
                throw new Error(`Steam API Error: ${response.status} ${response.statusText}`);
              }

              return response.json();
            };
          },
        },
      );
    },
  });
}
