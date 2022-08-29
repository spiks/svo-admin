import { PictureOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';

export const SiderMenuItems = [
  // Content
  // {
  //   url: NAVIGATION.content,
  //   label: 'Контент',
  //   icon: <PictureOutlined />,
  //   children: [
  //     {
  //       label: 'Блог',
  //       url: NAVIGATION.blog,
  //     },
  //     {
  //       label: 'Мероприятия',
  //       url: NAVIGATION.events,
  //     },
  //   ],
  // },
  // Users
  {
    url: NAVIGATION.users,
    label: 'Пользователи',
    icon: <UserOutlined />,
    children: [
      // {
      //   label: 'Клиенты',
      //   url: NAVIGATION.patients,
      // },
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
  // Logs
  // {
  //   url: NAVIGATION.logs,
  //   label: 'Логи',
  //   icon: <ProfileOutlined />,
  // },
];
