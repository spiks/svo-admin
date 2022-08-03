import { FC } from 'react';
import { Layout } from 'antd';
import { SiderMenu } from '../SiderMenu/SiderMenu.component';

const { Sider, Content } = Layout;

export const MainLayout: FC = ({ children }) => {
  return (
    <Layout>
      <Sider width={280}>
        <SiderMenu />
      </Sider>
      <Content style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>{children}</Content>
    </Layout>
  );
};
