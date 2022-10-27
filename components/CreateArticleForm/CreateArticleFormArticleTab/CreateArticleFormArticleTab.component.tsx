import { MarkdownEditor } from '@components/MarkdownEditor/MarkdownEditor.component';
import { Button, Form } from 'antd';
import { FC, useContext } from 'react';
import { CreateArticleFormContext } from '../CreateArticleForm.component';
import { LeftOutlined } from '@ant-design/icons';

export const CreateArticleFormArticleTab: FC = () => {
  const formContext = useContext(CreateArticleFormContext);
  const form = formContext?.form;

  const values = form?.getFieldsValue(true);

  return (
    <div style={{ padding: '56px' }}>
      <h1 style={{ textAlign: 'start', marginBottom: '40px', fontSize: '24px' }}>{values?.title || 'Без названия'}</h1>
      <Form.Item noStyle rules={[{ required: true, message: 'Введите текст статьи' }]} name={'text'}>
        <MarkdownEditor initialValue={values?.text} />
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
        <Form.Item>
          <Button
            onClick={() => {
              if (formContext.handleTabListChange) {
                formContext?.handleTabListChange('information');
              }
            }}
            icon={<LeftOutlined />}
            size="large"
            type="link"
          >
            {'Вернуться к редактированию информации'}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button size="large" type="primary" htmlType="submit">
            {'Опубликовать'}
          </Button>
        </Form.Item>
      </div>
    </div>
  );
};
