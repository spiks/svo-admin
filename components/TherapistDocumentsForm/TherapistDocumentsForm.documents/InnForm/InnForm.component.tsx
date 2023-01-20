import React, { FC, useEffect } from 'react';
import { Inn, InnInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useUploadPersonalDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useUploadValidationFromConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import { RcFile } from 'antd/lib/upload';

export type InnFormProps = {
  inn?: Inn | null;
  onSubmit?: (values: InnFormValues) => void;
  disabled?: boolean;
};

export type InnFormValues = InnInformation & {
  document: UploadFile<FusSuccessResponse | undefined>[];
};

export const InnForm: FC<InnFormProps> = ({ inn, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<InnFormValues>();
  const information = inn?.information;

  const docFile = Form.useWatch('document', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);

  useEffect(() => {
    if (!inn?.information || !inn.document) {
      return;
    }

    form.setFieldsValue({
      ...inn.information,
      document: [getUploadFileFromStaticFile(inn.document)],
    });
    // eslint-disable-next-line
  }, [inn]);

  return (
    <Form form={form} layout={'vertical'} onFinish={onSubmit} initialValues={information} disabled={disabled}>
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
            <Upload headers={{ 'X-Requested-With': null }} action={uploadData?.url}>
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
