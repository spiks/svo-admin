import React, { FC, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Upload, UploadFile } from 'antd';
import moment from 'moment';
import { LocalDiploma } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useUploadPersonalDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useUploadValidationFromConstraints';
import { useRequiredUploadFormItem } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/useRequiredUploadFormItem';

export type DiplomaFormProps = {
  diploma?: LocalDiploma;
  onSubmit?: (values: DiplomaFormValues) => void;
  disabled?: boolean;
};

export type DiplomaFormValues = LocalDiploma['information'] & {
  id: string;
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const DiplomaForm: FC<DiplomaFormProps & { onDelete?: (values: { id: string }) => void }> = ({
  diploma,
  onSubmit,
  disabled = false,
  onDelete,
}) => {
  const [form] = Form.useForm<DiplomaFormValues>();

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);
  const { reset, isUploadFinished, formItemProps, uploadProps } = useRequiredUploadFormItem(
    form,
    'document',
    validateDocument,
  );

  useEffect(() => {
    if (!diploma?.information || !diploma.document) {
      return;
    }

    form.resetFields();
    reset();
    // eslint-disable-next-line
  }, [diploma]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={(values) => {
        onSubmit &&
          onSubmit({
            ...values,
            id: diploma!.id,
            country: 'russia',
          });
      }}
      initialValues={{
        id: diploma?.id,
        country: 'russia',
        ...diploma?.information,
        document: diploma?.document,
      }}
      disabled={disabled}
    >
      <Row>
        <Col xs={24}>
          <Form.Item
            name={'educationalInstitution'}
            label={'Наименование высшего учебного заведения'}
            rules={[
              {
                required: true,
                type: 'string',
                max: 400,
                message: 'Обязательно для заполнении (до 400 символов)',
              },
            ]}
          >
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name={'speciality'}
            label={'Специальность'}
            rules={[
              {
                required: true,
                type: 'string',
                max: 255,
                message: 'Обязательно для заполнения (до 255 символов)',
              },
            ]}
          >
            <Input type={'text'} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={12}>
          <Form.Item
            name={'serialAndNumber'}
            label={'Серия / Номер'}
            rules={[
              {
                required: true,
                type: 'string',
                max: 255,
                message: 'Обязательно для заполнения (до 255 символов)',
              },
            ]}
          >
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item label={'Год выпуска'} name={'graduationYear'}>
            <DatePicker
              picker={'year'}
              disabledDate={(date) => {
                const min = moment().day(1).month(0).year(1900);
                return date.isBefore(min);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            name={'document'}
            label={'Документ'}
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
              onRemove={() => {
                onDelete && onDelete({ id: form.getFieldValue('id') });
                reset();
              }}
              action={uploadData?.url}
            >
              {!docFile?.length && <Button>Загрузить документ</Button>}
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={12} style={{ display: 'flex', justifyContent: 'end', marginTop: '30px' }}>
          <Button
            type={'primary'}
            loading={isUploadFinished === false}
            disabled={disabled || isUploadFinished === false}
            htmlType={'submit'}
          >
            OK
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
