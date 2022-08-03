import { FC } from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Tag } from 'antd';

export const TagRender: FC<CustomTagProps> = ({ label, value, closable, onClose }) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
