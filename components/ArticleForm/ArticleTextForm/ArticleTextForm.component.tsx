import { MarkdownEditor } from '@components/MarkdownEditor/MarkdownEditor.component';
import { Button, Form } from 'antd';
import { FC } from 'react';
import { LeftOutlined } from '@ant-design/icons';

type Props = {
  title: string;
  text: string;
  onReturnBackButtonClick: () => void;
};

export const ArticleTextForm: FC<Props> = ({ text, title, onReturnBackButtonClick }) => {
  return (
    <div style={{ padding: '56px' }}>
      <h1 style={{ textAlign: 'start', marginBottom: '40px', fontSize: '24px' }}>{title || 'Без названия'}</h1>
      <Form.Item rules={[{ required: true, message: 'Введите текст статьи' }]} name={'text'}>
        <MarkdownEditor initialValue={text} />
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
        <Form.Item>
          <Button onClick={onReturnBackButtonClick} icon={<LeftOutlined />} size="large" type="link">
            {'Вернуться к редактированию информации'}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button disabled={!(Boolean(title) && Boolean(text))} size="large" type="primary" htmlType="submit">
            {'Опубликовать'}
          </Button>
        </Form.Item>
      </div>
    </div>
  );
};
