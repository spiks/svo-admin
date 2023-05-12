import { BreadcrumbProps, Button } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import { extractFullName } from 'utility/extractFullName';
import { Header } from '../Header/Header.component';

type PatientProfileHeaderProps = {
  id?: string;
  name?: string | null;
  surname?: string | null;
  children: ReactNode;
};

export const PatientProfileHeader: FC<PatientProfileHeaderProps> = ({ id, name, surname, children }) => {
  const { back } = useRouter();

  const routes: BreadcrumbProps['routes'] = [
    {
      path: 'users',
      breadcrumbName: 'Пользователи',
    },
    {
      path: 'patients',
      breadcrumbName: 'Клиенты',
    },
    {
      path: `${id}`,
      breadcrumbName: extractFullName({ name, surname }),
    },
  ];

  const itemRender = (route: Route, params: any, routes: Route[]) => {
    const first = routes.indexOf(route) === 0;
    const last = routes.indexOf(route) === routes.length - 1;

    return first || last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link href={'/users/patients'}>{route.breadcrumbName}</Link>
    );
  };

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={
        <span style={{ marginRight: '12px' }}>{`Просмотр профиля пользователя ${extractFullName({ name, surname })} 
          `}</span>
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
    />
  );
};
