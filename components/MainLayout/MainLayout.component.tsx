import { FC } from 'react';
import { Layout, Spin } from 'antd';
import { SiderMenu } from '../SiderMenu/SiderMenu.component';

const { Sider, Content } = Layout;

export const MainLayout: FC<{ loading?: boolean }> = ({ children, loading }) => {
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
        <Content style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <Spin
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
            />
          ) : (
            children
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
