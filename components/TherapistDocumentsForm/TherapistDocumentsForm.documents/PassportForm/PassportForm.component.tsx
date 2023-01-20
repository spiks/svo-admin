import React, { ComponentType, FC, useEffect } from 'react';
import { Passport } from '../../../../generated';
import { Button, Col, DatePicker, Form, Input, Row, Select, Upload, UploadFile } from 'antd';
import { RussianPassportFields } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/RussianPassportFields.component';
import { ArmenianPassportFields } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/ArmenianPassportFields.component';
import { BelarusianPassportDetails } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/BelarusianPassportFields.component';
import { KazakhstanPassportFields } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/KazakhstanPassportFields.component';
import { KyrgyzstanPassportFields } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/KyrgyzstanPassportFields.component';
import { middleText } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/middleText.rule';
import { required } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { usePassportConverterFromDto } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/usePassportConverterFromDto';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useUploadPersonalDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useUploadValidationFromConstraints';
import { RcFile } from 'antd/lib/upload';
import { Moment } from 'moment';

const countryRelatedFields = new Map<Passport['information']['country'], ComponentType>();
countryRelatedFields.set('russia', RussianPassportFields);
countryRelatedFields.set('armenia', ArmenianPassportFields);
countryRelatedFields.set('belarus', BelarusianPassportDetails);
countryRelatedFields.set('kazakhstan', KazakhstanPassportFields);
countryRelatedFields.set('kyrgyzstan', KyrgyzstanPassportFields);

export type PassportFormProps = {
  passport?: Passport | null;
  onSubmit?: (values: PassportFormValues) => void;
  disabled?: boolean;
};

export type PassportDetails = Passport['information'];

export type PassportFormValues = Omit<PassportDetails, 'fullName' | 'birthday' | 'issuedAt'> & {
  name: string;
  lastName: string;
  surName: string;
  birthday: Moment;
  issuedAt: Moment;
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const PassportForm: FC<PassportFormProps> = ({ passport, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<PassportFormValues>();
  const information = passport?.information;

  const convertedDto = usePassportConverterFromDto(information, passport?.document);

  const country = Form.useWatch('country', form);
  const CountryRelated = countryRelatedFields.get(country);

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);

  useEffect(() => {
    form.setFieldsValue(convertedDto);
    // eslint-disable-next-line
  }, [passport]);

  return (
    <Form form={form} layout={'vertical'} onFinish={onSubmit} initialValues={{ ...convertedDto }} disabled={disabled}>
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
            <DatePicker format={'YYYY-MM-DD'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Дата выдачи'} name={'issuedAt'} rules={[required]}>
            <DatePicker format={'YYYY-MM-DD'} />
          </Form.Item>
        </Col>
      </Row>
      {CountryRelated && <CountryRelated />}
      <Form.Item label={'Кем выдан'} name={'issuerName'} rules={[required, middleText]}>
        <Input type={'text'} />
      </Form.Item>
      <Row justify={'space-between'}>
        <Col>
          <Form.Item
            name={'document'}
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            valuePropName={'fileList'}
            rules={[
              {
                required: true,
                message: 'Загрузка документа обязательна',
              },
              {
                async validator(_, value: RcFile[]) {
                  value.forEach((file) => {
                    const message = validateDocument(file);
                    if (typeof message !== 'boolean') {
                      throw new Error(message);
                    }
                  });
                },
              },
            ]}
          >
            {/* @ts-ignore */}
            <Upload headers={{ 'X-Requested-With': null }} action={uploadData?.url}>
              {!docFile?.length && <Button>Загрузить документ</Button>}
            </Upload>
          </Form.Item>
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
