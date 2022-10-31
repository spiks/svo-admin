import { Form, FormInstance, Input, Modal } from 'antd';
import { FC } from 'react';
import { AdminRejectBlogArticle } from '../../api/blog/rejectArticle';

type Props = {
  open: boolean;
  rejectArticle: () => void;
  onCancel: () => void;
  form: FormInstance<AdminRejectBlogArticle>;
};

export const RejectArticleModal: FC<Props> = ({ open, form, rejectArticle, onCancel }) => {
  return (
    <Modal
      open={open}
      onOk={rejectArticle}
      onCancel={onCancel}
      okText="Продолжить"
      cancelText="Отменить"
      title={'Укажите причину отказа'}
    >
      <Form form={form} layout="vertical">
        <Form.Item name={'rejectionReason'} label={'Укажите причину почему вы отказали в публикации, опишите ее.'}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
