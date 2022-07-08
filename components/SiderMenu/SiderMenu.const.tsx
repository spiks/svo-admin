import { MenuProps } from 'antd';
import { PictureOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';

export enum SIDERMENU_ITEM_KEY {
  // Content
  CONTENT_GROUP = 'CONTENT_GROUP',
  BLOG = 'BLOG',
  EVENTS = 'EVENTS',
  // Users
  USERS_GROUP = 'USERS_GROUP',
  CLIENTS = 'CLIENTS',
  THERAPISTS = 'THERAPISTS',
  MODERATORS = 'MODERATORS',
  SUPPORT_AGENTS = 'SUPPORT_AGENTS',
  ADMINISTRATORS = 'ADMINISTRATOS',
  // Logs
  LOGS = 'LOGS',
}

export const SiderMenuItems: Required<MenuProps>['items'][number][] = [
  {
    type: 'group',
    label: <span style={{ opacity: '0.4' }}>Управление</span>,
  },
  // Content
  {
    key: SIDERMENU_ITEM_KEY.CONTENT_GROUP,
    label: 'Контент',
    icon: <PictureOutlined />,
    children: [
      {
        key: SIDERMENU_ITEM_KEY.BLOG,
        label: 'Блог',
      },
      {
        key: SIDERMENU_ITEM_KEY.EVENTS,
        label: 'Мероприятия',
      },
    ],
  },
  // Users
  {
    key: SIDERMENU_ITEM_KEY.USERS_GROUP,
    label: 'Пользователи',
    icon: <UserOutlined />,
    children: [
      {
        key: SIDERMENU_ITEM_KEY.CLIENTS,
        label: 'Клиенты',
      },
      {
        key: SIDERMENU_ITEM_KEY.THERAPISTS,
        label: 'Психологи',
      },
      {
        key: SIDERMENU_ITEM_KEY.MODERATORS,
        label: 'Модераторы',
      },
      {
        key: SIDERMENU_ITEM_KEY.SUPPORT_AGENTS,
        label: 'Агенты поддержки',
      },
      {
        key: SIDERMENU_ITEM_KEY.ADMINISTRATORS,
        label: 'Администраторы',
      },
    ],
  },
  // Logs
  {
    key: SIDERMENU_ITEM_KEY.LOGS,
    label: 'Логи',
    icon: <ProfileOutlined />,
  },
];
