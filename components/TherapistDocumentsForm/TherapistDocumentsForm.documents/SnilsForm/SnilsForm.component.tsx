import React, { FC, useEffect } from 'react';
import { Snils, SnilsInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useUploadPersonalDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useUploadValidationFromConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';

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
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);

  useEffect(() => {
    if (!snils?.information || !snils.document) {
      return;
    }

    form.setFieldsValue({
      ...snils.information,
      document: [getUploadFileFromStaticFile(snils.document)],
    });
    // eslint-disable-next-line
  }, [snils]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onSubmit}
      initialValues={{ ...information, document: [] }}
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
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            valuePropName={'fileList'}
            rules={[
              {
                async validator(_, value: RcFile[]) {
                  if (!value.length) {
                    throw new Error('Загрузка документа обязательна');
                  }
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
            <Upload headers={{ 'X-Requested-With': null }} action={uploadData?.url} onRemove={onDelete}>
              {!docFile?.length && <Button>Загрузить документ</Button>}
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={8} style={{ display: 'flex', justifyContent: 'end', marginTop: '30px' }}>
          <Button type={'primary'} htmlType={'submit'} disabled={disabled}>
            OK
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
