import { FC, useCallback, useContext, useMemo } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Document } from '../Document/Document.component';
import { getDocumentStyle } from '../Document/Document.utils';
import { documentName } from './TherapistSignupDocuments.utils';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

export const TherapistSignupDocuments: FC = () => {
  const { documents, therapist, isLoading } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const diploma = useMemo(() => {
    return documents.diploma.map((it) => {
      return (
        <Document
          key={it.id}
          style={getDocumentStyle(it?.isApprovedByModerator, therapist.status)}
          href={'#'}
          name={'Диплом'}
        />
      );
    });
  }, [documents.diploma, therapist.status]);

  // Индикация возможности перехода к следующему этапу регистрации терапевта
  const canContinue = useMemo(() => {
    const allowedStatuses = ['interview_processing', 'interview_failed'];
    return allowedStatuses.includes(therapist.status);
  }, [therapist.status]);

  const forwardToInterview = useCallback(async () => {
    await refetch('therapist');
  }, [refetch]);

  return (
    <Spin spinning={isLoading}>
      <Form>
        <Form.Item label={'Необходимые документы'}>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px', minWidth: '470px' }}>
            <Document
              style={getDocumentStyle(documents.passport?.isApprovedByModerator, therapist.status)}
              href={'#'}
              name={documentName.passport}
            />
            <Document
              style={getDocumentStyle(documents.inn?.isApprovedByModerator, therapist.status)}
              href={'#'}
              name={documentName.inn}
            />
            <Document
              style={getDocumentStyle(documents.snils?.isApprovedByModerator, therapist.status)}
              href={'#'}
              name={documentName.snils}
            />
            {diploma}
          </div>
        </Form.Item>
        <Row>
          <Col span={7} />
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
