import { ReactNode, UIEvent, useMemo, useState } from 'react';
import { Select } from 'antd';
import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';

export type PromoCodeModalSelectProps<T> = {
  queryKey: QueryKey;
  fetchData: (offset: number, search: string) => T | Promise<T>;
  queryOptions: UseInfiniteQueryOptions<T>;
  renderOptions: (data: InfiniteData<T> | undefined) => Array<{ value: string; label: string }> | undefined;
  placeholder?: ReactNode;
} & {
  value?: Array<{ value: string; label: string }>;
  onChange?: (value: Array<{ value: string; label: string }> | { value: string; label: string }) => void;
};

/**
 * Компонент выпадающего списка с возможностью фетчинга опций
 */
export function PromoCodeModalSelect<T>({
  value,
  queryKey,
  fetchData,
  queryOptions,
  renderOptions,
  placeholder,
  onChange,
}: PromoCodeModalSelectProps<T>) {
  const [search, setSearch] = useState('');

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  const fetchOptions = ({ pageParam = null }: { pageParam?: number | null }) => {
    return fetchData(pageParam || 0, search);
  };

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [...queryKey, search] as QueryKey,
    fetchOptions,
    queryOptions,
  );

  const handleScrollPopup = async (event: UIEvent<HTMLDivElement>) => {
    const popupElm = event.target as HTMLDivElement;

    const hasFullyScrolled = popupElm.scrollHeight - popupElm.scrollTop === popupElm.offsetHeight;

    if (hasFullyScrolled && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleChangeSelectedItems = async (
    _: unknown,
    values: Array<{ value: string; label: string }> | { value: string; label: string },
  ) => {
    if (onChange === undefined) {
      return;
    }

    if (Array.isArray(values)) {
      onChange(
        values.map((item) => {
          return item;
        }),
      );

      return;
    }

    onChange(values);
  };

  const mappedValue = useMemo(() => {
    if (value === undefined || value === null) {
      return [];
    }

    return value.map((valueItem) => {
      return { value: valueItem.value, label: valueItem.label || 'Аноним' };
    });
  }, [value]);

  return (
    <Select
      filterOption={false}
      placeholder={placeholder}
      showSearch={true}
      mode="multiple"
      allowClear={true}
      onPopupScroll={handleScrollPopup}
      options={renderOptions(data)}
      onSearch={handleChangeSearch}
      value={mappedValue}
      maxTagCount={'responsive'}
      onChange={handleChangeSelectedItems}
    />
  );
}
