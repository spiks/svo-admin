import { Alert, BreadcrumbProps, Button, Tabs } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext } from 'react';
import { Header } from '../Header/Header.component';

export const UserProfileHeader: FC = ({ children }) => {
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
      breadcrumbName: `${therapist.fullName}`,
    },
  ];

  const itemRender = (route: Route, params: any, routes: Route[], paths: string[]) => {
    const first = routes.indexOf(route) === 0;
    const last = routes.indexOf(route) === routes.length - 1;

    return first || last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link href={paths.join('/')}>{route.breadcrumbName}</Link>
    );
  };

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={
        <div>
          <span
            style={{ marginRight: '12px' }}
          >{`Просмотр профиля пользователя ${therapist.fullName} (${therapist.status})`}</span>
          <Button size="large">Заблокировать</Button>
        </div>
      }
      onBack={back}
      breadcrumb={{ routes, itemRender }}
      extra={
        <>
          <Button size="large" type="text">
            Закрыть
          </Button>
          <Button size="large" type="primary">
            Сохранить
          </Button>
        </>
      }
      footer={children}
    >
      <Alert
        style={{ borderRadius: '8px', marginLeft: '36px' }}
        description="Информация об образовании размещена в разделе «Документы»"
        type="info"
        showIcon
        closable
      />
    </Header>
  );
};
