import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { Divider, PageHeader, Result, Steps, Typography } from 'antd';
import { NotFoundLayout } from '@components/NotFoundLayout/NotFoundLayout.component';
import { Step } from 'rc-steps';
import { TherapistProfile } from '../../../generated';
import { getTherapistDocuments } from '../../../api/therapist/getTherapistDocuments';
import { useTherapistSignupQueries } from '../../../hooks/useTherapistSignupQueries';
import { TherapistSignupDocuments } from '@components/TherapistSignupDocuments/TherapistSignupDocuments.component';
import { TherapistSignupInterview } from '@components/TherapistSignupInterview/TherapistSignupInterview.component';
import { TherapistSignupContract } from '@components/TherapistSignupContract/TherapistSignupContract.component';
import { SmileOutlined } from '@ant-design/icons';
import { UserProfileForm } from '@components/UserProfileForm/UserProfileForm.component';
import { UserProfileHeader } from '@components/UserProfileHeader/UserProfileHeader.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { TabList } from '@components/TabList/TabList.component';
import { TherapistDocumentsForm } from '@components/UserProfileDocumentsForm/TherapistDocumentsForm';
import { TherapistContractSection } from '@components/TherapistContractSection/TherapistContractSection.component';
import { UserPresentationForm } from '@components/UserPresentationForm/UserPresentationForm.component';
import { UserBiographyForm } from '@components/UserBiographyForm/UserBiographyForm.component';

// Этапы регистрации терапевта
enum STAGE {
  DOCUMENTS,
  INTERVIEW,
  CONTRACT,
  ACTIVE,
}

export enum USER_TAB_KEY {
  INFORMATION = 'INFORMATION',
  DOCUMENTS = 'DOCUMENTS',
  CONTRACT = 'CONTRACT',
  ACCOUNTS = 'ACCOUNTS',
  PRACTICE = 'PRACTICE',
  PRESENTATION = 'PRESENTATION',
  PRINCIPLES = 'PRINCIPLES',
  ABOUT = 'ABOUT',
}

const tabListItems: { label: string; key: USER_TAB_KEY }[] = [
  { label: 'Сведения', key: USER_TAB_KEY.INFORMATION },
  { label: 'Документы', key: USER_TAB_KEY.DOCUMENTS },
  { label: 'Договор', key: USER_TAB_KEY.CONTRACT },
  { label: 'Личные аккаунты', key: USER_TAB_KEY.ACCOUNTS },
  { label: 'Моя практика и специализации', key: USER_TAB_KEY.PRACTICE },
  { label: 'Презентация', key: USER_TAB_KEY.PRESENTATION },
  { label: 'Принципы работы', key: USER_TAB_KEY.PRINCIPLES },
  { label: 'Важное обо мне', key: USER_TAB_KEY.ABOUT },
];

type TherapistPageContextValue = {
  therapist: TherapistProfile;
  documents: Awaited<ReturnType<typeof getTherapistDocuments>>;
  isLoading: boolean;
};

// Контекст страницы терапевта
export const TherapistPageContext = createContext({} as TherapistPageContextValue);

const TherapistPage: NextPage = () => {
  const { query, replace } = useRouter();

  const therapistId = useMemo(() => {
    return query['id'] as string;
    // eslint-disable-next-line
  }, [query['id']]);

  const activeTab = useMemo<USER_TAB_KEY>(() => {
    const tabKey = String(query['section']);
    const allKeys = tabListItems.map((tab) => {
      return tab.key.toLowerCase();
    });
    return (allKeys.includes(tabKey) ? tabKey.toUpperCase() : USER_TAB_KEY.INFORMATION) as USER_TAB_KEY;
  }, [query]);

  const { isLoading, isError, therapist, documents } = useTherapistSignupQueries(therapistId);

  const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.DOCUMENTS);

  // Stage detection
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

  // Tab change
  const handleTabListChange = useCallback(
    (key) => {
      replace({
        query: {
          ...query,
          section: key.toLowerCase(),
        },
      });
    },
    [replace, query],
  );

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

  const renderTabContents = () => {
    switch (activeTab) {
      case USER_TAB_KEY.INFORMATION:
        return (
          <PageWrapper>
            <UserProfileForm />
          </PageWrapper>
        );
      case USER_TAB_KEY.DOCUMENTS:
        return (
          <PageWrapper>
            <TherapistDocumentsForm />
          </PageWrapper>
        );

      case USER_TAB_KEY.CONTRACT:
        return (
          <PageWrapper>
            <TherapistContractSection />
          </PageWrapper>
        );

      case USER_TAB_KEY.PRESENTATION:
        return (
          <PageWrapper>
            <UserPresentationForm />
          </PageWrapper>
        );

      case USER_TAB_KEY.ABOUT:
        return (
          <PageWrapper>
            <UserBiographyForm />
          </PageWrapper>
        );
      default:
        return (
          <PageWrapper>
            <Typography.Text type={'danger'}>Данный раздел ещё не готов.</Typography.Text>
          </PageWrapper>
        );
    }
  };

  return (
    <TherapistPageContext.Provider value={contextValue}>
      <MainLayout>
        <UserProfileHeader>
          <TabList items={tabListItems} defaultActiveKey={USER_TAB_KEY.INFORMATION} onChange={handleTabListChange} />
        </UserProfileHeader>
        <div style={{ overflow: 'auto' }}>
          <PageWrapper>
            <div
              style={{
                padding: '40px 80px',
                background: '#FFFFFF',
              }}
            >
              <PageHeader title={`Регистрация психолога`} subTitle={therapistId} style={{ padding: 0 }} />
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
          </PageWrapper>
          {renderTabContents()}
        </div>
      </MainLayout>
    </TherapistPageContext.Provider>
  );
};

export default TherapistPage;
