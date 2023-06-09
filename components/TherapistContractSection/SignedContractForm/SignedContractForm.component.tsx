import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useDocumentConstraints';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import { Button, Col, Form, Row, Select, Typography, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { StaticFile } from 'generated';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect, useMemo } from 'react';

export type SignedContractFormValues = {
  signedContract: UploadFile<FusSuccessResponse | undefined>[];
};

export type SignedContractFormProps = {
  signedContract: StaticFile | null;
  onSubmit: (values: SignedContractFormValues) => void;
  onReject: () => void;
  onAccept: () => void;
};

export const SignedContractForm: FC<SignedContractFormProps> = ({ signedContract, onSubmit, onAccept, onReject }) => {
  const { therapist } = useContext(TherapistPageContext);
  const [form] = Form.useForm<SignedContractFormValues>();
  const docFile = Form.useWatch('signedContract', form);
  const { uploadData } = useFileUpload('personal_document');
  const validateDocument = useDocumentConstraints(uploadData?.constraints);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);
  const refetchStatuses = therapist.status === 'contract_rejected' || therapist.status === 'contract_not_submitted_yet';

  const getContractStatus = () => {
    if (therapist.status === 'active') {
      return 'approved';
    } else if (therapist.status === 'contract_awaiting_review') {
      return 'pending';
    } else if (therapist.status === 'contract_rejected') {
      return 'rejected';
    }
    return 'not_arrived';
  };

  const canModerateContract = useMemo(() => {
    return therapist.status === 'contract_awaiting_review';
  }, [therapist.status]);

  // Индикация возможности загрузить подписанный терапевтом договор администратором
  const canUploadSignedContract = useMemo(() => {
    const allowedStatuses = ['active', 'documents_awaiting_review', 'created_by_admin'];
    return allowedStatuses.includes(therapist.status);
  }, [therapist.status]);

  useEffect(() => {
    if (!signedContract) {
      return;
    }
    form.setFieldsValue({
      signedContract: [getUploadFileFromStaticFile(signedContract)],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedContract]);

  useEffect(() => {
    if (signedContract && refetchStatuses) {
      refetch('therapist');
    }
  }, [refetch, signedContract, refetchStatuses]);

  const handleChange = async (value: string) => {
    switch (value) {
      case 'approved':
        onAccept();
        await refetch('therapist');
        break;
      case 'rejected':
        onReject();
        await refetch('therapist');
        break;
    }
  };

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Form.Item
            label={'Подписанный договор'}
            name={'signedContract'}
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
                  value?.forEach((file) => {
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
            <Upload disabled={!canUploadSignedContract} headers={{ 'X-Requested-With': null }} action={uploadData?.url}>
              {!docFile?.length && <Button disabled={!canUploadSignedContract}>Загрузить документ</Button>}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={'Статус договора'}>
            <Select
              value={getContractStatus()}
              disabled={!canModerateContract}
              onChange={handleChange}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Select.Option value={'approved'}>{'Подтверждён'}</Select.Option>
              <Select.Option value={'rejected'}>{'Отклонен'}</Select.Option>
              <Select.Option value={'pending'} disabled={true}>
                {'Ожидает проверки'}
              </Select.Option>
              <Select.Option value={'not_arrived'} disabled={true}>
                {'Не получен'}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {therapist.status !== 'contract_awaiting_review' && (
        <Row align={'middle'} justify={'end'}>
          <Form.Item>
            <Button disabled={!canUploadSignedContract} type={'primary'} htmlType={'submit'}>
              {'Сохранить'}
            </Button>
          </Form.Item>
        </Row>
      )}
    </Form>
  );
};
