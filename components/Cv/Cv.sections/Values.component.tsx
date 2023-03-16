import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import { CvText } from '@components/Cv/Cv.children/CvText.component';
import { CvContext } from '@components/Cv/Cv.component';

export const Values: FC = () => {
  const query = useContext(CvContext);
  const personalInformation = query.data!.personalInformation;
  const workPrinciples = personalInformation?.workPrinciples || '-';

  return (
    <CvSection title={'Профессиональные ценности'}>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
        <CvSubTitle>Профессиональные ценности и принципы работы</CvSubTitle>
        <CvText>{workPrinciples}</CvText>
      </div>
    </CvSection>
  );
};
