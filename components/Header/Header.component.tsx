import { PageHeader, PageHeaderProps } from 'antd';
import { FC } from 'react';
export const Header: FC<PageHeaderProps> = ({ children, ...props }) => {
  return (
    <PageHeader
      onBack={() => {
        return null;
      }}
      {...props}
    >
      <div style={{ marginLeft: '36px' }}>{children}</div>
    </PageHeader>
  );
};
