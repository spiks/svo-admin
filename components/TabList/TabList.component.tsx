import React, { FC } from 'react';
import { Tabs } from 'antd';
import styles from './TabList.module.css';
import { TabKey } from 'constants/blogTabs';

const { TabPane } = Tabs;

type TabListItem = {
  label: string;
  key: string;
};

interface TabListProps {
  items: TabListItem[];
  defaultActiveKey: string;
  onChange: (key: string) => void;
  activeKey?: string;
}
export const TabList: FC<TabListProps> = ({ items, defaultActiveKey, onChange, activeKey }) => {
  return (
    <Tabs activeKey={activeKey} defaultActiveKey={defaultActiveKey} onChange={onChange} className={styles['tab-list']}>
      {items.map((it) => {
        return <TabPane key={it.key} tab={it.label} />;
      })}
    </Tabs>
  );
};
