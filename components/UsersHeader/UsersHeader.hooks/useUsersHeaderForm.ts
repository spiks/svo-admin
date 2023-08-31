import { useRouter } from 'next/router';
import { FormInstance, FormProps } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { UsersQueryParams } from '../UsersHeader.typedef';

/**
 * Выплёвывает параметры для view'шки управления шапкой листинга пользователей (UsersHeader);
 */
export function useUsersHeaderForm(form: FormInstance<UsersQueryParams>) {
  const { replace, query } = useRouter();

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const toggleShowFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleFiltersApply = useCallback(async () => {
    const values = form.getFieldsValue();
    const { search } = values;
    const prev = { ...query };
    delete prev.search;

    await replace({
      query: {
        ...prev,
        ...(search && { search }),
      },
    });
  }, [form, query, replace]);

  const handleResetFilters = useCallback(() => {
    form.setFieldsValue({
      search: undefined,
    });
    form.submit();
  }, [form]);

  const debounceTimerId = useRef<null | number>(null);
  const handleFiltersChange: FormProps['onValuesChange'] = useCallback(() => {
    const timerId = debounceTimerId.current;

    if (timerId) {
      clearTimeout(timerId);
    }

    debounceTimerId.current = +setTimeout(() => {
      form.submit();
    }, 1500);
  }, [form]);

  return useMemo(() => {
    return {
      toggleShowFilters,
      handleFiltersApply,
      handleResetFilters,
      handleFiltersChange,
      showFilters,
    };
  }, [handleFiltersApply, handleFiltersChange, handleResetFilters, showFilters, toggleShowFilters]);
}
