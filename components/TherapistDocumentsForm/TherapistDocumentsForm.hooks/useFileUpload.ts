import { FileMimeType, FilePurpose } from '../../../generated';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UploadingFilesServiceWithToken } from '../../../api/services';
import { useCallback, useMemo, useState } from 'react';
import { notification, UploadFile } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';

export type FusSuccessResponse = {
  token: string;
  uploadedFile: {
    metadata: {
      duration?: number;
      fileSize: number;
      mimeType: FileMimeType;
      resolution?: {
        height: number;
        width: number;
      };
    };
    originalFileName: string;
    s3: {
      object: string;
    };
    url: string;
  };
  version: number;
};

type FusErrorType =
  | 'file_too_large'
  | 'missing_file'
  | 'wrong_file_type'
  | 'media_has_wrong_resolution'
  | 'media_has_wrong_duration'
  | 'media_has_wrong_megapixels'
  | 'metadata_extraction_failure'
  | 'mime_type_detection_failure';

type FusErrorResponse = {
  type: FusErrorType;
  detail: string;
};

const queryKey = (purpose: string) => {
  return ['REQUEST_UPLOAD', purpose.toUpperCase()];
};

export type UseFileUploadOptions = {
  onUploadError?: (error?: FusErrorType) => void;
  onUploadSuccess?: (data: FusSuccessResponse) => void;
};

export function useFileUpload(purpose: FilePurpose, options?: UseFileUploadOptions) {
  const client = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<null | FusSuccessResponse>(null);

  const uploadLinkQuery = useQuery(
    queryKey(purpose),
    async () => {
      const resp = await UploadingFilesServiceWithToken.requestFileUploadUrl({
        requestBody: {
          arguments: {
            purpose,
          },
        },
      });

      resp.data.url = `https://` + resp.data.url;

      return resp;
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onError: (err: AxiosResponse) => {
        const type = err.data.data.error.type;
        notification.error({
          message: 'Получение ссылки',
          description: 'Не удалось получить ссылку для загрузки файла: ' + type,
        });
      },
    },
  );

  const uploadFile = useMutation(
    (file: UploadFile) => {
      const uploadTo = uploadLinkQuery.data?.data;

      if (!uploadTo) {
        throw new Error('Сначала необходимо получить данные для загрузки файла (requestUploadUrl)');
      } else if (!file.originFileObj) {
        throw new Error('В перадаваемом параметре отсутствует оригинальный дескриптор файла');
      }

      const form = new FormData();
      form.append('file', file.originFileObj);

      return axios.post(uploadTo.url, form);
    },
    {
      onError: (err: AxiosError<FusErrorResponse>) => {
        const errorType = err.response?.data.type;
        const errorText = String(errorType ?? err);
        notification.error({
          message: 'Загрузка файла',
          description: 'Не удалось загрузить файл: ' + errorText,
        });
        options?.onUploadError && options.onUploadError(err.response?.data.type);
      },
      onSuccess: (resp: AxiosResponse<FusSuccessResponse>) => {
        client.removeQueries(queryKey(purpose));
        client.setQueryData(queryKey(purpose), undefined);
        uploadLinkQuery.refetch();
        setUploadedFile(resp.data);
        options?.onUploadSuccess && options.onUploadSuccess(resp.data);
      },
    },
  );

  const requestUploadUrl = useCallback(() => {
    if (!uploadLinkQuery.data) {
      return uploadLinkQuery.refetch();
    }
    return uploadLinkQuery.data;
  }, [uploadLinkQuery]);

  return useMemo(() => {
    return {
      uploadLinkQuery,
      uploadFile,
      requestUploadUrl,
      uploadData: uploadLinkQuery.data?.data,
      uploadedFile,
    };
  }, [requestUploadUrl, uploadFile, uploadLinkQuery, uploadedFile]);
}
