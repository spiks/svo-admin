import React, { FC, useState } from 'react';
import { Button } from 'antd';
import { RegisterTherapistModal } from '@components/RegisterTherapistModal/RegisterTherapistModal.component';

export const RegisterTherapistButton: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type={'primary'} size={'large'} onClick={setOpen.bind(null, true)}>
        Добавить пользователя
      </Button>
      <RegisterTherapistModal open={open} onCancel={setOpen.bind(null, false)} />
    </>
  );
};
