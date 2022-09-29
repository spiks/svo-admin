import { Form, FormInstance, FormProps, notification } from 'antd';
import { FC, createContext, useMemo } from 'react';
import { AdminSubmitBlogArticle } from 'generated';
import { submitBlogArticle } from 'api/blog/submitBlogArticle';
import { TabKey } from 'pages/content/blog/createArticle';
import { CreateArticleFormInformationTab } from './CreateArticleFormInformationTab/CreateArticleFormInformationTab.component';
import { CreateArticleFormArticleTab } from './CreateArticleFormArticleTab/CreateArticleFormArticleTab.component';

type CreateArticleFormContextValue = {
  form?: FormInstance<AdminSubmitBlogArticle>;
  handleTabListChange?: (key: TabKey) => void;
};

export const CreateArticleFormContext = createContext<CreateArticleFormContextValue>({});

const CreateArticleForm: FC<{ activeTab: TabKey; handleTabListChange: (key: TabKey) => void }> = ({
  activeTab,
  handleTabListChange,
}) => {
  const [form] = Form.useForm<AdminSubmitBlogArticle>();

  const onFinish: FormProps<AdminSubmitBlogArticle>['onFinish'] = async () => {
    const values: AdminSubmitBlogArticle = form.getFieldsValue(true);
    try {
      await submitBlogArticle(values);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно создана',
      });
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось создать статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  };

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
