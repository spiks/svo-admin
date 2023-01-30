import { Button, Form, notification } from 'antd';
import React, { FC, useCallback } from 'react';
import { AddFormButton } from '@components/AddFormButton.component';
import { Employment } from '../../generated';
import { useMutation } from '@tanstack/react-query';
import { updateTherapistEmployments } from '../../api/therapist/updateTherapistEmployments';
import { TherapistEmploymentFormField } from '@components/TherapistEmploymentForm/TherapistEmploymentFormField.component';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

const emptyEmployment = { companyName: '', years: 0 };

type Props = {
  fetchedEmployments: Employment[];
  id: string;
};

export const TherapistEmploymentForm: FC<Props> = ({ fetchedEmployments, id }) => {
  const [form] = Form.useForm<{ employments: Employment[] }>();

  const refetch = useTherapistSignupQueriesRefresh(id);

  const addEmptyEmployment = useCallback(async () => {
    const fieldsValue = Object.values(form.getFieldsValue(true).employments) as Employment[];
    form.setFieldsValue({ employments: [...fieldsValue, emptyEmployment] });
  }, [form]);

  const { mutate } = useMutation(
    ({ employments }: { employments: Employment[] }) =>
      updateTherapistEmployments(
        id,
        [...employments.filter((it) => it.companyName.trim() !== '' || it.years !== 0)].map((it) => {
          return { ...it, years: +it.years };
        }),
      ),
    {
      onSuccess: async () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Практический опыт и место работы сохранены',
        });
        refetch('therapist');
      },
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось сохранить практический опыт и место работы',
        });
      },
    },
  );

  const handleDeleteButtonClick = (key: number) => {
    const newFieldValues = Object.values(form.getFieldsValue(true).employments) as Employment[];
    newFieldValues.splice(key, 1);
    form.setFieldsValue({ employments: newFieldValues });
  };

  return (
    <Form
      form={form}
      onFinish={mutate}
      initialValues={{ employments: fetchedEmployments.length ? fetchedEmployments : [emptyEmployment] }}
      layout={'vertical'}
    >
      <Form.List name="employments">
        {(fields) => {
          return (
            <>
              {fields.map((it, key) => (
                <div style={{ marginBottom: '16px' }} key={it.key}>
                  <TherapistEmploymentFormField
                    onDeleteButtonClick={() => handleDeleteButtonClick(key)}
                    name={it.name.toString()}
                  />
                </div>
              ))}
            </>
          );
        }}
      </Form.List>
      <Button type="primary" htmlType="submit">
        Сохранить
      </Button>
      <AddFormButton label={'Практический опыт и место работы'} onClick={addEmptyEmployment} />
    </Form>
  );
};
