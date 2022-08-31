import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createContext, useMemo, useState } from 'react';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { Divider, PageHeader, Steps } from 'antd';
import { NotFoundLayout } from '../../../components/NotFoundLayout/NotFoundLayout.component';
import { Step } from 'rc-steps';
import { TherapistProfile } from '../../../generated';
import { getTherapistDocuments } from '../../../api/therapist/getTherapistDocuments';
import { useTherapistSignupQueries } from '../../../hooks/useTherapistSignupQueries';
import { TherapistSignupDocuments } from '../../../components/TherapistSignupDocuments/TherapistSignupDocuments.component';

// Этапы регистрации терапевта
enum STAGE {
  DOCUMENTS,
  INTERVIEW,
  CONTRACT,
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

  const [currentStage] = useState<STAGE>(STAGE.DOCUMENTS);

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
          {(() => {
            switch (currentStage) {
              case STAGE.CONTRACT:
                return null;
              case STAGE.DOCUMENTS:
                return <TherapistSignupDocuments />;
              case STAGE.INTERVIEW:
                return null;
            }
          })()}
        </div>
      </MainLayout>
    </TherapistPageContext.Provider>
  );
};

export default TherapistPage;
