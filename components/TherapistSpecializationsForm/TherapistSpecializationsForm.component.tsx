import { Button, Col, Form, Input, notification, Row, Space, Tag } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateTherapistSpecializations } from '../../api/therapist/updateTherapistSpecializations';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Employment } from '../../generated';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

const { CheckableTag } = Tag;

export const TherapistSpecializationsForm = () => {
  const {
    therapist: { specializations: fetchedSpecializations, additionalSpecializations, id, mainSpecialization },
  } = useContext(TherapistPageContext);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [mainSpecializationForm] = Form.useForm<{ mainSpecialization: string | null }>();
  const [additionalSpecializationsForm] = Form.useForm<{ additionalSpecializations: string | null }>();

  const refetch = useTherapistSignupQueriesRefresh(id);

  const { mutate } = useMutation(
    (tagIds: string[]) => updateTherapistSpecializations(id, tagIds, additionalSpecializations, mainSpecialization),
    {
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось сохранить информацию',
        });
        refetch('therapist');
      },
    },
  );
  const selectableSpecializationTags = useMemo(
    () => fetchedSpecializations.flatMap((it) => it.items),
    [fetchedSpecializations],
  );

  useEffect(() => {
    setSelectedSpecializations(selectableSpecializationTags.filter((it) => it.isSelected).map((it) => it.id));
  }, [selectableSpecializationTags]);

  const handleSpecializationTagsChange = useCallback(
    (processedId: string, checked: boolean) => {
      const nextSelectedTags: string[] = checked
        ? [...selectedSpecializations, processedId]
        : selectedSpecializations.filter((tagId) => tagId !== processedId);

      setSelectedSpecializations(nextSelectedTags);
      mutate(nextSelectedTags);
    },
    [mutate, selectedSpecializations],
  );

  const { mutate: mutateAdditionalSpecializations } = useMutation(
    () =>
      updateTherapistSpecializations(
        id,
        selectedSpecializations,
        additionalSpecializationsForm.getFieldValue('additionalSpecializations'),
        mainSpecialization,
      ),
    {
      onSuccess: async () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Дополнительные специализации сохранены',
        });
        refetch('therapist');
      },
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось сохранить дополнительные специализации',
        });
      },
    },
  );

  const { mutate: mutateMainSpecialization } = useMutation(
    () =>
      updateTherapistSpecializations(
        id,
        selectedSpecializations,
        additionalSpecializations,
        mainSpecializationForm.getFieldValue('mainSpecialization'),
      ),

    {
      onSuccess: async () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Основная специализация сохранена',
        });
        refetch('therapist');
      },
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось сохранить основную специализацию',
        });
      },
    },
  );

  return (
    <>
      <Space direction="vertical" size="middle">
        <Form
          onFinish={() => {
            mutateMainSpecialization();
          }}
          form={mainSpecializationForm}
          initialValues={{ mainSpecialization }}
          layout={'vertical'}
        >
          <Row gutter={[16, 0]} align={'bottom'}>
            <Col flex={1}>
              <Form.Item style={{ margin: 0 }} label="Основная специализация" name="mainSpecialization">
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Button htmlType="submit" type="primary">
                ОК
              </Button>
            </Col>
          </Row>
        </Form>
        {fetchedSpecializations.map(({ group, items }) => (
          <Space direction="vertical" size="small" key={group}>
            <div>{group}</div>
            <Row gutter={[8, 8]}>
              {items.map((it) => (
                <Col key={it.id}>
                  <CheckableTag
                    onChange={(checked) => handleSpecializationTagsChange(it.id, checked)}
                    checked={selectedSpecializations.includes(it.id)}
                  >
                    {it.name}
                  </CheckableTag>
                </Col>
              ))}
            </Row>
          </Space>
        ))}
        <Form
          onFinish={() => mutateAdditionalSpecializations()}
          form={additionalSpecializationsForm}
          initialValues={{ additionalSpecializations }}
          layout={'vertical'}
        >
          <Row gutter={[16, 0]} align={'bottom'}>
            <Col flex={1}>
              <Form.Item style={{ margin: 0 }} label="Дополнительные специализации" name="additionalSpecializations">
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Button htmlType="submit" type="primary">
                ОК
              </Button>
            </Col>
          </Row>
        </Form>
      </Space>
    </>
  );
};
