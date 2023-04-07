import { useRouter } from 'next/router';
import { Form, FormProps } from 'antd';
import { useCallback, useMemo, useRef } from 'react';
import { BlogHeaderQueryParams } from '../BlogHeader.typedef';

export function useBlogHeaderForm() {
  const { replace, query } = useRouter();
  const [form] = Form.useForm<BlogHeaderQueryParams>();

  const handleFiltersApply = useCallback(async () => {
    const values = form.getFieldsValue();
    const { search, tags, date } = values;

    const publishDate = date && date.format('YYYY-MM-DD');

    await replace({
      query: {
        ...query,
        search,
        tags,
        publishDate,
      },
    });
  }, [form, query, replace]);

  const handleResetFilters = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      search: undefined,
      tags: undefined,
      date: undefined,
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
      handleFiltersApply,
      handleResetFilters,
      handleFiltersChange,
      form,
    };
  }, [form, handleFiltersApply, handleFiltersChange, handleResetFilters]);
}
