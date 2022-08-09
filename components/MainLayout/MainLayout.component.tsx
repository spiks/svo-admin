import { FC } from 'react';
import { Layout } from 'antd';
import { SiderMenu } from '../SiderMenu/SiderMenu.component';
const { Sider, Content } = Layout;

export const MainLayout: FC = ({ children }) => {
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        width={280}
      >
        <SiderMenu />
      </Sider>
      <Layout
        style={{
          marginLeft: 280,
        }}
      >
        <Content style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};
