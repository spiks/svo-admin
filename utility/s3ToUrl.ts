export const s3ToUrl = (s3url?: string | null) => {
  if (!s3url) {
    return '';
  }
  return s3url.replace('s3://', 'https://storage.yandexcloud.net/');
};
