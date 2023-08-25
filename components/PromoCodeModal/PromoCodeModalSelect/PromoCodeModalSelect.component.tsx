import { ReactNode, UIEvent, useState } from 'react';
import { Select } from 'antd';
import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { DefaultOptionType } from 'antd/lib/select';

type AntDesignFormItemProps = {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
};

export type PromoCodeModalSelectProps<T> = {
  queryKey: QueryKey;
  fetchData: (offset: number, search: string) => T | Promise<T>;
  queryOptions: UseInfiniteQueryOptions<T>;
  renderOptions: (data: InfiniteData<T> | undefined) => DefaultOptionType[] | undefined;
  placeholder?: ReactNode;
} & AntDesignFormItemProps;

/**
 * Компонент выпадающего списка с возможностью фетчинга опций
 */
export function PromoCodeModalSelect<T>({
  value,
  onChange,
  queryKey,
  fetchData,
  queryOptions,
  renderOptions,
  placeholder,
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
      value={value}
      onChange={onChange}
      maxTagCount={'responsive'}
    />
  );
}
