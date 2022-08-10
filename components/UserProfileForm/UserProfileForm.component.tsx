import { Avatar, Button, Checkbox, Col, DatePicker, Divider, Form, Input, Row, Select, Typography } from 'antd';
import { FC } from 'react';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { TagRender } from '../TagRender/TagRender.component';

const tags: { label: string; value: string }[] = [
  { label: 'Общая практика', value: 'gold' },
  { label: 'Мотивация', value: 'blue' },
  { label: 'Семья', value: 'lime' },
];

export const UserProfileForm: FC = () => {
  const { Text } = Typography;
  const { Option } = Select;
  const { TextArea } = Input;

  return (
    <Form style={{ width: '100%' }} name="basic" size="large" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Divider>Персональные данные</Divider>
      <Form.Item label="Изображение профиля" name="avatar">
        <Row gutter={16}>
          <Col>
            <Avatar shape="square" size={104} icon={<UserOutlined />} />
          </Col>
          <Col span={12}>
            <Row gutter={[0, 11]}>
              <Col span={24}>
                <Text type={'secondary'}>
                  Вам доступно кадрирование фотографии профиля или скрытие, в случаях, когда фотография нарушает
                  правовые или этические нормы
                </Text>
              </Col>
              <Col>
                <Checkbox onChange={() => {}}>Скрыть изображение профиля</Checkbox>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item required label="ФИО" name="username">
        <Input />
      </Form.Item>
      <Form.Item required label="Пол" name="sex">
        <Select defaultValue="male" onChange={() => {}}>
          <Option value="male">Мужской</Option>
          <Option value="female">Женский</Option>
        </Select>
      </Form.Item>
      <Form.Item required label="Дата рождения" name="DOB">
        <DatePicker style={{ width: '100%' }} onChange={() => {}} />
      </Form.Item>
      <Divider>Контактные данные</Divider>
      <Form.Item hasFeedback validateStatus="success" required label="Номер телефона" name="phone">
        <Input prefix={<PhoneOutlined style={{ color: '#52C41A' }} />} />
      </Form.Item>
      <Form.Item hasFeedback validateStatus="success" required label="Email" name="email">
        <Input prefix={<MailOutlined style={{ color: '#52C41A' }} />} type={'email'} />
      </Form.Item>
      <Divider>Свеления о проф. деятельности</Divider>
      <Form.Item required label="Стаж" name="experience">
        <Select defaultValue="10" onChange={() => {}}>
          <Option value="10">10</Option>
        </Select>
      </Form.Item>
      <Form.Item required label="Специализация" name="specialization">
        <Select
          mode="multiple"
          tagRender={({ label, value, closable, onClose, ...props }) => {
            return <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />;
          }}
          style={{ width: '100%' }}
          options={tags}
        />
      </Form.Item>
      <Form.Item required label="Исследуемые темы" name="topics">
        <Select
          mode="multiple"
          tagRender={({ label, value, closable, onClose, ...props }) => {
            return <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />;
          }}
          style={{ width: '100%' }}
          options={tags}
        />
      </Form.Item>
      <Divider>Сведения о проф. деятельности</Divider>
      <Form.Item label="О психологе" name="about">
        <TextArea showCount maxLength={1000} />
      </Form.Item>
      <Form.Item label="Принципы ведения приёма" name="principles">
        <TextArea showCount maxLength={200} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: '8' }}>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};
