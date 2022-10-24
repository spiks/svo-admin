import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Switch, Upload, UploadProps } from 'antd';
import { FC, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

export type AddDiplomaModalProps = {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AddDiplomaModal: FC<AddDiplomaModalProps> = ({ visible, onOk, onCancel }) => {
  const [disableSwitch, setDisableSwitch] = useState(true);

  const props: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.info(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setDisableSwitch(false);
        message.success(`${info.file.name} Файл успешно загружен.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} Произошла ошибка.`);
      }
    },
  };

  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Добавить"
      cancelText="Отменить"
      title={'Добавить документ об образовании'}
    >
      <Form>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Тип документа'}>
          <Select>
            <Select.Option>Курсы повышения квалификации</Select.Option>
            <Select.Option>Диплом о высшем образовании</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Наименование высшего учебного заведения'}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Специальность'}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Серия / номер'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Дата вручения'}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={12}>
            <Form.Item>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Загрузить файл</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item colon={false} label={'Подтвердить документ'} tooltip>
              <Switch defaultChecked disabled={disableSwitch} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
