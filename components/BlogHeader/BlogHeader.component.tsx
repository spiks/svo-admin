import { Alert, Button, Tabs, Form, Input, Select, DatePicker, DatePickerProps, Row, Col } from 'antd';
import { FC } from 'react';
import { Header } from '../Header/Header.component';
import { FilterFilled, InfoCircleOutlined } from '@ant-design/icons';
import { TagRender } from '../TagRender/TagRender.component';

type OptionsType = {
  label: string;
  value: string;
}[];

const { TabPane } = Tabs;
const { Search } = Input;

const options: OptionsType = [
  { label: 'Общая практика', value: 'gold' },
  { label: 'Мотивация', value: 'blue' },
  { label: 'Семья', value: 'lime' },
];

export type BlogHeaderProps = {
  showFilters: boolean;
  handleShowFilters: () => void;
};

export const BlogHeader: FC<BlogHeaderProps> = ({ showFilters, handleShowFilters }) => {
  const [form] = Form.useForm();

  const onSearch = () => {
    return;
  };

  const onChange: DatePickerProps['onChange'] = () => {
    return;
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={'Блог'}
      subTitle={'В этом разделе собраны статьи, опубликованные на платформе'}
      extra={
        <>
          <Button size="large" type="text">
            Обратиться к FAQ
          </Button>
          <Button size="large" type={'primary'}>
            Добавить публикацию
          </Button>
          <Button size="large" onClick={handleShowFilters} icon={<FilterFilled />} type="default">
            Парамерты поиска
          </Button>
        </>
      }
      footer={
        <Tabs style={{ paddingLeft: '36px' }} defaultActiveKey="1">
          <TabPane tab="Опубликованные" key="1" />
          <TabPane tab="Архивные" key="2" />
        </Tabs>
      }
    >
      {showFilters && (
        <Row
          gutter={[0, 16]}
          style={{
            paddingLeft: '36px',
          }}
        >
          <Col span={24}>
            <Alert
              style={{ borderRadius: '8px' }}
              message="Описание"
              description="Здесь можно разместить какое-нибудь описание для блога. Его можно скрыть."
              type="info"
              showIcon
              closable
            />
          </Col>
          <Col span={24}>
            <Form style={{ paddingBottom: '24px' }} form={form} layout="vertical" requiredMark={false}>
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item
                    style={{ width: '100%' }}
                    label="Поиск"
                    name="search"
                    tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                  >
                    <Search
                      size="large"
                      placeholder="Начните вводить название или описание статьи..."
                      onSearch={onSearch}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    style={{ width: '100%' }}
                    label="Теги"
                    name="tags"
                    tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                  >
                    <Select
                      size="large"
                      mode="multiple"
                      tagRender={({ label, value, closable, onClose, ...props }) => {
                        return (
                          <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />
                        );
                      }}
                      style={{ width: '100%' }}
                      options={options}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="space-between" align="bottom">
                <Col>
                  <Form.Item
                    style={{ width: '100%', margin: '0' }}
                    label="Опубликовано"
                    name="date"
                    tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                  >
                    <DatePicker
                      size="large"
                      style={{ width: '330px' }}
                      placeholder="Укажите дату публикации"
                      onChange={onChange}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button size="large" onClick={onReset}>
                    Очистить все фильтры
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </Header>
  );
};
