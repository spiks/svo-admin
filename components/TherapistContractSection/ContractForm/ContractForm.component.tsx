import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useUploadPersonalDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useUploadValidationFromConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import { Button, Form, Row, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { StaticFile } from 'generated';
import { FC, useEffect } from 'react';

export type ContractFormValues = {
  contract: UploadFile<FusSuccessResponse | undefined>[];
};

export type ContractFormProps = {
  contract: StaticFile | null;
  onSubmit: (values: ContractFormValues) => void;
};

export const ContractForm: FC<ContractFormProps> = ({ contract, onSubmit }) => {
  const [form] = Form.useForm<ContractFormValues>();
  const { uploadData } = useFileUpload('personal_document');
  const docFile = Form.useWatch('contract', form);
  const validateDocument = useUploadPersonalDocumentConstraints(uploadData?.constraints);

  useEffect(() => {
    if (!contract) {
      return;
    }
    form.setFieldsValue({
      contract: [getUploadFileFromStaticFile(contract)],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return (
    <Form onFinish={onSubmit} form={form} layout="vertical">
      <Row>
        <Form.Item
          label={'Договор на отправку'}
          name={'contract'}
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
      </Row>
      <Row align={'middle'} justify={'end'}>
        <Form.Item>
          <Button type={'primary'} htmlType={'submit'} style={{ marginLeft: 'auto' }}>
            Отправить договор
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
