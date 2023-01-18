import React, { FC } from 'react';
import { Tabs } from 'antd';
import styles from './TabList.module.css';
import { TabsProps } from 'antd/lib/tabs';

const { TabPane } = Tabs;

type TabListItem = {
  label: string;
  key: string;
};

type TabListProps = {
  items: TabListItem[];
  defaultActiveKey?: string;
  onChange: (key: string) => void;
  activeKey?: string;
} & TabsProps;

export const TabList: FC<TabListProps> = ({ items, tabBarExtraContent, defaultActiveKey, onChange, activeKey }) => {
  return (
    <Tabs
      tabBarExtraContent={tabBarExtraContent}
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
      className={styles['tab-list']}
    >
      {items.map((it) => {
        return <TabPane key={it.key} tab={it.label} />;
      })}
    </Tabs>
  );
};
