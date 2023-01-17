import React, { FC } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { required } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { type } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/type.rule';
import { kgNumber } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/kgNumber.rule';
import { personalNumber } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/personalNumber.rule';

export const KyrgyzstanPassportFields: FC = () => {
  return (
    <Row gutter={32}>
      <Col xs={8}>
        <Form.Item label={'Тип паспорта'} name={'type'} rules={[required, type]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item label={'Номер паспорта'} name={'number'} rules={[required, kgNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={8}>
        <Form.Item label={'Персональный номер'} name={'personalNumber'} rules={[required, personalNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
    </Row>
  );
};
