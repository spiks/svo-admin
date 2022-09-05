import { FC } from 'react';
import { Alert, Button, Col, Form, Input, PageHeader, Row } from 'antd';
import { FilterFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useUsersHeaderForm } from './UsersHeader.hooks/useUsersHeaderForm';
import { REGEXP_PHONE } from '../../constants/regexp';

type UserHeaderProps = {
  title: string;
  searchPlaceholder?: string;
  form: Parameters<typeof useUsersHeaderForm>[0];
};
/**
 * Шапка с параметрами для фильтрации листинга для подразделов категории "Пользователи";
 * Применённые параметры пробрасываются в query (GET) запрос на текущей странице;
 * Применение фильтров через 1.5 сек. после последнего изменения, либо по нажатию на enter;
 */
export const UsersHeader: FC<UserHeaderProps> = ({ title, form, searchPlaceholder, children }) => {
  const { back } = useRouter();
  const { toggleShowFilters, handleFiltersApply, handleResetFilters, handleFiltersChange, showFilters } =
    useUsersHeaderForm(form);

  return (
    <div
      style={{
        padding: '40px 40px 0 40px',
        background: 'white',
      }}
    >
      <PageHeader
        style={{
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }}
        title={title}
        onBack={back}
        extra={[
          <Button type={'link'} size={'large'} key={0}>
            Обратиться к FAQ
          </Button>,
          // <Button type={'primary'} size={'large'} key={1}>
          //   Добавить пользователя
          // </Button>,
          <Button type={'default'} size={'large'} icon={<FilterFilled />} onClick={toggleShowFilters} key={2}>
            Параметры поиска
          </Button>,
        ]}
        subTitle={
          <>
            <QuestionCircleOutlined />
            <span style={{ marginLeft: '12px' }}>В этом разделе собраны профили клиентов системы</span>
          </>
        }
      />
      <div style={{ marginLeft: '36px' }}>
        <Alert
          type={'info'}
          showIcon={true}
          message={'Описание'}
          description={'Здесь можно разместить какое-нибудь описание для пользователей. Его можно скрыть.'}
          style={{ marginBottom: '16px' }}
        />
        {showFilters && (
          <Form
            form={form}
            layout={'vertical'}
            onFinish={handleFiltersApply}
            onFieldsChange={handleFiltersChange}
            initialValues={{
              search: '',
              phone: '',
            }}
          >
            <Row style={{ columnGap: '24px', flexWrap: 'nowrap' }}>
              <Col flex={9}>
                <Form.Item name={'search'} label={'Поиск'} tooltip={'Поиск'}>
                  <Input.Search size={'large'} placeholder={searchPlaceholder} onSearch={handleFiltersApply} />
                </Form.Item>
              </Col>
              <Col flex={2}>
                <Form.Item
                  rules={[
                    {
                      pattern: REGEXP_PHONE,
                      message: 'Неверный формат',
                    },
                  ]}
                  name={'phone'}
                  label={'Номер телефона'}
                  tooltip={'Номер телефона'}
                >
                  <Input prefix={'+7'} placeholder={'0000000000'} maxLength={10} type={'tel'} size={'large'} />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item label={<span style={{ color: 'transparent' }}>.</span>}>
                  <Button
                    htmlType={'button'}
                    type={'default'}
                    size={'large'}
                    onClick={handleResetFilters}
                    style={{ width: '100%' }}
                  >
                    Очистить все фильтры
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        {children}
      </div>
    </div>
  );
};
