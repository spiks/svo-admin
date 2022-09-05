import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { Button, Checkbox, Form, notification, Space, Spin, Typography } from 'antd';
import { UploadDocument } from '../UploadDocument/UploadDocument.component';
import { requestFileUploadUrl } from '../../api/upload/requestFileUploadUrl';
import { uploadFile } from '../../api/upload/uploadFile';
import { submitContract } from '../../api/therapist/submitContract';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';
import { Document, DocumentProps } from '../Document/Document.component';
import { getSignedContractStyle } from './TherapistSignupContract.utils';
import { acceptContract } from '../../api/therapist/acceptContract';
import { rejectContract } from '../../api/therapist/rejectContract';
import { useContractsQuery } from '../../hooks/useContractsQuery';

export const TherapistSignupContract: FC = () => {
  const { therapist, isLoading: contextLoading } = useContext(TherapistPageContext);
  const { contract, signedContract, isLoading: contractsLoading } = useContractsQuery(therapist.id);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const isLoading = useMemo(() => {
    return contextLoading || contractsLoading;
  }, [contextLoading, contractsLoading]);

  const [contractToken, setContractToken] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const toggleAcceptance = useCallback(() => {
    setAccepted(!accepted);
  }, [accepted]);

  // Получение идентификатора контракта для submit'а
  const handleContractUpload = useCallback(async (file: File) => {
    const { data: credentials } = await requestFileUploadUrl('personal_document');

    try {
      const { data: uploaded } = await uploadFile(credentials, file);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Контракт загружен успешно!',
      });
      setContractToken(uploaded.token);
    } catch (err) {
      if (err instanceof Error) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: err.message,
        });
        return;
      } else {
        throw err;
      }
    }
  }, []);

  // Отправка контракта пользователю
  const handleContractSubmit = useCallback(async () => {
    if (!contractToken) {
      return;
    }

    try {
      await submitContract(therapist.id, contractToken);
      setContractToken(null);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Контракт отправлен терапевту!',
      });
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось отправить контракт пользователю',
      });
    } finally {
      // Обновляем данные (возможно изменение статуса пользователя)
      await refetch('therapist');
    }
  }, [contractToken, refetch, therapist.id]);

  // Стиль отображаемого блока с файлом договора
  const contractStyle = useMemo(() => {
    if (contract) {
      return 'approved';
    } else {
      return 'empty';
    }
  }, [contract]);

  // Индикация возможности отправки контракта пользователю
  const canSubmitContract = useMemo(() => {
    return Boolean(contractToken);
  }, [contractToken]);

  const canApprove = useCallback(() => {
    if (!accepted) {
      notification.warning({
        type: 'warning',
        message: 'Предупреждение',
        description:
          'Для изменения статуса контракта пользователя, необходимо подтвердить соответствие договора соответствует нормативно-правовым актам',
      });
      return false;
    }
    return true;
  }, [accepted]);

  // Стиль отображаемого блока с загруженным файлом подписанного пользователем контракта
  const signedDocumentProps = useMemo<DocumentProps>(() => {
    return {
      document: {
        name: 'Контракт',
        ...(signedContract && { link: signedContract.url }),
      },
      style: getSignedContractStyle(therapist.status),
      // Подтверждение контракта подписанного пользователем
      async onApproved() {
        if (!canApprove()) {
          return;
        }

        try {
          await acceptContract(therapist.id);
        } catch (err) {
          notification.error({
            type: 'error',
            message: 'Ошибка',
            description: 'Не удалось подтвердить правильность контракта загруженного пользователем',
          });
        } finally {
          await refetch('therapist');
        }
      },
      // Отклонение контракта подписанного пользователем
      async onReject() {
        try {
          await rejectContract(therapist.id);
          notification.success({
            type: 'success',
            message: 'Успех',
            description: 'Контракт отправленный пользователем отклонён!',
          });
        } catch (err) {
          notification.error({
            type: 'error',
            message: 'Ошибка',
            description: 'Не удалось отклонить контракт загруженный пользователем',
          });
        } finally {
          await refetch('therapist');
        }
      },
    };
  }, [canApprove, refetch, signedContract, therapist.id, therapist.status]);

  return (
    <Spin spinning={isLoading}>
      <Form layout={'horizontal'} labelCol={{ span: 6 }} wrapperCol={{ span: 20 }}>
        <Form.Item label={'Договор на отправку'}>
          <Space size={24} direction={'vertical'}>
            <UploadDocument style={contractStyle} onUpload={handleContractUpload} document={{ name: 'Договор' }} />
            <Button type={'primary'} htmlType={'button'} onClick={handleContractSubmit} disabled={!canSubmitContract}>
              Отправить договор
            </Button>
          </Space>
        </Form.Item>
        <Form.Item label={'Подписанный клиентом'}>
          <Document {...signedDocumentProps} />
        </Form.Item>
        <Form.Item label={'Информация'}>
          <Space size={24} direction={'vertical'}>
            <Typography.Text>
              Вся указанная психологом информация верна и соответствует нормативно-правовым актам, этическим нормам и не
              нарушает законодательства Российской Федерации
            </Typography.Text>
            <Checkbox checked={accepted} onChange={toggleAcceptance}>
              Я подтверждаю!
            </Checkbox>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
};
