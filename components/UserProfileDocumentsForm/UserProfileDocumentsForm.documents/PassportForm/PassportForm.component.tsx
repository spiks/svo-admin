import React, { ComponentType, FC, useEffect } from 'react';
import { Passport } from '../../../../generated';
import { Button, Col, Form, Input, Row, Select, Upload, UploadFile } from 'antd';
import { RussianPassportFields } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/RussianPassportFields.component';
import { ArmenianPassportFields } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/ArmenianPassportFields.component';
import { BelarusianPassportDetails } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/BelarusianPassportFields.component';
import { KazakhstanPassportFields } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/KazakhstanPassportFields.component';
import { KyrgyzstanPassportFields } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/KyrgyzstanPassportFields.component';
import { middleText } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/middleText.rule';
import { required } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { usePassportConverterFromDto } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.hooks/usePassportConverterFromDto';

const countryRelatedFields = new Map<Passport['information']['country'], ComponentType>();
countryRelatedFields.set('russia', RussianPassportFields);
countryRelatedFields.set('armenia', ArmenianPassportFields);
countryRelatedFields.set('belarus', BelarusianPassportDetails);
countryRelatedFields.set('kazakhstan', KazakhstanPassportFields);
countryRelatedFields.set('kyrgyzstan', KyrgyzstanPassportFields);

export type PassportFormProps = {
  passport: Passport;
  onSubmit?: (values: PassportFormValues) => void;
  disabled?: boolean;
};

export type PassportDetails = Passport['information'];

export type PassportFormValues = Omit<PassportDetails, 'fullName'> & {
  name: string;
  lastName: string;
  surName: string;
};

export const PassportForm: FC<PassportFormProps> = ({ passport, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<PassportFormValues>();
  const information = passport.information;

  const convertedDto = usePassportConverterFromDto(information);

  const country = Form.useWatch('country', form);
  const CountryRelated = countryRelatedFields.get(country);

  const document: UploadFile[] = [];
  passport.document &&
    document.push({
      uid: '-1',
      name: passport.document.originalFileName,
      status: 'done',
      url: passport.document.url,
    });

  useEffect(() => {
    form.setFieldsValue(convertedDto);
    // eslint-disable-next-line
  }, [passport]);

  return (
    <Form form={form} layout={'vertical'} onFinish={onSubmit} initialValues={information} disabled={disabled}>
      <Row gutter={32}>
        <Col xs={8}>
          <Form.Item label={'Имя'} name={'name'} rules={[required, middleText]}>
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Фамилия'} name={'lastName'} rules={[required, middleText]}>
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Отчество'} name={'surName'} rules={[middleText]}>
            <Input type={'text'} />
          </Form.Item>
        </Col>

        <Col xs={8}>
          <Form.Item label={'Гражданство'} name={'country'} rules={[required]}>
            <Select>
              <Select.Option value={'russia'}>Российская Федерация</Select.Option>
              <Select.Option value={'armenia'}>Армения</Select.Option>
              <Select.Option value={'belarus'}>Беларусь</Select.Option>
              <Select.Option value={'kazakhstan'}>Казахстан</Select.Option>
              <Select.Option value={'kyrgyzstan'}>Киргизия</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Пол'} name={'gender'} rules={[required]}>
            <Select>
              <Select.Option value={'male'}>Мужской</Select.Option>
              <Select.Option value={'female'}>Женский</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Место рождения'} name={'placeOfBirth'} rules={[required, middleText]}>
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Дата рождения'} name={'birthday'} rules={[required]}>
            <Input type={'date'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Дата выдачи'} name={'issuedAt'} rules={[required]}>
            <Input type={'date'} />
          </Form.Item>
        </Col>
      </Row>
      {CountryRelated && <CountryRelated />}
      <Form.Item label={'Кем выдан'} name={'issuerName'} rules={[required, middleText]}>
        <Input type={'text'} />
      </Form.Item>
      <Row justify={'space-between'}>
        <Col>
          <Upload fileList={document} disabled={true} />
        </Col>
        <Col>
          <Form.Item noStyle={true}>
            <Button disabled={disabled} type={'primary'} htmlType={'submit'} style={{ marginLeft: 'auto' }}>
              OK
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
