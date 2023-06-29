import { Button, Col, Form, Input, notification, Row, Select, Space, Tag } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateTherapistSpecializations } from '../../api/therapist/updateTherapistSpecializations';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';
import { SPECIALIZATIONS } from 'constants/mainSpecialization';
import { updateTherapistProblems } from 'api/therapist/updateTherapistProblems';
import { ProblemsMeAndPartnerItem, TherapistsProblemsItem } from 'generated';

const { CheckableTag } = Tag;

export const TherapistSpecializationsForm = () => {
  const {
    therapist: { problems: fetchedProblems, additionalSpecializations, id, mainSpecialization },
  } = useContext(TherapistPageContext);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [mainSpecializationForm] = Form.useForm<{ mainSpecialization: string | null }>();
  const [additionalSpecializationsForm] = Form.useForm<{ additionalSpecializations: string | null }>();

  const refetch = useTherapistSignupQueriesRefresh(id);

  const { mutate: mutateProblems } = useMutation((problems: string[]) => updateTherapistProblems(id, problems), {
    onSuccess: () => {
      refetch('therapist');
    },
    onError: () => {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить дополнительные специализации',
      });
    },
  });

  const selectableMySelfProblems = fetchedProblems.flatMap((problem) => {
    if (problem.type === 'myself') {
      return problem.problemGroups;
    }
    return [];
  });

  const selectableMeAndPartnerProblems = fetchedProblems.flatMap((problem) => {
    if (problem.type === 'me_and_partner') {
      return problem.items;
    }
    return [];
  });

  const selectableProblemsItems = useMemo(() => {
    return fetchedProblems.flatMap((problem) => {
      if (problem.type === 'me_and_partner') {
        return problem.items;
      }
      return problem.problemGroups.flatMap((group) => group.items);
    });
  }, [fetchedProblems]);

  useEffect(() => {
    setSelectedProblems(selectableProblemsItems.filter((it) => it.isSelected).map((it) => it.id));
  }, [selectableProblemsItems]);

  const handleSpecializationTagsChange = useCallback(
    (processedId: string, checked: boolean) => {
      const nextSelectedTags: string[] = checked
        ? [...selectedProblems, processedId]
        : selectedProblems.filter((tagId) => tagId !== processedId);

      setSelectedProblems(nextSelectedTags);
      mutateProblems(nextSelectedTags);
    },
    [selectedProblems, mutateProblems],
  );

  const { mutate: mutateAdditionalSpecializations } = useMutation(
    () =>
      updateTherapistSpecializations(
        id,
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
                <Select placeholder={'Выберите основную специализацию'} options={SPECIALIZATIONS} />
              </Form.Item>
            </Col>
            <Col>
              <Button htmlType="submit" type="primary">
                ОК
              </Button>
            </Col>
          </Row>
        </Form>
        {fetchedProblems.map((problem) => {
          if (problem.type === 'me_and_partner') {
            return (
              <Space direction="vertical" size="small" key={'me_and_partner'}>
                <div>{'Я и партнер'}</div>
                <Row gutter={[8, 8]}>
                  {problem.items.map((it) => (
                    <Col key={it.id}>
                      <CheckableTag
                        onChange={(checked) => handleSpecializationTagsChange(it.id, checked)}
                        checked={selectedProblems.includes(it.id)}
                      >
                        {it.name}
                      </CheckableTag>
                    </Col>
                  ))}
                </Row>
              </Space>
            );
          }
          return problem.problemGroups.map(({ group, items }) => {
            return (
              <Space direction="vertical" size="small" key={group}>
                <div>{group}</div>
                <Row gutter={[8, 8]}>
                  {items.map((it) => (
                    <Col key={it.id}>
                      <CheckableTag
                        onChange={(checked) => handleSpecializationTagsChange(it.id, checked)}
                        checked={selectedProblems.includes(it.id)}
                      >
                        {it.name}
                      </CheckableTag>
                    </Col>
                  ))}
                </Row>
              </Space>
            );
          });
        })}
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
