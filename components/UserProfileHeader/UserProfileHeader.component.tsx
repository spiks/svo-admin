import { Alert, BreadcrumbProps, Button, Tabs } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Header } from '../Header/Header.component';

export const UserProfileHeader: FC<{ username?: string; id?: string }> = ({ username = 'Дейнерис' }) => {
  const { TabPane } = Tabs;
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
          <span style={{ marginRight: '12px' }}>{`Просмотр профиля пользователя ${username}`}</span>
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
      footer={
        <Tabs style={{ paddingLeft: '36px' }} defaultActiveKey="1">
          <TabPane tab="Сведения" key="1" />
          <TabPane tab="Документы" key="2" />
          <TabPane tab="Договор" key="3" />
          <TabPane tab="Личные аккаунты" key="4" />
          <TabPane tab="Методы и техники" key="5" />
          <TabPane tab="Презентация" key="6" />
          <TabPane tab="Логи" key="7" />
        </Tabs>
      }
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
