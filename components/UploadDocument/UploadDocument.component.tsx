import { ChangeEventHandler, FC, useCallback, useMemo, useRef, useState } from 'react';
import styles from './UploadDocument.module.css';
import { Button, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadDocumentStyleIcon } from './UploadDocument.utils';

export type UploadDocumentProps = {
  style: 'rejected' | 'approved' | 'pending' | 'empty';
  onUpload: (file: File) => Promise<void>;
  document: {
    name: string;
  };
};

export const UploadDocument: FC<UploadDocumentProps> = ({ style, document, onUpload }) => {
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      const file = e.target.files?.item(0);
      if (!file) {
        return;
      }

      setLoading(true);
      await onUpload(file);
      setLoading(false);

      e.target.value = '';
    },
    [onUpload],
  );

  const onClick = useCallback(async () => {
    inputRef.current?.click();
  }, []);

  const className = useMemo(() => {
    return [styles['document'], styles[style]].join(' ');
  }, [style]);

  const icon = useMemo(() => {
    return UploadDocumentStyleIcon[style];
  }, [style]);

  return (
    <Spin spinning={loading}>
      <div className={className}>
        <Button icon={icon} type={'link'}>
          {document.name}
        </Button>
        <Button size={'small'} icon={<UploadOutlined />} onClick={onClick}>
          Загрузить
        </Button>
        <input ref={inputRef} type={'file'} onChange={onFileChange} hidden={true} />
      </div>
    </Spin>
  );
};
