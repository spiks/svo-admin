import { ReactNode, Ref, UIEvent, useRef } from 'react';
import type { BaseSelectRef } from 'rc-select';
import { Select } from 'antd';
import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { DefaultOptionType } from 'antd/lib/select';

type AntDesignFormItemProps = {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
};

export type PromoCodeModalSelectProps<T> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<T>;
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
  queryFn,
  queryOptions,
  renderOptions,
  placeholder,
}: PromoCodeModalSelectProps<T>) {
  const selectRef: Ref<BaseSelectRef> = useRef(null);

  const scrollPopupToTop = () => {
    if (selectRef.current !== null) {
      selectRef.current.scrollTo(0);
    }
  };

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(queryKey, queryFn, queryOptions);

  const handleScrollPopup = async (event: UIEvent<HTMLDivElement>) => {
    const popupElm = event.target as HTMLDivElement;

    const hasFullyScrolled = popupElm.scrollHeight - popupElm.scrollTop === popupElm.offsetHeight;

    if (hasFullyScrolled && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Select
      placeholder={placeholder}
      showSearch={true}
      mode="multiple"
      allowClear
      onPopupScroll={handleScrollPopup}
      ref={selectRef}
      options={renderOptions(data)}
      value={value}
      onChange={onChange}
      maxTagCount={'responsive'}
    />
  );
}
