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
import { Moment } from 'moment';
import { useRequiredUploadFormItem } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/useRequiredUploadFormItem';

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
  onDelete?: () => void;
};

export type PassportDetails = Passport['information'];

export type PassportFormValues = Omit<PassportDetails, 'birthday' | 'issuedAt'> & {
  birthday: Moment;
  issuedAt: Moment;
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const PassportForm: FC<PassportFormProps> = ({ passport, onSubmit, onDelete, disabled = false }) => {
  const [form] = Form.useForm<PassportFormValues>();
  const information = passport?.information;

  const convertedDto = usePassportConverterFromDto(information, passport?.document);

  const country = Form.useWatch('country', form);
  const CountryRelated = countryRelatedFields.get(country);

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);
  const { reset, isUploadFinished, formItemProps, uploadProps } = useRequiredUploadFormItem(
    form,
    'document',
    validateDocument,
  );

  useEffect(() => {
    if (!passport?.information || !passport.document) {
      return;
    }

    form.resetFields();
    reset();
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
          <Form.Item label={'Фамилия'} name={'surname'} rules={[required, middleText]}>
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Отчество'} name={'patronymic'} rules={[middleText]}>
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
          <Form.Item label={'Дата рождения'} name={'birthday'} rules={[required]}>
            <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item label={'Дата выдачи'} name={'issuedAt'} rules={[required]}>
            <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
          </Form.Item>
        </Col>
      </Row>
      {CountryRelated && <CountryRelated />}
      <Form.Item label={'Кем выдан'} name={'issuerName'} rules={[required, middleText]}>
        <Input type={'text'} />
      </Form.Item>
      {/* TODO: Для исключений из общей формы пасспорта можно добавить HOC, который принимал бы в себя список стран-исключений и скрывал Input при наличии в этом списке значения соответствующего country, на мой взгляд слишком императивно */}
      {country !== 'kazakhstan' && (
        <Form.Item
          label={'Адрес регистрации'}
          name={'residence'}
          rules={[
            {
              required: true,
              type: 'string',
              max: 400,
              message: 'Обязательно для заполнения (до 400 символов)',
            },
          ]}
        >
          <Input type={'text'} />
        </Form.Item>
      )}
      <Row justify={'space-between'}>
        <Col xs={12}>
          <Form.Item
            name={'document'}
            getValueFromEvent={formItemProps.getValueFromEvent}
            valuePropName={formItemProps.valuePropName}
            rules={[
              {
                required: true,
                message: 'Загрузка документа обязательна',
              },
              ...formItemProps.rules,
            ]}
          >
            <Upload
              {...uploadProps}
              action={uploadData?.url}
              onRemove={() => {
                reset();
                onDelete && onDelete();
              }}
            >
              {!docFile?.length && <Button>Загрузить документ</Button>}
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={12} style={{ textAlign: 'right' }}>
          <Form.Item noStyle={true}>
            <Button
              disabled={disabled || isUploadFinished === false}
              loading={isUploadFinished === false}
              type={'primary'}
              htmlType={'submit'}
              style={{ marginLeft: 'auto' }}
            >
              OK
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
