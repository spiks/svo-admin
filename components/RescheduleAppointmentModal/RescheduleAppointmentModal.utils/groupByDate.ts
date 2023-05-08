import { format } from 'date-fns';

export function groupByDate<T extends Array<{ [K in P]: string }>, P extends string>(
  items: T,
  property: P,
): Map<string, T> {
  return items.reduce((result, currentValue) => {
    const date = format(new Date(currentValue[property]), 'yyyy-MM-dd');
    if (!result.has(date)) {
      result.set(date, []);
    }
    result.set(date, [...result.get(date), currentValue]);
    return result;
  }, new Map());
}
