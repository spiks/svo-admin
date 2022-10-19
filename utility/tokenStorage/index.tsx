import { IssuedAuthorizationCredentials } from '../../generated';

type ClientStorageResult<T = string> = T | undefined;

const isTokens = (obj: Record<string, unknown>): obj is IssuedAuthorizationCredentials => {
  return ['accessToken', 'refreshToken', 'expiresAt'].every((key) => {
    const hasKey = Object.prototype.hasOwnProperty.call(obj, key);
    if (!hasKey) {
      return false;
    }

    const isString = typeof obj[key] === 'string';
    if (!isString) {
      return false;
    }

    if (key === 'expiresAt') {
      const date = new Date(obj[key] as string);
      if (date.toString() === 'Invalid Date') {
        return false;
      }
    }

    return true;
  });
};

export class TokenStorage {
  public static setTokens(obj: IssuedAuthorizationCredentials): void {
    localStorage.setItem('Tokens', JSON.stringify(obj));
  }

  public static getTokens(): ClientStorageResult<IssuedAuthorizationCredentials> {
    const json = localStorage.getItem('Tokens');
    if (json === null) {
      return undefined;
    }

    try {
      const obj = JSON.parse(json);
      if (!isTokens(obj)) {
        return undefined;
      }
      return obj;
    } catch (err) {
      return undefined;
    }
  }

  public static clearTokens(): void {
    localStorage.removeItem('Tokens');
  }
}
