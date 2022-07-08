import { FC } from 'react';
import { Layout } from 'antd';
import { SiderMenu } from '../SiderMenu';

const { Sider, Content } = Layout;

export const MainLayout: FC = ({ children }) => {
  return (
    <Layout>
      <Sider width={280}>
        <SiderMenu />
      </Sider>
      <Content>{children}</Content>
    </Layout>
  );
};
