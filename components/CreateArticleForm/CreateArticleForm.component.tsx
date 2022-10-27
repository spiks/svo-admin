import { Button, Col, Form, FormInstance } from 'antd';
import { FC } from 'react';
import { AdminSubmitBlogArticle } from 'api/blog/submitBlogArticle';
import { TabKey } from '../../constants/blogTabs';
import { ArticleTextForm } from '@components/ArticleForm/ArticleTextForm/ArticleTextForm.component';
import { ArticleInformationForm } from '@components/ArticleForm/ArticleInformationForm/ArticleInformationForm.component';

type CreateArticleFormProps = {
  activeTab: TabKey;
  handleTabListChange: (key: TabKey) => void;
  onFinish: (values: AdminSubmitBlogArticle) => void;
  form: FormInstance<AdminSubmitBlogArticle>;
};

const CreateArticleForm: FC<CreateArticleFormProps> = ({ activeTab, handleTabListChange, form, onFinish }) => {
  const values = form?.getFieldsValue(true);

  const renderForm = () => {
    switch (activeTab) {
      case 'information':
        return (
          <ArticleInformationForm setUploadedToken={(token) => form?.setFieldValue('cover', token)}>
            <Col offset={6} span={16}>
              <Button onClick={() => handleTabListChange('article')} size={'large'} type={'primary'}>
                {'Продолжить'}
              </Button>
            </Col>
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
      initialValues={{
        cover: null,
        shortText: null,
        showPreviewFromArticle: false,
        showInBlockInterestingAndUseful: false,
      }}
      form={form}
      onFinish={onFinish}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
    >
      {renderForm}
    </Form>
  );
};

export default CreateArticleForm;
