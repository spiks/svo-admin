import { Alert, Button, Tabs, Form, Input, Select, DatePicker, DatePickerProps, Row, Col } from 'antd';
import { FC } from 'react';
import { Header } from '../Header/Header.component';
import { FilterFilled, InfoCircleOutlined } from '@ant-design/icons';
import { TagRender } from '../TagRender/TagRender.component';
import { useRouter } from 'next/router';
import { useBlogHeaderForm } from './BlogHeader.hooks/useBlogHeaderForm';
import { useBlogHeaderQueryParams } from './BlogHeader.hooks/useBlogHeaderQueryParams';
import moment from 'moment';
import { BlogArticleTag } from 'generated';

const { Search } = Input;

//  TODO: нужен метод listBlogTags, чтобы получить список всех тегов. На основании этого списка уже реализовывать поиск статей по тегам.
const options: BlogArticleTag[] = [
  { id: 'gold', name: 'Общая практика' },
  { id: 'blue', name: 'Мотивация' },
  { id: 'lime', name: 'Семья' },
];

export type BlogHeaderProps = {
  showFilters: boolean;
  handleShowFilters: () => void;
};

export const BlogHeader: FC<BlogHeaderProps> = ({ showFilters, handleShowFilters, children }) => {
  const { back, push } = useRouter();
  const { handleFiltersApply, handleResetFilters, handleFiltersChange, form } = useBlogHeaderForm();
  const { search, tags, publishDate } = useBlogHeaderQueryParams();

  const initialDate = publishDate ? moment(publishDate) : null;

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={'Блог'}
      onBack={back}
      subTitle={'В этом разделе собраны статьи, опубликованные на платформе'}
      extra={
        <>
          <Button size="large" type="text">
            Обратиться к FAQ
          </Button>
          <Button
            onClick={() => {
              push('/content/blog/createArticle');
            }}
            size="large"
            type={'primary'}
          >
            Добавить публикацию
          </Button>
          <Button size="large" onClick={handleShowFilters} icon={<FilterFilled />} type="default">
            Парамерты поиска
          </Button>
        </>
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
            <Form
              onFinish={handleFiltersApply}
              onValuesChange={handleFiltersChange}
              style={{ paddingBottom: '24px' }}
              form={form}
              layout="vertical"
              initialValues={{
                search,
                tags: tags ?? [],
                date: initialDate,
              }}
            >
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
                      onSearch={handleFiltersApply}
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
                      onChange={handleFiltersApply}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button size="large" onClick={handleResetFilters}>
                    Очистить все фильтры
                  </Button>
                </Col>
              </Row>
            </Form>
            {children}
          </Col>
        </Row>
      )}
    </Header>
  );
};
