import { Alert, Button, Form, Input, Select, DatePicker, Row, Col, notification } from 'antd';
import { FC } from 'react';
import { Header } from '../Header/Header.component';
import { FilterFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useBlogHeaderForm } from './BlogHeader.hooks/useBlogHeaderForm';
import { useBlogHeaderQueryParams } from './BlogHeader.hooks/useBlogHeaderQueryParams';
import moment from 'moment';
import { useGetListBlogTags } from '../../hooks/useGetListBlogTags';

const { Search } = Input;

export type BlogHeaderProps = {
  showFilters: boolean;
  handleShowFilters: () => void;
};

export const BlogHeader: FC<BlogHeaderProps> = ({ showFilters, handleShowFilters, children }) => {
  const { back, push } = useRouter();
  const { handleFiltersApply, handleResetFilters, handleFiltersChange, form } = useBlogHeaderForm();
  const { search, tags, publishDate } = useBlogHeaderQueryParams();

  const tagsOptions = useGetListBlogTags(() =>
    notification.error({
      type: 'error',
      message: 'Ошибка',
      description: 'Не удалось загрузить теги для фильтрации статей',
    }),
  );

  const initialDate = publishDate ? moment(publishDate) : null;

  return (
    <Header
      style={{ backgroundColor: '#FFFFFF' }}
      title={'Блог'}
      onBack={back}
      subTitle={'В этом разделе собраны статьи, опубликованные на платформе'}
      extra={
        <>
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
                {tagsOptions?.length ? (
                  <Col span={12}>
                    <Form.Item
                      style={{ width: '100%' }}
                      label="Теги"
                      name="tags"
                      tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
                    >
                      <Select
                        options={tagsOptions.map((it) => {
                          return {
                            value: it.id,
                            label: it.name,
                          };
                        })}
                        size="large"
                        mode="multiple"
                        onChange={(value) => {
                          return value;
                        }}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                ) : null}
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
