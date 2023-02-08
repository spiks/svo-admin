import { Alert, BreadcrumbProps, Button } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { TherapistProfileStatus } from 'generated';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext } from 'react';
import { Header } from '../Header/Header.component';
import { useTherapistBan } from '../../hooks/useTherapistBan';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

const therapistStatusName: Record<TherapistProfileStatus, string> = {
  active: 'Активный',
  blocked: 'Пользователь заблокирован',
  pre_blocked: 'Пользователь в стадии блокировки',
  contract_awaiting_review: 'Договор находится на проверке',
  contract_not_submitted_yet: 'Договор ещё не был отправлен',
  contract_rejected: 'Договор отклонен',
  documents_not_submitted_yet: 'Документы ещё не отправлены',
  documents_awaiting_review: 'Документы на проверке',
  documents_rejected: 'Документы отклонены',
  interview_failed: 'Интервью провалено',
  interview_processing: 'На этапе интервью',
  created_by_admin: 'Создан администратором',
};

export const UserProfileHeader: FC = ({ children }) => {
  const { therapist, isLoading } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);
  const { banTherapist, unbanTherapist, isMutating } = useTherapistBan({
    onSuccess() {
      refetch('therapist');
    },
  });

  const { back } = useRouter();

  const routes: BreadcrumbProps['routes'] = [
    {
      path: 'users',
      breadcrumbName: 'Пользователи',
    },
    {
      path: 'therapists',
      breadcrumbName: 'Психологи',
    },
    {
      path: `${therapist.id}`,
      breadcrumbName: `${therapist.fullName ?? 'Аноним'}`,
    },
  ];

  const itemRender = (route: Route, params: any, routes: Route[]) => {
    const first = routes.indexOf(route) === 0;
    const last = routes.indexOf(route) === routes.length - 1;

    return first || last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link href={'/users/therapists'}>{route.breadcrumbName}</Link>
    );
  };

  const bannedStatuses = ['blocked', 'pre_blocked'];
  const banMethod = bannedStatuses.includes(therapist.status)
    ? unbanTherapist.mutate.bind(null, therapist.id)
    : banTherapist.mutate.bind(null, therapist.id);

  const banWord = bannedStatuses.includes(therapist.status) ? 'Разблокировать' : 'Заблокировать';

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={
        <div>
          <span style={{ marginRight: '12px' }}>{`Пользователь ${therapist.fullName ?? 'Аноним'} (${
            therapistStatusName[therapist.status]
          })`}</span>
          <Button
            loading={isMutating || isLoading}
            size="large"
            onClick={() => {
              banMethod();
            }}
          >
            {banWord}
          </Button>
        </div>
      }
      onBack={back}
      breadcrumb={{ routes, itemRender }}
      extra={
        <>
          <Button onClick={back} size="large" type="text">
            Закрыть
          </Button>
        </>
      }
      footer={children}
    >
      <Alert
        style={{ borderRadius: '8px', marginLeft: '-32px' }}
        description="Информация об образовании размещена в разделе «Документы»"
        type="info"
        showIcon
        closable
      />
    </Header>
  );
};
