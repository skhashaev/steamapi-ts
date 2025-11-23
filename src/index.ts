import axios from 'axios';

import type { InterfaceName, MethodName, MethodParamsMap } from './generated.js';
import apiDefinitionJson from './api-definition.json' assert { type: 'json' };
import type { ApiDefinition } from './fetch-api.js';

type ClientMethod<I extends InterfaceName, M extends MethodName<I>> = (
  params: MethodParamsMap[M],
) => Promise<any>;

export type MyClientType = {
  [I in InterfaceName]: {
    [M in MethodName<I>]: ClientMethod<I, M>;
  };
};

const STEAM_API_BASE_URL = 'https://api.steampowered.com/';

type ApiMethod = ApiDefinition['apilist']['interfaces'][number]['methods'][number];

function getMethodIdentifier(method: ApiMethod): MethodName<InterfaceName> {
  const version = Number(method.version ?? 1);
  return `${method.name}_v${version}` as MethodName<InterfaceName>;
}

function createMethodInvoker(
  axiosInstance: ReturnType<typeof axios.create>,
  interfaceName: InterfaceName,
  method: ApiMethod,
  apiToken: string,
): ClientMethod<any, any> {
  const { name, version, httpmethod } = method;
  const resolvedHttpMethod = (httpmethod ?? 'GET').toUpperCase();
  const endpointPath = `${interfaceName}/${name}/v${version}/`;

  return async function invoke(params: any) {
    const requestParams = params ?? {};
    const query = { key: apiToken, ...requestParams };

    if (resolvedHttpMethod === 'POST') {
      const response = await axiosInstance.post(endpointPath, requestParams, {
        params: query,
      });
      return response.data;
    }

    if (resolvedHttpMethod === 'GET') {
      const response = await axiosInstance.get(endpointPath, { params: query });
      return response.data;
    }

    throw new Error(`Unsupported HTTP method "${resolvedHttpMethod}" for ${interfaceName}.${name}`);
  };
}

const apiDefinition = apiDefinitionJson as ApiDefinition;

export function createClient(apiToken: string): MyClientType {
  if (!apiToken) {
    throw new Error('apiToken is required when creating a Steam API client.');
  }

  const interfaces = apiDefinition.apilist.interfaces ?? [];

  const axiosInstance = axios.create({
    baseURL: STEAM_API_BASE_URL,
  });

  const client: Record<string, Record<string, ClientMethod<any, any>>> = {};

  for (const apiInterface of interfaces) {
    const interfaceName = apiInterface.name as InterfaceName;
    const methods = apiInterface.methods ?? [];
    const interfaceMethods: Record<string, ClientMethod<any, any>> = {};

    for (const method of methods) {
      const methodIdentifier = getMethodIdentifier(method);
      interfaceMethods[methodIdentifier] = createMethodInvoker(
        axiosInstance,
        interfaceName,
        method,
        apiToken,
      );
    }

    client[interfaceName] = interfaceMethods;
  }

  return client as MyClientType;
}

const s = createClient(process.env.API_TOKEN!).ISteamApps.GetAppList_v2({});
