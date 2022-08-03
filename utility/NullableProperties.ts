/**
 * Выплёвывает активные фильтры для листинга пользователей на основании query (GET) значений;
 */

export type NullableProperties<T> = {
  [K in keyof T]: T[K] | null;
};
