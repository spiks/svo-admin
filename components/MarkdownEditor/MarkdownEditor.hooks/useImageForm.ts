import { Form, FormProps, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import {
  FusSuccessResponse,
  useFileUpload,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useFileUpload';
import { useDocumentConstraints } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useDocumentConstraints';
import { REGEXP_URL } from '../../../constants/regexp';
import { useEffect } from 'react';

export type UseImageFormParams = {
  onSuccess?: (link: string) => void;
};

export type ImageFormValue = {
  url: string;
  image: UploadFile<FusSuccessResponse | undefined>[];
};

export function useImageForm({ onSuccess }: UseImageFormParams = {}) {
  const [form] = Form.useForm<ImageFormValue>();
  const url = Form.useWatch('url', form);
  const imageFileList = Form.useWatch('image', form);
  const { uploadData } = useFileUpload('article_cover');
  const validateDocument = useDocumentConstraints(uploadData?.constraints);

  useEffect(() => {
    if (url) {
      form.setFields([
        {
          name: 'image',
          errors: [],
        },
      ]);
    } else if (imageFileList) {
      form.setFields([
        {
          name: 'url',
          errors: [],
        },
      ]);
    }
  }, [url, imageFileList, form]);

  const urlValidator = {
    async validator(_: unknown, value: string) {
      if (!REGEXP_URL.test(value) && value) {
        throw new Error('Неверный формат URL');
      }
    },
  };

  const imageValidator = {
    async validator(_: unknown, value: RcFile[]) {
      value?.forEach((file) => {
        const message = validateDocument(file);
        if (typeof message !== 'boolean') {
          throw new Error(message);
        }
      });
    },
  };

  const onFinish: FormProps<ImageFormValue>['onFinish'] = (values) => {
    if (!onSuccess) {
      return;
    }

    const url = !!values.image?.length ? values.image[0].response?.uploadedFile.url : values.url;
    if (!url) {
      return;
    }

    onSuccess(url as string);
  };

  return {
    form,
    imageValidator,
    urlValidator,
    imageUploadUrl: uploadData?.url,
    image: imageFileList && imageFileList[0],
    url,
    submit: onFinish,
  };
}
