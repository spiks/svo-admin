import { MarkdownEditor } from '@components/MarkdownEditor/MarkdownEditor.component';
import { Button, Form } from 'antd';

import { FC, useContext, useEffect } from 'react';
import { CreateArticleFormContext } from '../CreateArticleForm.component';
import { LeftOutlined } from '@ant-design/icons';

export const CreateArticleFormArticleTab: FC = () => {
  const formContext = useContext(CreateArticleFormContext);
  const context = formContext?.form;

  const values = context?.getFieldsValue(true);

  return (
    <>
      <h1 style={{ textAlign: 'start', marginBottom: '40px', fontSize: '24px' }}>{values?.title}</h1>
      <Form.Item rules={[{ required: true, message: 'Введите текст статьи' }]} name={'text'}>
        <MarkdownEditor initialValue={values?.text} />
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
    </>
  );
};
