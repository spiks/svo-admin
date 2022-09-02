import { FC, useCallback, useMemo, useState } from 'react';
import styles from './Document.module.css';
import { DocumentStyleIcon } from './Document.utils';
import { Button, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export type DocumentProps = {
  style: 'rejected' | 'approved' | 'pending' | 'empty';
  onApproved: () => Promise<void>;
  onReject: () => Promise<void>;
  document: {
    name: string;
    link?: string;
  };
};

export const Document: FC<DocumentProps> = ({ style, document, onApproved, onReject }) => {
  const [loading, setLoading] = useState(false);

  const onAction = useCallback(
    async (type: 'approve' | 'reject') => {
      setLoading(true);
      if (type === 'approve' && onApproved) {
        await onApproved();
      } else if (type === 'reject' && onReject) {
        await onReject();
      }
      setLoading(false);
    },
    [onApproved, onReject],
  );

  const className = useMemo(() => {
    return [styles['document'], styles[style]].join(' ');
    // eslint-disable-next-line
  }, [style]);

  const icon = useMemo(() => {
    return DocumentStyleIcon[style];
  }, [style]);

  return (
    <Spin spinning={loading}>
      <div className={className}>
        <Button icon={icon} type={'link'}>
          {document.name}
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: '4px',
          }}
        >
          <Button size={'small'} icon={<UploadOutlined />} target={'_blank'} href={document.link}>
            Загрузить
          </Button>
          <Button size={'small'} icon={DocumentStyleIcon['approved']} onClick={onAction.bind(null, 'approve')} />
          <Button size={'small'} icon={DocumentStyleIcon['rejected']} onClick={onAction.bind(null, 'reject')} />
        </div>
      </div>
    </Spin>
  );
};
