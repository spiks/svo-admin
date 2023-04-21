import { ComponentProps, ReactNode } from 'react';
import Upload from 'antd/es/upload';
import ImgCrop from 'antd-img-crop';
import dynamic from 'next/dynamic';

interface Props extends ComponentProps<typeof Upload> {
  children: ReactNode;
}

export const AsyncUpload = dynamic(import('antd/es/upload'), { ssr: false });

export const UploadWithCrop = (props: Props) => {
  return (
    <ImgCrop
      resetText={'Сбросить'}
      modalTitle={'Редактирование фотографии профиля'}
      modalCancel={'Закрыть'}
      showGrid
      zoomSlider
      cropShape={'round'}
    >
      <AsyncUpload {...props} />
    </ImgCrop>
  );
};
