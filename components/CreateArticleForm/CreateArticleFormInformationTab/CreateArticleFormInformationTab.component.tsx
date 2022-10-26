import { TagRender } from '@components/TagRender/TagRender.component';
import { Button, Checkbox, Col, Divider, Form, notification, Row, Select, Typography, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { uploadFile } from 'api/upload/uploadFile';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useContext } from 'react';
import { CreateArticleFormContext } from '../CreateArticleForm.component';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';

const { Text } = Typography;

const tagOptions = [{ label: 'Общая практика' }, { label: 'Мотивация' }, { label: 'Семья' }];

export const CreateArticleFormInformationTab: FC = () => {
  const formContext = useContext(CreateArticleFormContext);
  const form = formContext?.form;

  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    const { data: credentials } = await requestFileUploadUrl('article_cover');
    try {
      const { data: uploaded } = await uploadFile(credentials, info.fileList[0].originFileObj as RcFile);
      form?.setFieldValue('cover', uploaded.token);
    } catch (err) {
      if (err instanceof Error) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: err.message,
        });
        return;
      } else {
        throw err;
      }
    }
  };

  return (
    <div style={{ padding: '80px 160px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '38px' }}>{'Информация'}</h1>
      <Form.Item
        rules={[{ required: true, message: 'Введите заголовок статьи' }]}
        name={'title'}
        required
        label="Заголовок статьи"
      >
        <TextArea showCount maxLength={100} />
      </Form.Item>
      <Form.Item name={'shortText'} label="Краткое описание">
        <TextArea style={{ marginBottom: '24px' }} showCount maxLength={400} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }} valuePropName="checked" name={'showPreviewFromArticle'}>
        <Checkbox defaultChecked={false}>{'Показывать начало статьи вместо краткого описания'}</Checkbox>
      </Form.Item>
      <Form.Item rules={[{ required: true, message: 'Укажите теги' }]} name={'tags'} required label="Теги">
        <Select
          size="large"
          mode="multiple"
          tagRender={({ label, value, closable, onClose, ...props }) => {
            return <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />;
          }}
          style={{ width: '100%' }}
          options={tagOptions}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }} valuePropName="checked" name={'showInBlockInterestingAndUseful'}>
        <Checkbox defaultChecked={false}>{'Показывать в “Интересно и полезно”'}</Checkbox>
      </Form.Item>
      <Form.Item name={'cover'} label="Обложка статьи" valuePropName={'fileList'}>
        <Row gutter={16}>
          <Col span={6}>
            <Upload onChange={handleChange} maxCount={1} listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Col>
          <Col span={18}>
            <Row>
              <Col span={24}>
                <Text type="secondary">{'Формат изображения: JPG, PNG.'}</Text>
              </Col>
              <Col span={24}>
                <Text type="secondary">{'Размер изображения – не более 4.0 mb'}</Text>
              </Col>
              <Col span={24}>
                <Divider style={{ margin: '11px 0' }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button
          onClick={() => {
            if (formContext.handleTabListChange) {
              formContext.handleTabListChange('article');
            }
          }}
          size={'large'}
          type={'primary'}
        >
          {'Продолжить'}
        </Button>
      </Form.Item>
    </div>
  );
};
