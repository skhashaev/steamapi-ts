import 'dotenv/config';
import axios from 'axios';

const api = await import('./api-definition.json', { assert: { type: 'json' } });
import type { InterfaceName, MethodName, MethodParamsMap } from './generated.js';
import { fetchApi } from './fetch-api.js';

type ClientMethod<I extends InterfaceName, M extends MethodName<I>> = (
  params: MethodParamsMap[M],
) => Promise<any>;

export type MyClientType = {
  [I in InterfaceName]: {
    [M in MethodName<I>]: ClientMethod<I, M>;
  };
};

fetchApi();

export function createClient(apiToken: string): MyClientType {
  const defaultApi = api.default.apilist.interfaces;

  const resultApi = defaultApi.reduce((acc: any, curr: any) => {
    acc[curr.name] = curr.methods;

    return acc;
  }, {});

  return resultApi;
}

export {};
