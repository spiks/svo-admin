import { ReactNode } from 'react';
import { Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';

interface Props extends UploadProps {
  children: ReactNode;
}

export const UploadWithCrop = (props: Props) => {
  return (
    <ImgCrop
      resetText={'Сбросить'}
      modalTitle={'Редактирование фотографии профиля'}
      modalCancel={'Закрыть'}
      rotationSlider
      showGrid
      zoomSlider
      cropShape={'round'}
      showReset
    >
      <Upload {...props} />
    </ImgCrop>
  );
};
