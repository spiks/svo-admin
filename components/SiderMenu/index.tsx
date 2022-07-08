import React, { FC } from 'react';
import { Avatar, Button, Menu } from 'antd';
import { SiderMenuItems } from './SiderMenu.const';
import logo from '/resources/svg/logo.svg';
import { Image } from '../Image';
import { LogoutOutlined } from '@ant-design/icons';

export const SiderMenu: FC = () => {
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
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={SiderMenuItems}
      />
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
        <Button type={'link'} size={'small'} style={{ marginLeft: 'auto', fontSize: '12px' }}>
          <LogoutOutlined style={{ color: '#FFFFFF' }} />
        </Button>
      </div>
    </div>
  );
};
