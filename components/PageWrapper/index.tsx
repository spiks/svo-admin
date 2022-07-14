import Card from 'antd/lib/card/Card';
import { FC } from 'react';

export const PageWrapper: FC = ({ children }) => {
  return <Card style={{ margin: '40px' }}>{children}</Card>;
};
