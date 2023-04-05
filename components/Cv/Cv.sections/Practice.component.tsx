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
  const specs = personalInformation.specializations;
  const addSpecs = personalInformation.additionalSpecializations;
  const specTags = personalInformation.specializationTags;

  const formatedSpecs = specs
    .flatMap((spec) => {
      return spec.items;
    })
    .filter((item) => {
      return item.isSelected;
    })
    .map((item) => {
      return item.name;
    })
    .join(', ');

  const formatedTags = specTags
    .flatMap((group) => {
      return group.items;
    })
    .filter((tag) => {
      return tag.isSelected;
    });

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
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
        <CvSubTitle>Мои теги</CvSubTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formatedTags.length
            ? formatedTags.map((tag) => {
                return (
                  <Tag style={{ fontSize: '8px', marginLeft: '-3px' }} key={tag.id}>
                    {tag.name}
                  </Tag>
                );
              })
            : '-'}
        </div>
      </div>
    </CvSection>
  );
};
