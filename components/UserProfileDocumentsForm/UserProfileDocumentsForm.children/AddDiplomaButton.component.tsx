import React, { FC } from 'react';
import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

type AddDiplomaButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export const AddDiplomaButton: FC<AddDiplomaButtonProps> = ({ disabled, onClick }) => {
  return (
    <div style={{ width: '100%', marginTop: '16px' }}>
      <Button block={true} disabled={disabled} icon={<FileAddOutlined />} style={{ height: '40px' }} onClick={onClick}>
        Добавить диплом об образовании
      </Button>
    </div>
  );
};
