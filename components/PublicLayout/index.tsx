import { FC } from 'react';
import { Layout } from 'antd';
import styles from './PublicLayout.module.css';

const { Footer, Content } = Layout;

export const PublicLayout: FC = ({ children }) => {
  return (
    <Layout className={styles['publicLayout']}>
      <Content>{children}</Content>
      <Footer>%FOOTER%</Footer>
    </Layout>
  );
};
