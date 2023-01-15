import React, { FC } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { required } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { type } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/type.rule';
import { armIssuerId } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/armIssuerId.rule';
import { kgNumber } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/kgNumber.rule';

export const ArmenianPassportFields: FC = () => {
  return (
    <Row gutter={32}>
      <Col xs={8}>
        <Form.Item label={'Тип паспорта'} name={'type'} rules={[required, type]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item label={'Код органа выпустившего паспорт'} name={'issuerId'} rules={[required, armIssuerId]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item label={'Номер паспорта'} name={'number'} rules={[required, kgNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
    </Row>
  );
};
