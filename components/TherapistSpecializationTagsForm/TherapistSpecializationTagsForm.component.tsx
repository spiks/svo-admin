import { Col, notification, Row, Space, Tag } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateTherapistTags } from '../../api/therapist/updateTherapistTags';
import { ListSelectableSpecializationTagsWithGroups } from '../../generated';

const { CheckableTag } = Tag;

type Props = {
  fetchedSpecializationTags: ListSelectableSpecializationTagsWithGroups;
  id: string;
};

export const TherapistSpecializationTagsForm: FC<Props> = ({ fetchedSpecializationTags, id }) => {
  const [selectedSpecializationsTags, setSelectedSpecializationsTags] = useState<string[]>([]);

  const { mutate } = useMutation((tagIds: string[]) => updateTherapistTags(id, tagIds), {
    onError: () => {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось теги',
      });
    },
  });
  const selectableSpecializationTags = useMemo(
    () => fetchedSpecializationTags.flatMap((it) => it.items),
    [fetchedSpecializationTags],
  );

  useEffect(() => {
    setSelectedSpecializationsTags(selectableSpecializationTags.filter((it) => it.isSelected).map((it) => it.id));
  }, [selectableSpecializationTags]);

  const handleSpecializationTagsChange = useCallback(
    (processedId: string, checked: boolean) => {
      const nextSelectedTags: string[] = checked
        ? [...selectedSpecializationsTags, processedId]
        : selectedSpecializationsTags.filter((tagId) => tagId !== processedId);

      setSelectedSpecializationsTags(nextSelectedTags);
      mutate(nextSelectedTags);
    },
    [mutate, selectedSpecializationsTags],
  );

  return (
    <Space direction="vertical" size="middle">
      {fetchedSpecializationTags.map(({ group, items }) => (
        <Space direction="vertical" size="small" key={group}>
          <div>{group}</div>
          <Row gutter={[8, 8]}>
            {items.map((it) => (
              <Col key={it.id}>
                <CheckableTag
                  onChange={(checked) => handleSpecializationTagsChange(it.id, checked)}
                  checked={selectedSpecializationsTags.includes(it.id)}
                >
                  {it.name}
                </CheckableTag>
              </Col>
            ))}
          </Row>
        </Space>
      ))}
    </Space>
  );
};
