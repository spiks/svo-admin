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
      {children}
    </PageHeader>
  );
};
