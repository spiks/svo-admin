import { StaticFile } from '../../../generated';
import { UploadFile } from 'antd';

export function getUploadFileFromStaticFile(staticFile: StaticFile, uid: string = '-1'): UploadFile {
  return {
    uid,
    name: staticFile.originalFileName,
    size: staticFile.fileSize,
    type: staticFile.mimeType,
    url: staticFile.url,
    status: 'done',
  };
}
