import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import { ruIssuerId } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/ruIssuerId.rule';
import { ruNumber } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/ruNumber.rule';
import { required } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';

export const RussianPassportFields = () => {
  return (
    <Row gutter={32}>
      <Col xs={12}>
        <Form.Item label={'Серия / Номер'} name={'number'} rules={[required, ruNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={12}>
        <Form.Item label={'Код подразделения'} name={'issuerId'} rules={[required, ruIssuerId]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
    </Row>
  );
};
