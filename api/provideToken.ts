import { AuthorizationToken } from '../generated';
import { TokenStorage } from '../utility/clientStorage';

type RequestMethodArgs = {
  requestBody: {
    accessToken: AuthorizationToken;
  };
};

type AsyncFunc = (...args: never) => Promise<unknown>;

type TokenlessMethod<T extends RequestMethodArgs, R> = (
  args: Omit<T, 'requestBody'> & {
    requestBody: Omit<T['requestBody'], 'accessToken'>;
  },
) => R;

type SuccessOnly<T> = T extends AsyncFunc
  ? (
      args: Parameters<T>[0],
    ) => ReturnType<T> extends Promise<infer R> ? Promise<Extract<R, { status: 'success' }>> : never
  : T;

type TokenlessServiceProperty<T, P extends keyof T> = T[P] extends AsyncFunc
  ? Parameters<T[P]>[0] extends RequestMethodArgs
    ? TokenlessMethod<Parameters<T[P]>[0], ReturnType<T[P]>>
    : T[P]
  : T[P];

type TokenlessService<T> = {
  [P in keyof T]: SuccessOnly<TokenlessServiceProperty<T, P>>;
};

export function provideToken<T>(service: T): TokenlessService<T> {
  const keys = Object.getOwnPropertyNames(service) as (keyof T)[];
  return keys.reduce<Partial<TokenlessService<T>>>((previousValue, key) => {
    const property = service[key];
    let newValue = property as TokenlessServiceProperty<T, keyof T>;
    if (typeof property === 'function') {
      newValue = ((args: unknown) => {
        if (isMethodArgs(args)) {
          const token = TokenStorage.getTokens()?.accessToken;

          return property({
            ...args,
            requestBody: {
              ...args.requestBody,
              accessToken: token,
            },
          });
        }
        return property(args);
      }) as TokenlessServiceProperty<T, keyof T>;
    }
    previousValue[key] = newValue as SuccessOnly<TokenlessServiceProperty<T, keyof T>>;
    return previousValue;
  }, {}) as TokenlessService<T>;
}

function isMethodArgs(args: unknown): args is RequestMethodArgs {
  return typeof args === 'object' && args !== null && 'requestBody' in args;
}
