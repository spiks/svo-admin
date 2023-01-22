import React, { FC } from 'react';
import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

type AddFormButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  label: string;
};

export const AddFormButton: FC<AddFormButtonProps> = ({ disabled, onClick, label }) => {
  return (
    <div style={{ width: '100%', marginTop: '16px' }}>
      <Button block={true} disabled={disabled} icon={<FileAddOutlined />} style={{ height: '40px' }} onClick={onClick}>
        {label}
      </Button>
    </div>
  );
};
