import React, { FC } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { required } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { identificationNumber } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/identificationNumber.rule';
import { type } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/type.rule';
import { byNumber } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/byNumber.rule';

export const BelarusianPassportDetails: FC = () => {
  return (
    <Row gutter={32}>
      <Col xs={8}>
        <Form.Item label={'Тип паспорта'} name={'type'} rules={[required, type]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item
          label={'Идентификационный номер'}
          name={'identificationNumber'}
          rules={[required, identificationNumber]}
        >
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item label={'Номер паспорта'} name={'number'} rules={[required, byNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
    </Row>
  );
};
