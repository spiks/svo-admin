import { FC } from 'react';
import NextImage, { ImageProps } from 'next/image';

export const Image: FC<ImageProps> = (props) => {
  return <NextImage {...props} />;
};
