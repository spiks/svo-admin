import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Document } from '../Document/Document.component';
import { getDocumentStyle } from '../Document/Document.utils';
import { documentName } from './TherapistSignupDocuments.utils';
import {
  DiplomaServiceWithToken,
  InnServiceWithToken,
  PassportServiceWithToken,
  SnilsServiceWithToken,
} from '../../api/services';
import { DiplomaOfHigherEducation } from '../../generated';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';
import { finishTherapistDocumentModeration } from '../../api/therapist/finishTherapistDocumentModeration';

export const TherapistSignupDocuments: FC = () => {
  const { documents, therapist, isLoading } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const docs = useMemo(() => {
    return Object.entries(documents).map(([key, value]) => {
      const onApprove = async () => {
        switch (key) {
          case 'passport':
            await PassportServiceWithToken.acceptTherapistPassport({
              requestBody: {
                arguments: {
                  therapistId: therapist.id,
                },
              },
            });
            break;
          case 'inn':
            await InnServiceWithToken.acceptTherapistInn({
              requestBody: {
                arguments: {
                  therapistId: therapist.id,
                },
              },
            });
            break;
          case 'diploma':
            await DiplomaServiceWithToken.acceptTherapistDiplomaOfHigherEducation({
              requestBody: {
                arguments: {
                  diplomaId: (value as DiplomaOfHigherEducation).id,
                },
              },
            });
            break;
          case 'snils':
            await SnilsServiceWithToken.acceptTherapistSnils({
              requestBody: {
                arguments: {
                  therapistId: therapist.id,
                },
              },
            });
            break;
        }
        await refetch('documents');
      };

      const onReject = async () => {
        switch (key) {
          case 'passport':
            await PassportServiceWithToken.rejectTherapistPassport({
              requestBody: { arguments: { therapistId: therapist.id } },
            });
            break;
          case 'inn':
            await InnServiceWithToken.rejectTherapistInn({
              requestBody: { arguments: { therapistId: therapist.id } },
            });
            break;
          case 'diploma':
            await DiplomaServiceWithToken.rejectTherapistDiplomaOfHigherEducation({
              requestBody: {
                arguments: {
                  diplomaId: (value as DiplomaOfHigherEducation).id,
                },
              },
            });
            break;
          case 'snils':
            await SnilsServiceWithToken.rejectTherapistSnils({
              requestBody: {
                arguments: {
                  therapistId: therapist.id,
                },
              },
            });
            break;
        }
        await refetch('documents');
      };

      return (
        <Document
          key={key}
          style={getDocumentStyle(value?.isApprovedByModerator, therapist.status)}
          onApproved={onApprove}
          onReject={onReject}
          document={{
            name: documentName[key] as string,
            link: value?.document.url,
          }}
        />
      );
    });
  }, [documents, refetch, therapist.id, therapist.status]);

  // Индикация обновления данных (не инициализация)
  const [isUpdating, setIsUpdating] = useState(false);

  // Индикация возможности завершения модерации документов
  const canEndModeration = useMemo(() => {
    return Object.values(documents).every((doc) => {
      return doc?.isApprovedByModerator !== null;
    });
  }, [documents]);

  // Индикация возможности перехода к следующему этапу регистрации терапевта
  const canContinue = useMemo(() => {
    const allowedStatuses = ['interview_processing', 'interview_failed'];
    return allowedStatuses.includes(therapist.status);
  }, [therapist.status]);

  const forwardToInterview = useCallback(async () => {
    await refetch('therapist');
  }, [refetch]);

  const finishModeration = useCallback(async () => {
    await finishTherapistDocumentModeration(therapist.id);
    setIsUpdating(true);
    await refetch('therapist');
    await refetch('documents');
    setIsUpdating(false);
  }, [refetch, therapist.id]);

  return (
    <Spin spinning={isLoading || isUpdating}>
      <Form>
        <Form.Item label={'Необходимые документы'}>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}>{docs}</div>
        </Form.Item>
        <Row justify={'center'} gutter={8}>
          <Col>
            <Button
              type={'primary'}
              htmlType={'button'}
              onClick={finishModeration}
              disabled={!canEndModeration || canContinue}
              loading={isUpdating}
            >
              Завершить модерацию
            </Button>
          </Col>
          <Col>
            <Button type={'primary'} htmlType={'button'} onClick={forwardToInterview} disabled={!canContinue}>
              Перейти к интервью
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};
