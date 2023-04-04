import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { Divider, PageHeader, Result, Spin, Steps, Typography } from 'antd';
import { NotFoundLayout } from '@components/NotFoundLayout/NotFoundLayout.component';
import { Step } from 'rc-steps';
import { TherapistProfile } from '../../../generated';
import { getTherapistDocuments } from '../../../api/therapist/getTherapistDocuments';
import { useTherapistSignupQueries } from '../../../hooks/useTherapistSignupQueries';
import { TherapistSignupDocuments } from '@components/TherapistSignupDocuments/TherapistSignupDocuments.component';
import { TherapistSignupInterview } from '@components/TherapistSignupInterview/TherapistSignupInterview.component';
import { UserProfileForm } from '@components/UserProfileForm/UserProfileForm.component';
import { UserProfileHeader } from '@components/UserProfileHeader/UserProfileHeader.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { TabList } from '@components/TabList/TabList.component';
import { TherapistDocumentsForm } from '@components/TherapistDocumentsForm/TherapistDocumentsForm';
import { TherapistContractSection } from '@components/TherapistContractSection/TherapistContractSection.component';
import { UserPresentationForm } from '@components/UserPresentationForm/UserPresentationForm.component';
import { UserBiographyForm } from '@components/UserBiographyForm/UserBiographyForm.component';
import { UserWorkPrinciplesForm } from '@components/UserWorkPrinciplesForm/UserWorkPrinciplesForm.component';
import { TherapistPracticeSection } from '@components/TherapistPracticeSection/TherapistPracticeSection.component';
import { TherapistSocialsLinksFrom } from '@components/TherapistSocialLinksForm/TherapistSocialLinksForm.component';
import { TherapistSettingsForm } from '@components/TherapistSettingsForm/TherapistSettingsForm.component';
import { SmileOutlined } from '@ant-design/icons';

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
  SETTINGS = 'SETTINGS',
}

const tabListItems: { label: string; key: USER_TAB_KEY }[] = [
  { label: 'Сведения', key: USER_TAB_KEY.INFORMATION },
  { label: 'Документы', key: USER_TAB_KEY.DOCUMENTS },
  { label: 'Договор', key: USER_TAB_KEY.CONTRACT },
  { label: 'Личные аккаунты', key: USER_TAB_KEY.ACCOUNTS },
  { label: 'Моя практика и специализации', key: USER_TAB_KEY.PRACTICE },
  { label: 'Видеовизитка', key: USER_TAB_KEY.PRESENTATION },
  { label: `Профессиональные ценности и принципы работы`, key: USER_TAB_KEY.PRINCIPLES },
  { label: 'Важное обо мне', key: USER_TAB_KEY.ABOUT },
  { label: 'Настройки', key: USER_TAB_KEY.SETTINGS },
];

type TherapistPageContextValue = {
  therapist: TherapistProfile;
  documents: Awaited<ReturnType<typeof getTherapistDocuments>>;
  isLoading: boolean;
};

// Контекст страницы терапевта
export const TherapistPageContext = createContext({} as TherapistPageContextValue);

const TherapistPage: NextPage = () => {
  const { query, replace, events } = useRouter();

  const [routeChanging, setRouteChanging] = useState(false);

  useEffect(() => {
    const startChange = setRouteChanging.bind(null, true);
    const endChange = setRouteChanging.bind(null, false);

    events.on('routeChangeStart', startChange);
    events.on('routeChangeComplete', endChange);

    return () => {
      events.off('routeChangeStart', startChange);
      events.off('routeChangeComplete', endChange);
    };
  }, [events]);

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
      case 'created_by_admin':
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
      case USER_TAB_KEY.PRACTICE:
        return (
          <PageWrapper>
            <TherapistPracticeSection />
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
      case USER_TAB_KEY.PRINCIPLES:
        return (
          <PageWrapper>
            <UserWorkPrinciplesForm />
          </PageWrapper>
        );
      case USER_TAB_KEY.ACCOUNTS:
        return (
          <PageWrapper>
            <TherapistSocialsLinksFrom />
          </PageWrapper>
        );
      case USER_TAB_KEY.SETTINGS:
        return (
          <PageWrapper>
            <TherapistSettingsForm />
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
          <TabList items={tabListItems} activeKey={activeTab} onChange={handleTabListChange} />
        </UserProfileHeader>
        <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {activeTab === USER_TAB_KEY.INFORMATION && (
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
                        return <></>;
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
          )}
          {!routeChanging && renderTabContents()}
          {routeChanging && (
            <PageWrapper>
              <Result icon={<Spin />} />
            </PageWrapper>
          )}
        </div>
      </MainLayout>
    </TherapistPageContext.Provider>
  );
};

export default TherapistPage;
