import { FC } from 'react';
import { MainLayout } from '../MainLayout/MainLayout.component';

export const NotFoundLayout: FC<{ message: string }> = ({ message }) => {
  return (
    <MainLayout>
      <div
        style={{
          padding: '40px 80px',
        }}
      >
        {message}
      </div>
    </MainLayout>
  );
};
