import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { Divider, PageHeader, Result, Steps } from 'antd';
import { NotFoundLayout } from '../../../components/NotFoundLayout/NotFoundLayout.component';
import { Step } from 'rc-steps';
import { TherapistProfile } from '../../../generated';
import { getTherapistDocuments } from '../../../api/therapist/getTherapistDocuments';
import { useTherapistSignupQueries } from '../../../hooks/useTherapistSignupQueries';
import { TherapistSignupDocuments } from '../../../components/TherapistSignupDocuments/TherapistSignupDocuments.component';
import { TherapistSignupInterview } from '../../../components/TherapistSignupInterview/TherapistSignupInterview.component';
import { TherapistSignupContract } from '../../../components/TherapistSignupContract/TherapistSignupContract.component';
import { SmileOutlined } from '@ant-design/icons';

// Этапы регистрации терапевта
enum STAGE {
  DOCUMENTS,
  INTERVIEW,
  CONTRACT,
  ACTIVE,
}

type TherapistPageContextValue = {
  therapist: TherapistProfile;
  documents: Awaited<ReturnType<typeof getTherapistDocuments>>;
  isLoading: boolean;
};

// Контекст страницы терапевта
export const TherapistPageContext = createContext({} as TherapistPageContextValue);

const TherapistPage: NextPage = () => {
  const { query, back } = useRouter();
  const therapistId = useMemo(() => {
    return query['id'] as string;
    // eslint-disable-next-line
  }, [query['id']]);

  const { isLoading, isError, therapist, documents } = useTherapistSignupQueries(therapistId);

  const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.DOCUMENTS);
  useEffect(() => {
    if (isLoading || !therapist) {
      return;
    }

    const status = therapist.status;
    switch (status) {
      case 'documents_rejected':
      case 'documents_awaiting_review':
      case 'documents_not_submitted_yet':
        setCurrentStage(STAGE.DOCUMENTS);
        break;
      case 'interview_processing':
      case 'interview_failed':
        setCurrentStage(STAGE.INTERVIEW);
        break;
      case 'contract_rejected':
      case 'contract_awaiting_review':
      case 'contract_not_submitted_yet':
        setCurrentStage(STAGE.CONTRACT);
        break;
      case 'active':
        setCurrentStage(STAGE.ACTIVE);
    }
  }, [isLoading, therapist]);

  const contextValue = useMemo(() => {
    return {
      therapist: therapist!,
      documents: documents!,
      isLoading,
    };
  }, [documents, isLoading, therapist]);

  // Failed to get therapist
  if (isError) {
    return <NotFoundLayout message={'Запрашиваемый аккаунт не найден'} />;
  }

  // Query not completed yet
  if (isLoading) {
    return <MainLayout loading={true} />;
  }

  return (
    <TherapistPageContext.Provider value={contextValue}>
      <MainLayout>
        <div
          style={{
            margin: '40px',
            padding: '40px 80px',
            background: '#FFFFFF',
          }}
        >
          <PageHeader title={`Регистрация психолога`} onBack={back} subTitle={therapistId} style={{ padding: 0 }} />
          <div style={{ marginTop: '40px' }}>
            <Steps current={currentStage} labelPlacement={'vertical'}>
              <Step title={'Предоставление документов'} />
              <Step title={'Обработка интервью'} />
              <Step title={'Заключение договора'} />
            </Steps>
          </div>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {(() => {
              switch (currentStage) {
                case STAGE.CONTRACT:
                  return <TherapistSignupContract />;
                case STAGE.DOCUMENTS:
                  return <TherapistSignupDocuments />;
                case STAGE.INTERVIEW:
                  return <TherapistSignupInterview />;
                case STAGE.ACTIVE:
                  return (
                    <Result
                      icon={<SmileOutlined />}
                      title="Терапевт имеет уже подтверждённый и активированный аккаунт!"
                    />
                  );
              }
            })()}
          </div>
        </div>
      </MainLayout>
    </TherapistPageContext.Provider>
  );
};

export default TherapistPage;
