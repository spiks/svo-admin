import { useMemo, useState } from 'react';
import { RcFile } from 'antd/lib/upload';
import { FormInstance, Upload, UploadFile } from 'antd';
import { RuleObject } from 'rc-field-form/es/interface';

/**
 * Используем для полей в форме принимающих только один файл
 * ВАЖНО: не забудьте на onRemove (<Upload/>) выполнять reset!
 * P.S. этот хук решение проблемы на скорую руку,
 * по хорошему реализовать HOC над Upload'ом который дружит
 * с архитектурой нашего API
 */
export function useRequiredUploadFormItem(
  form: FormInstance,
  fieldName: string,
  // string - ошибка валидации, выводим это сообщение пользователю
  // true - файл соответствует ограничениям
  documentValidator: (file: { size: number; type: string }) => string | true,
) {
  // null - пользователь не пытался загружать файл
  // false - пользователь закончил загрузку файла
  // true - пользователь успешно загрузил файл
  const [isUploadFinished, setIsUploadFinished] = useState<null | boolean>(null);

  return useMemo(() => {
    return {
      reset: setIsUploadFinished.bind(null, null),
      isUploadFinished,
      formItemProps: {
        getValueFromEvent(e: unknown) {
          if (Array.isArray(e)) {
            return e;
          }
          const fileList = e && (e as { fileList?: unknown[] }).fileList;
          return fileList || [];
        },
        valuePropName: 'fileList',
        rules: [
          {
            async validator(_: RuleObject, value: UploadFile[]) {
              value?.forEach((file) => {
                if (file.response) {
                  setIsUploadFinished(true);
                }
              });
            },
          },
        ],
      },
      uploadProps: {
        headers: { 'X-Requested-With': null } as unknown as { [key: string]: string },
        beforeUpload(file: RcFile) {
          const message = documentValidator(file);
          const canUpload = typeof message === 'boolean';

          if (!canUpload && typeof message === 'string') {
            form.setFields([
              {
                name: fieldName,
                errors: [message],
              },
            ]);
          } else {
            // Сбрасываем ошибки, когда все ограничения соблюдены
            form.setFields([
              {
                name: fieldName,
                errors: [],
              },
            ]);
            setIsUploadFinished(false);
          }

          return canUpload || Upload.LIST_IGNORE;
        },
      },
    };
  }, [documentValidator, fieldName, form, isUploadFinished]);
}
