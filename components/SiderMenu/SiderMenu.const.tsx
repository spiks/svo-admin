import { PictureOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';

export const SiderMenuItems = [
  // Content
  {
    url: NAVIGATION.content,
    label: 'Контент',
    icon: <PictureOutlined />,
    children: [
      {
        label: 'Блог',
        url: NAVIGATION.blog,
      },
      // {
      //   label: 'Мероприятия',
      //   url: NAVIGATION.events,
      // },
    ],
  },
  // Users
  {
    url: NAVIGATION.users,
    label: 'Пользователи',
    icon: <UserOutlined />,
    children: [
      {
        label: 'Клиенты',
        url: NAVIGATION.patients,
      },
      {
        label: 'Психологи',
        url: NAVIGATION.therapists,
      },
      // {
      //   label: 'Модераторы',
      //   url: NAVIGATION.moderators,
      // },
      // {
      //   label: 'Агенты поддержки',
      //   url: NAVIGATION.supportAgents,
      // },
      // {
      //   label: 'Администраторы',
      //   url: NAVIGATION.administrators,
      // },
    ],
  },
  // Billing
  {
    url: NAVIGATION.payouts,
    label: 'Биллинг',
    icon: <CreditCardOutlined />,
    children: [
      {
        label: 'Отчет по психологам',
        url: NAVIGATION.therapistsPayouts,
      },
    ],
  },
  // Logs
  // {
  //   url: NAVIGATION.logs,
  //   label: 'Логи',
  //   icon: <ProfileOutlined />,
  // },
];
