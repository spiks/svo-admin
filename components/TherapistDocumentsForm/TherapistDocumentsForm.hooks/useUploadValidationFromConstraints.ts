import { FileUploadCredentials } from '../../../generated';
import { useCallback } from 'react';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Байт';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function useUploadPersonalDocumentConstraints(constraints?: FileUploadCredentials['constraints']) {
  return useCallback(
    (file: { size: number; type: string }) => {
      const typeRules = constraints?.find((rules) => {
        return rules.fileMimeType === file.type;
      });

      if (!typeRules) {
        const allTypes = constraints?.map((rules) => {
          return rules.fileMimeType.split('/')[1]!;
        });
        return `Допустимые форматы файла ${allTypes}!`;
      }

      const maxSize = typeRules.fileSize.max;
      if (file.size > maxSize) {
        return `Максимальный размер файла ${formatBytes(maxSize)}!`;
      }

      return true;
    },
    [constraints],
  );
}
