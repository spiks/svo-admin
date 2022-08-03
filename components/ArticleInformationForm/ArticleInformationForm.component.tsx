import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';
import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ButtonsOptionsType, TagOptionsType } from './ArticleInformationForm.typedef';
import { TagRender } from '../TagRender/TagRender.component';

const buttonOptions: ButtonsOptionsType = [
  { label: 'Опубликовано', value: 'published' },
  { label: 'В архиве', value: 'archived' },
];

const tagOptions: TagOptionsType = [
  { label: 'Общая практика', value: 'gold' },
  { label: 'Мотивация', value: 'blue' },
  { label: 'Семья', value: 'lime' },
];

export const ArticleInformationForm: FC = () => {
  const [buttonValue, setButtonValue] = useState<string>('published');
  const { TextArea } = Input;
  const { Text } = Typography;

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setButtonValue(value);
  };

  return (
    <div style={{ maxWidth: '636px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '48px' }}>{'Информация'}</h1>
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item required label="Заголовок статьи">
          <TextArea showCount maxLength={100} />
        </Form.Item>
        <Form.Item label="Краткое описание">
          <TextArea style={{ marginBottom: '24px' }} showCount maxLength={400} />
          <Checkbox>{'Показывать начало статьи вместо краткого описания'}</Checkbox>
        </Form.Item>
        <Form.Item required label="Теги">
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
        <Form.Item label="Обложка статьи" valuePropName="fileList">
          <Row gutter={16}>
            <Col span={6}>
              <Upload action="/upload.do" listType="picture-card">
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
                <Col span={24}>
                  <Checkbox>{'Использовать первое изображение статьи'}</Checkbox>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item style={{ marginBottom: '48px' }} required label="Статус">
          <Radio.Group
            options={buttonOptions}
            onChange={onChange}
            value={buttonValue}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Button size="large" type="primary">
                {'Сохранить'}
              </Button>
            </Col>
            <Col>
              <Button size="large" type="link">
                {'Перейти к статье'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
