import React, { FC } from 'react';
import { CvText } from '@components/Cv/Cv.children/CvText.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';

export const CvEntry: FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <div
      style={{
        display: 'flex',
        columnGap: '4px',
      }}
    >
      <CvText>{title}:</CvText>
      <CvSubTitle>{value}</CvSubTitle>
    </div>
  );
};
