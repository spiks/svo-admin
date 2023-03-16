import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import { CvText } from '@components/Cv/Cv.children/CvText.component';
import { CvContext } from '@components/Cv/Cv.component';

export const Important: FC = () => {
  const query = useContext(CvContext);
  const personalInformation = query.data!.personalInformation;
  const biography = personalInformation?.biography || '-';
  const creed = personalInformation?.creed || '-';

  return (
    <CvSection title={'Важное обо мне'}>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
        <CvSubTitle>Путь в профессии</CvSubTitle>
        <CvText>{biography}</CvText>
        <div style={{ height: '8px' }} />
        <CvSubTitle>Твое профессиональное кредо</CvSubTitle>
        <CvText>{creed}</CvText>
      </div>
    </CvSection>
  );
};
