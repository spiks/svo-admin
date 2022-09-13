import { useRouter } from 'next/router';
import { FormInstance, FormProps } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { UsersQueryParams } from '../UsersHeader.typedef';

/**
 * Выплёвывает параметры для view'шки управления шапкой листинга пользователей (UsersHeader);
 */
export function useUsersHeaderForm(form: FormInstance<UsersQueryParams>) {
  const { replace } = useRouter();

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const toggleShowFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleFiltersApply = useCallback(async () => {
    const values = form.getFieldsValue();

    const { search, phone } = values;
    await replace({
      query: {
        ...(search && { search }),
        ...(phone && { phone }),
      },
    });
  }, [form, replace]);

  const handleResetFilters = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      search: undefined,
      phone: undefined,
    });
    form.submit();
  }, [form]);

  const debounceTimerId = useRef<null | number>(null);
  const handleFiltersChange: FormProps['onFieldsChange'] = useCallback(() => {
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
