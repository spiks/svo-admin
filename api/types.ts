export type ApiResponseSuccess<T> = Promise<{ status: 'success'; data: T }>;
