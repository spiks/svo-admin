import { Button, Col, Form, FormInstance } from 'antd';
import { FC } from 'react';
import { TabKey } from '../../constants/blogTabs';
import { ArticleTextForm } from '@components/ArticleForm/ArticleTextForm/ArticleTextForm.component';
import { ArticleInformationForm } from '@components/ArticleForm/ArticleInformationForm/ArticleInformationForm.component';
import { AdminUpdateBlogArticle } from '../../api/blog/updateBlogArticle';
import { Radio } from 'antd';
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
          <ArticleInformationForm setUploadedToken={(token) => form?.setFieldValue('cover', token)}>
            <Form.Item name={'isArchived'} label={'Статус'} style={{ marginBottom: '48px' }} required={true}>
              <Radio.Group buttonStyle="solid">
                <Radio.Button value={false}>Опубликовано</Radio.Button>
                <Radio.Button value={true}>В архиве</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Col offset={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button onClick={() => onFinish(form.getFieldsValue())} size={'large'} type={'primary'}>
                {'Сохранить'}
              </Button>
              <Button onClick={() => handleTabListChange('article')} icon={<RightOutlined />} size="middle" type="link">
                {'Перейти к статье'}
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
      initialValues={values}
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

export default EditArticleForm;
