import { PageHeader, PageHeaderProps } from 'antd';
import { FC } from 'react';
export const Header: FC<PageHeaderProps> = ({ children, ...props }) => {
  return (
    <PageHeader onBack={() => null} {...props}>
      {children}
    </PageHeader>
  );
};
