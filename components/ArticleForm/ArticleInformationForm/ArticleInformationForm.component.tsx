import { TagRender } from '@components/TagRender/TagRender.component';
import { Checkbox, Col, Divider, Form, notification, Row, Select, Typography, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useGetListBlogTags } from '../../../hooks/useGetListBlogTags';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { validateUploadImage } from '../../../helpers/validateUploadImage';

const { Text } = Typography;

export const ArticleInformationForm: FC = ({ children }) => {
  const tagsOptions = useGetListBlogTags(() =>
    notification.error({
      type: 'error',
      message: 'Ошибка',
      description: 'Не удалось загрузить теги для категоризации статьи',
    }),
  );

  return (
    <div style={{ padding: '80px 160px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '38px' }}>{'Информация'}</h1>
      <Form.Item
        rules={[{ required: true, message: 'Введите заголовок статьи' }]}
        name={'title'}
        required
        label="Заголовок статьи"
      >
        <TextArea style={{ marginBottom: '16px' }} showCount maxLength={100} />
      </Form.Item>
      <Form.Item
        normalize={(value) => {
          return value ? value : null;
        }}
        name={'shortText'}
        label="Краткое описание"
      >
        <TextArea style={{ marginBottom: '24px' }} showCount maxLength={400} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }} valuePropName="checked" name={'showPreviewFromArticle'}>
        <Checkbox>{'Показывать начало статьи вместо краткого описания'}</Checkbox>
      </Form.Item>
      <Form.Item rules={[{ message: 'Укажите теги' }]} name={'tags'} label="Теги">
        <Select
          size="large"
          mode="multiple"
          tagRender={({ label, value, closable, onClose, ...props }) => {
            return <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />;
          }}
          style={{ width: '100%' }}
          options={tagsOptions?.map((it) => {
            return {
              value: it.id,
              label: it.name,
            };
          })}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }} valuePropName="checked" name={'showInBlockInterestingAndUseful'}>
        <Checkbox>{'Показывать в “Интересно и полезно”'}</Checkbox>
      </Form.Item>
      <Form.Item label="Обложка статьи">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name={'cover'}
              valuePropName={'fileList'}
              getValueFromEvent={(e: UploadChangeParam<UploadFile<unknown>>) => {
                return e.fileList;
              }}
            >
              <Upload
                beforeUpload={(file) => {
                  return validateUploadImage(file);
                }}
                maxCount={1}
                listType="picture-card"
                showUploadList={true}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: '8px' }}>Загрузить</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Row>
              <Col span={24}>
                <Text type="secondary">{'Формат изображения: JPG, PNG.'}</Text>
              </Col>
              <Col span={24}>
                <Text type="secondary">
                  {
                    'Размер изображения – не более 15.7 mb с ограничением по высоте от 10 до 5400 и по ширине от 912 до 5400'
                  }
                </Text>
              </Col>
              <Col span={24}>
                <Divider style={{ margin: '11px 0' }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form.Item>
      {children}
    </div>
  );
};
