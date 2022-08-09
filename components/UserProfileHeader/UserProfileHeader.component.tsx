import { Alert, Breadcrumb, Button, Col, Row, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.component';
import { Header } from '../Header/Header.component';

export const UserProfileHeader: FC<{ username?: string; id?: string }> = ({ username = 'Дейнерис' }) => {
  const { TabPane } = Tabs;
  const { back } = useRouter();

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
      breadcrumb={<Breadcrumbs />}
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
