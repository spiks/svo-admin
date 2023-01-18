import { Button, Col, Collapse, Form, Input, Row, Tag } from 'antd';
import React, { FC } from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { AddFormButton } from '@components/AddFormButton.component';

const { Panel } = Collapse;

const specializations = [
  { value: '1', label: 'Специализация 1' },
  { value: '2', label: 'Специализация 2' },
  { value: '3', label: 'Специализация 3' },
];

const tags = [
  { value: '1', label: 'Тег 1' },
  { value: '2', label: 'Тег 2' },
  { value: '3', label: 'Тег 3' },
];

type Employment = {
  years: number;
  companyName: string;
};

export const TherapistPracticeSection: FC = () => {
  return (
    <section>
      <Collapse expandIconPosition={'end'}>
        <Panel
          key={'1'}
          extra={<Button type={'text'} icon={<DeleteTwoTone />} />}
          header={'Практический опыт и место работы'}
        >
          <Form layout={'vertical'}>
            <Row justify={'space-between'} align={'bottom'}>
              <Col span={11}>
                <Form.Item style={{ margin: 0 }} label="Практический опыт" name="experience">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item style={{ margin: 0 }} label="Место работы" name="place">
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary">ОК</Button>
              </Col>
            </Row>
          </Form>
        </Panel>
        <AddFormButton label={'Практический опыт и место работы'} onClick={() => {}} />
        <Panel forceRender key={'specializations'} header={'Моя специализации'}>
          <Form layout={'vertical'}>
            <Row style={{ marginBottom: '16px' }}>
              <Form.Item name="specializations">
                {specializations.map((it) => (
                  <Tag onClick={() => {}} key={it.value}>
                    {it.label}
                  </Tag>
                ))}
              </Form.Item>
            </Row>
            <Row justify={'space-between'} align={'bottom'}>
              <Col flex={1}>
                <Form.Item style={{ margin: 0 }} label="Дополнительные специализации" name="extra-specializations">
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary">ОК</Button>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel forceRender key={'tags'} header={'Мои теги'}>
          <Form layout={'vertical'}>
            <Form.Item name="tags">
              {tags.map((it) => (
                <Tag onClick={() => {}} key={it.value}>
                  {it.label}
                </Tag>
              ))}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </section>
  );
};
