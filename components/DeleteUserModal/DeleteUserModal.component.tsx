import { Modal } from 'antd';
import { FC, memo } from 'react';

type Props = {
  isOpen: boolean;
  deleteUser: () => void;
  onCancel: () => void;
};

const DeleteUserModal: FC<Props> = memo(({ isOpen, deleteUser, onCancel }) => {
  return (
    <Modal
      open={isOpen}
      onOk={() => {
        deleteUser();
        onCancel();
      }}
      onCancel={onCancel}
      okText="Удалить"
      cancelText="Отменить"
      title={'Удаление пользователя'}
    >
      Вы точно хотите удалить пользователя?
    </Modal>
  );
});

DeleteUserModal.displayName = 'DeleteUserModal';

export default DeleteUserModal;
