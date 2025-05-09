import { Alert, BreadcrumbProps, Button } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { TherapistProfileStatus } from 'generated';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext } from 'react';
import { Header } from '../Header/Header.component';
import { extractFullName } from '../../utility/extractFullName';
import { DownloadOutlined } from '@ant-design/icons';

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

export const TherapistProfileHeader: FC = ({ children }) => {
  const { therapist } = useContext(TherapistPageContext);

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
      breadcrumbName: extractFullName(therapist),
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

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={
        <div>
          <span style={{ marginRight: '12px' }}>{`Пользователь ${extractFullName(therapist)} (${
            therapistStatusName[therapist.status]
          })`}</span>
          <Button
            size={'large'}
            target={'_blank'}
            href={`/cv/${therapist.id}`}
            type={'link'}
            icon={<DownloadOutlined />}
          >
            Скачать CV
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
