import { FC, useMemo } from 'react';
import styles from './Document.module.css';
import { DocumentStyleIcon } from './Document.utils';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export type DocumentProps = {
  style: 'rejected' | 'approved' | 'pending' | 'empty';
  // Ссылка по которой переводит кнопка "Подробнее";
  href: string;
  name: string;
};

export const Document: FC<DocumentProps> = ({ style, name, href }) => {
  const className = useMemo(() => {
    return [styles['document'], styles[style]].join(' ');
    // eslint-disable-next-line
  }, [style]);

  const icon = useMemo(() => {
    return DocumentStyleIcon[style];
  }, [style]);

  return (
    <div className={className}>
      <Button icon={icon} type={'link'}>
        {name}
      </Button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: '4px',
        }}
      >
        <Button size={'small'} icon={<ArrowRightOutlined />} href={href}>
          Подробнее
        </Button>
      </div>
    </div>
  );
};
