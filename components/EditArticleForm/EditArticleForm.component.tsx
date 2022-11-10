import { Button, Col, Form, FormInstance, Radio } from 'antd';
import { FC } from 'react';
import { TabKey } from '../../constants/blogTabs';
import { ArticleTextForm } from '@components/ArticleForm/ArticleTextForm/ArticleTextForm.component';
import { ArticleInformationForm } from '@components/ArticleForm/ArticleInformationForm/ArticleInformationForm.component';
import { AdminUpdateBlogArticle } from '../../api/blog/updateBlogArticle';
import { RightOutlined } from '@ant-design/icons';

type EditArticleFormProps = {
  activeTab: TabKey;
  handleTabListChange: (key: TabKey) => void;
  onFinish: (values: AdminUpdateBlogArticle) => void;
  form: FormInstance<AdminUpdateBlogArticle>;
};

const EditArticleForm: FC<EditArticleFormProps> = ({ activeTab, handleTabListChange, form, onFinish }) => {
  const values = form?.getFieldsValue(true);

  const renderForm = () => {
    switch (activeTab) {
      case 'information':
        return (
          <ArticleInformationForm>
            <Form.Item name={'isArchived'} label={'Статус'} style={{ marginBottom: '48px' }} required={true}>
              <Radio.Group buttonStyle="solid">
                <Radio.Button value={false}>Опубликовано</Radio.Button>
                <Radio.Button value={true}>В архиве</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Col offset={6} span={16}>
                <Button
                  icon={<RightOutlined />}
                  onClick={() => handleTabListChange('article')}
                  size="large"
                  type="link"
                >
                  {'Перейти к статье'}
                </Button>
              </Col>
            </Form.Item>
          </ArticleInformationForm>
        );
      case 'article':
        return (
          <ArticleTextForm
            title={values?.title}
            text={values?.text}
            onReturnBackButtonClick={() => {
              handleTabListChange('information');
            }}
          />
        );
    }
  };

  return (
    <Form
      initialValues={values}
      form={form}
      onFinish={async () => {
        // В аргументе здесь values не содержит все необходимые нам значения, а только текущей активной формы.
        onFinish(values);
      }}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
    >
      {renderForm}
    </Form>
  );
};

export default EditArticleForm;
