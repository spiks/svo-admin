import React, { FC, useEffect } from 'react';
import { Snils, SnilsInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';
import { useDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useDocumentConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useRequiredUploadFormItem } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/useRequiredUploadFormItem';

export type SnilsFormProps = {
  snils?: Snils | null;
  onSubmit?: (values: SnilsFormValues) => void;
  disabled?: boolean;
  onDelete?: () => void;
};

export type SnilsFormValues = SnilsInformation & {
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const SnilsForm: FC<SnilsFormProps> = ({ snils, onSubmit, onDelete, disabled = false }) => {
  const [form] = Form.useForm<SnilsFormValues>();
  const information = snils?.information;

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useDocumentConstraints(uploadData?.constraints);
  const { reset, isUploadFinished, formItemProps, uploadProps } = useRequiredUploadFormItem(
    form,
    'document',
    validateDocument,
  );

  useEffect(() => {
    if (!snils?.information || !snils.document) {
      return;
    }

    form.resetFields();
    reset();
    // eslint-disable-next-line
  }, [snils]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onSubmit}
      initialValues={{ ...information, document: snils?.document ? [getUploadFileFromStaticFile(snils.document)] : [] }}
      disabled={disabled}
    >
      <Row gutter={16} align={'top'}>
        <Col xs={8}>
          <Form.Item
            label={'СНИЛС'}
            rules={[
              {
                required: true,
                type: 'string',
                len: 14,
                pattern: /^[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}$/,
                message: 'Введите корректное значение (000-000-000 00)',
              },
            ]}
            name={'number'}
          >
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item
            name={'document'}
            label={' '}
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
        <Col xs={8} style={{ display: 'flex', justifyContent: 'end', marginTop: '30px' }}>
          <Button
            type={'primary'}
            htmlType={'submit'}
            disabled={disabled || isUploadFinished === false}
            loading={isUploadFinished === false}
          >
            OK
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
