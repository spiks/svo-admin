import React, { FC, useState } from 'react';
import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select, Upload, UploadProps } from 'antd';
import { FileAddOutlined, CheckCircleFilled } from '@ant-design/icons';
import { AddDiplomaModal } from '../AddDiplomaModal/AddDiplomaModal.component';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const props: UploadProps = {
  defaultFileList: [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500',
      url: 'http://www.baidu.com/xxx.png',
    },
  ],
};

export const UserProfileDocumentsForm: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <h2 style={{ marginBottom: '24px' }}>Документы, подтверждающие персональные данные</h2>
      <Collapse style={{ width: '100%', marginBottom: '24px' }} expandIconPosition={'end'}>
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              >
                <Option>Подтверждён</Option>
                <Option>Отклонен</Option>
              </Select>
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Паспорт" required tooltip />
              </Col>
            </Row>
          }
          key="1"
        >
          <Form size="large" layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={'Гражданство'}>
                  <Select></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'Место рождения'}>
                  <Select></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={'Серия / номер'}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={'Дата выдачи'}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={'Код подразделения'}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={'Кем выдан'}>
              <TextArea />
            </Form.Item>
            <Row align="middle" justify="space-between">
              <Col>
                <Form.Item>
                  <Upload {...props} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary">ОК</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              >
                <Option>Подтверждён</Option>
                <Option>Отклонен</Option>
              </Select>
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="СНИЛС" required tooltip />
              </Col>
            </Row>
          }
          key="2"
        >
          <Form size="large" layout="vertical">
            <Row align="bottom" justify="space-between">
              <Col>
                <Form.Item label="СНИЛС">
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Upload {...props} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary">ОК</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              >
                <Option>Подтверждён</Option>
                <Option>Отклонен</Option>
              </Select>
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="ИНН" required tooltip />
              </Col>
            </Row>
          }
          key="3"
        >
          <Form size="large" layout="vertical">
            <Row align="bottom" justify="space-between">
              <Col>
                <Form.Item label="ИНН">
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Upload {...props} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary">ОК</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      <h2 style={{ marginBottom: '24px' }}>Документы об образовании</h2>
      <Collapse style={{ width: '100%' }} expandIconPosition={'end'} defaultActiveKey={['1']}>
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              >
                <Option>Подтверждён</Option>
                <Option>Отклонен</Option>
              </Select>
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Диплом о высшем образовании" required tooltip />
              </Col>
            </Row>
          }
          key="4"
        >
          <Form size="large" layout="vertical">
            <Form.Item label={'Наименование высшего учебного заведения'}>
              <TextArea></TextArea>
            </Form.Item>
            <Form.Item label={'Специальность'}>
              <TextArea></TextArea>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={'Серия / номер'}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'Год выпуска'}>
                  <Select />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Upload {...props} />
            </Form.Item>
          </Form>
        </Panel>
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              >
                <Option>Подтверждён</Option>
                <Option>Отклонен</Option>
              </Select>
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Курсы повышения квалификации" required tooltip />
              </Col>
            </Row>
          }
          key="5"
        >
          <Form size="large" layout="vertical">
            <Form.Item label={'Наименование высшего учебного заведения'}>
              <TextArea></TextArea>
            </Form.Item>
            <Form.Item label={'Специальность'}>
              <TextArea></TextArea>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={'Серия / номер'}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'Год выпуска'}>
                  <Select />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Upload {...props} />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  setIsModalVisible(true);
                }}
                icon={<FileAddOutlined />}
                type={'default'}
              >
                Добавить документ об образовании
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type={'primary'}>Сохранить</Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      <AddDiplomaModal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} />
    </>
  );
};
