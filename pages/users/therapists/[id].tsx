import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getTherapistById } from '../../../api/therapist/getTherapistById';
import { createContext, useMemo, useState } from 'react';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { Divider, PageHeader, Steps } from 'antd';
import { NotFoundLayout } from '../../../components/NotFoundLayout/NotFoundLayout.component';
import { Step } from 'rc-steps';
import { TherapistProfile } from '../../../generated';
import { getTherapistDocuments } from '../../../api/therapist/getTherapistDocuments';

// Этапы регистрации терапевта
enum STAGE {
  DOCUMENTS,
  INTERVIEW,
  CONTRACT,
}

type TherapistPageContextValue = {
  therapist: TherapistProfile;
  documents: ReturnType<typeof getTherapistDocuments>;
};

// Контекст страницы терапевта
export const TherapistPageContext = createContext({} as TherapistPageContextValue);

const TherapistPage: NextPage = () => {
  const { query, back } = useRouter();
  const therapistId = useMemo(() => {
    return query['id'] as string;
    // eslint-disable-next-line
  }, [query['id']]);

  const {
    data: therapistResponse,
    isError,
    isLoading,
  } = useQuery(['therapist', therapistId], getTherapistById.bind(null, therapistId));
  const therapist = useMemo(() => {
    return therapistResponse?.data;
  }, [therapistResponse])!;

  const {
    data: documentsResponse,
  } = useQuery(["therapist", "documents", therapistId], getTherapistDocuments.bind(null, therapistId), {enabled: })


  const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.DOCUMENTS);

  // Failed to get therapist
  if (isError) {
    return <NotFoundLayout message={'Запрашиваемый аккаунт не найден'} />;
  }

  // Query not completed yet
  if (isLoading) {
    return <MainLayout loading={true} />;
  }

  const contextValue = useMemo(() => {
    return {
      therapist,
      documents
    }
  })

  return (
    <TherapistPageContext.Provider>
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
        </div>
      </MainLayout>
    </TherapistPageContext.Provider>
  );
};

export default TherapistPage;
