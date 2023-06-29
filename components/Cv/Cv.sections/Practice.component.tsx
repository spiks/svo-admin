import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import styles from '@components/Cv/Cv.module.css';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import { CvEntry } from '@components/Cv/Cv.children/CvEntry.component';
import { Tag } from 'antd';
import { CvContext } from '@components/Cv/Cv.component';

export const Practice: FC = () => {
  const query = useContext(CvContext);

  const personalInformation = query.data!.personalInformation;
  const employments = personalInformation.employments;
  const specs = personalInformation.problems;
  const addSpecs = personalInformation.additionalSpecializations;

  const formatedSpecs = specs
    .flatMap((problem) => {
      if (problem.type === 'me_and_partner') {
        return problem.items;
      } else {
        return problem.problemGroups.flatMap((group) => {
          return group.items;
        });
      }
    })
    .filter((item) => {
      return item.isSelected;
    })
    .map((item) => {
      return item.name;
    })
    .join(', ');

  return (
    <CvSection title={'Практика и специализации'}>
      <table style={{ marginBottom: '8px' }}>
        <tr className={styles['row-8']}>
          <td style={{ width: '300px' }}>
            <CvSubTitle>Профильный опыт и место работы</CvSubTitle>
          </td>
        </tr>
        {employments.map((employ) => {
          return (
            <tr className={styles['row-8']} key={employ.companyName}>
              <td style={{ width: '200px' }}>
                <CvEntry title={'Место работы'} value={employ.companyName} />
              </td>
              <td style={{ width: '200px' }}>
                <CvEntry title={'Профильный опыт работы'} value={`${employ.years} лет`} />
              </td>
            </tr>
          );
        })}
      </table>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px', marginBottom: '16px' }}>
        <CvSubTitle>Специализации</CvSubTitle>
        <CvEntry title={'Основная специализация'} value={formatedSpecs} />
        <CvEntry title={'Дополнительная специализация'} value={addSpecs ? addSpecs : '-'} />
      </div>
    </CvSection>
  );
};
