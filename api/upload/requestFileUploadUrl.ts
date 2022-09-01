import { UploadingFilesServiceWithToken } from '../services';
import { FilePurpose } from '../../generated';

export const requestFileUploadUrl = async (purpose: FilePurpose) => {
  return UploadingFilesServiceWithToken.requestFileUploadUrl({
    requestBody: {
      arguments: {
        purpose,
      },
    },
  });
};
