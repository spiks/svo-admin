import React, { FC } from 'react';
import { Avatar, Button, Menu } from 'antd';
import { SiderMenuItems } from './SiderMenu.const';
import logo from '/resources/svg/logo.svg';
import { Image } from '../Image/Image.component';
import { LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSidebarItemsToHighlight } from './useSidebarItemsToHighlight';
import { useLogout } from '../../api/hooks/useLogout';

const { SubMenu } = Menu;

export const SiderMenu: FC = () => {
  const sidebarItemsToHighlight = useSidebarItemsToHighlight();

  const subcategoryToHighlight = sidebarItemsToHighlight[1];
  const categoryToOpen = sidebarItemsToHighlight[0];
  const categoryToHighlight = sidebarItemsToHighlight[0];

  const logout = useLogout();

  const handleLogoutUser = async () => {
    logout();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '110px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Image {...logo} alt={'MOST'} />
      </div>
      <Menu
        theme={'dark'}
        defaultOpenKeys={subcategoryToHighlight && categoryToOpen ? [categoryToOpen] : undefined}
        selectedKeys={
          subcategoryToHighlight ? [subcategoryToHighlight] : categoryToHighlight ? [categoryToHighlight] : undefined
        }
        mode="inline"
      >
        <Menu.ItemGroup title={<span style={{ opacity: '0.4' }}>Управление</span>}>
          {SiderMenuItems.map((it) => {
            return it.children ? (
              <SubMenu icon={it.icon} key={it.url} title={it.label}>
                {it.children.map((it) => (
                  <Menu.Item key={it.url}>
                    <Link href={it.url}>
                      <a>{it.label}</a>
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item icon={it.icon} key={it.url}>
                <Link href={it.url}>
                  <a>{it.label}</a>
                </Link>
              </Menu.Item>
            );
          })}
        </Menu.ItemGroup>
      </Menu>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '66px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginTop: 'auto',
          padding: '0 16px',
        }}
      >
        <Avatar size={'small'} />
        <span style={{ marginLeft: '10px', color: '#FFFFFF' }}>Дейнерис</span>
        <Button
          onClick={handleLogoutUser}
          type={'link'}
          size={'small'}
          style={{ marginLeft: 'auto', fontSize: '12px' }}
        >
          <LogoutOutlined style={{ color: '#FFFFFF' }} />
        </Button>
      </div>
    </div>
  );
};
