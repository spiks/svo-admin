import Card from 'antd/lib/card/Card';
import { FC } from 'react';
import styles from './PageWrapper.module.css';

export const PageWrapper: FC = ({ children }) => {
  return (
    <Card style={{ margin: '40px', borderRadius: '8px' }} className={styles['page-wrapper']}>
      {children}
    </Card>
  );
};
