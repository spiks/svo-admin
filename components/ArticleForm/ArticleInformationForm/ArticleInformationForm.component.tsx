import { TagRender } from '@components/TagRender/TagRender.component';
import { Checkbox, Col, Divider, Form, notification, Row, Select, Typography, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { uploadFile } from 'api/upload/uploadFile';
import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';
import { useGetListBlogTags } from '../../../hooks/useGetListBlogTags';

const { Text } = Typography;

type Props = {
  setUploadedToken: (value: string) => void;
};

export const ArticleInformationForm: FC<Props> = ({ children, setUploadedToken }) => {
  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    const { data: credentials } = await requestFileUploadUrl('article_cover');
    try {
      const { data: uploaded } = await uploadFile(credentials, info.fileList[0].originFileObj as RcFile);
      setUploadedToken(uploaded.token);
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
      <Form.Item name={'shortText'} label="Краткое описание">
        <TextArea style={{ marginBottom: '24px' }} showCount maxLength={400} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }} valuePropName="checked" name={'showPreviewFromArticle'}>
        <Checkbox>{'Показывать начало статьи вместо краткого описания'}</Checkbox>
      </Form.Item>
      <Form.Item rules={[{ required: true, message: 'Укажите теги' }]} name={'tags'} required label="Теги">
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
      {children}
    </div>
  );
};
