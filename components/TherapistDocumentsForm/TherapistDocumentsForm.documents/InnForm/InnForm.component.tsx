import React, { FC, useEffect } from 'react';
import { Inn, InnInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useDocumentConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import { useRequiredUploadFormItem } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/useRequiredUploadFormItem';

export type InnFormProps = {
  inn?: Inn | null;
  onSubmit?: (values: InnFormValues) => void;
  disabled?: boolean;
  onDelete?: () => void;
};

export type InnFormValues = InnInformation & {
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const InnForm: FC<InnFormProps> = ({ inn, onSubmit, onDelete, disabled = false }) => {
  const [form] = Form.useForm<InnFormValues>();
  const information = inn?.information;

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useDocumentConstraints(uploadData?.constraints);
  const { reset, isUploadFinished, formItemProps, uploadProps } = useRequiredUploadFormItem(
    form,
    'document',
    validateDocument,
  );

  useEffect(() => {
    if (!inn?.information || !inn.document) {
      return;
    }

    form.resetFields();
    reset();
    // eslint-disable-next-line
  }, [inn]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onSubmit}
      initialValues={{
        ...information,
        document: inn?.document ? [getUploadFileFromStaticFile(inn.document)] : [],
      }}
      disabled={disabled}
    >
      <Row gutter={16} align={'top'}>
        <Col xs={8}>
          <Form.Item
            label={'ИНН'}
            rules={[
              {
                required: true,
                type: 'string',
                min: 10,
                max: 12,
                pattern: /^(?:[0-9]{10}|[0-9]{12})$/,
                message: 'Введите корректное значение (000000000000)',
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
