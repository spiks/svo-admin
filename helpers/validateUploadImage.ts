import { notification, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

export async function validateUploadImage(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isMaxSize = file.size < 15728640;

  if (!isJpgOrPng) {
    notification.error({
      type: 'error',
      message: 'Ошибка',
      description: `${file.name} имееет неверный формат!`,
    });
    return Upload.LIST_IGNORE;
  }
  if (!isMaxSize) {
    notification.error({
      type: 'error',
      message: 'Ошибка',
      description: `Превышен максимальный размер файла!`,
    });
    return Upload.LIST_IGNORE;
  }

  if (isFileImage(file)) {
    const imageDims = await getImageFileDimensions(file);
    const width = imageDims.width;
    const height = imageDims.height;
    const isMaxDims = width < 5400 && height < 5400;
    const isMinDims = width > 912 && height > 10;

    if (!isMaxDims) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: `Максимальный размер изображения 5400 x 5400!`,
      });
      return Upload.LIST_IGNORE;
    }

    if (!isMinDims) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: `Минимальный размер изображения 912 x 10!`,
      });
      return Upload.LIST_IGNORE;
    }
  }

  return true;
}

function isFileImage(file: Blob) {
  return file['type'].split('/')[0] === 'image';
}

function getImageFileDimensions(file: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = url;
  });
}
