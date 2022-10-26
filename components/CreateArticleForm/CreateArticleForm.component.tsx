import { Form, FormInstance } from 'antd';
import { FC, createContext, useMemo } from 'react';
import { AdminSubmitBlogArticle } from 'api/blog/submitBlogArticle';
import { TabKey } from 'pages/content/blog/createArticle';
import { CreateArticleFormInformationTab } from './CreateArticleFormInformationTab/CreateArticleFormInformationTab.component';
import { CreateArticleFormArticleTab } from './CreateArticleFormArticleTab/CreateArticleFormArticleTab.component';

type CreateArticleFormContextValue = {
  form?: FormInstance<AdminSubmitBlogArticle>;
  handleTabListChange?: (key: TabKey) => void;
};

export const CreateArticleFormContext = createContext<CreateArticleFormContextValue>({});

type CreateArticleFormProps = {
  activeTab: TabKey;
  handleTabListChange: (key: TabKey) => void;
  onFinish: (values: AdminSubmitBlogArticle) => void;
  form: FormInstance<AdminSubmitBlogArticle>;
};

const CreateArticleForm: FC<CreateArticleFormProps> = ({ activeTab, handleTabListChange, form, onFinish }) => {
  const renderForm = () => {
    switch (activeTab) {
      case 'information':
        return <CreateArticleFormInformationTab />;
      case 'article':
        return <CreateArticleFormArticleTab />;
    }
  };

  const contextValue = useMemo(() => {
    return {
      form,
      handleTabListChange,
    };
  }, [form, handleTabListChange]);

  return (
    <CreateArticleFormContext.Provider value={contextValue}>
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
    </CreateArticleFormContext.Provider>
  );
};

export default CreateArticleForm;
