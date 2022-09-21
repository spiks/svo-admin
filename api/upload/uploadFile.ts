import { FileMimeType, FileUploadCredentials } from '../../generated';
import FormData from 'form-data';
import axios from 'axios';
import { RcFile } from 'antd/lib/upload';

export interface UploadFileResponse {
  token: string;
  uploadedFile: {
    metadata: {
      fileSize: number;
      mimeType: string;
    };
    s3: {
      object: string;
    };
    originalFileName: string;
    url: string;
  };
  version: number;
}

/**
 * Позволяет провести предварительную валидацию файла с последующей загрузкой на основе данных от `requestFileUploadUrl`
 * @param credentials - результат метода `requestFileUploadUrl`
 * @param file - загружаемый файл
 */
export const uploadFile = async (credentials: FileUploadCredentials, file: File | RcFile) => {
  // {[mime-type]: maxSize}
  const allowed: Partial<Record<FileMimeType, number>> = {};

  credentials.constraints.forEach((constr) => {
    allowed[constr.fileMimeType] = constr.fileSize.max;
  });

  // Validate uploading file type
  const allowedMimeTypes = Object.keys(allowed);
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Не допустимый формат файла, разрешенные: ' + allowedMimeTypes.join(', '));
  }

  // Validate uploading file size not exceed the limit
  const maxSize = allowed[file.type as FileMimeType]!;
  if (file.size > maxSize) {
    throw new Error('Превышен максимально допустимый размер файла (байт): ' + maxSize);
  }

  const formData = new FormData();
  formData.append('file', file);

  const url = 'https://' + credentials.url;
  return await axios.postForm<UploadFileResponse>(url, formData);
};
