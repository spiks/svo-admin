import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import { CvEntry } from '@components/Cv/Cv.children/CvEntry.component';
import styles from '../Cv.module.css';
import { CvText } from '@components/Cv/Cv.children/CvText.component';
import { CvContext } from '@components/Cv/Cv.component';
import { Passport } from '../../../generated';

const countryMap: Record<Passport['information']['country'], string> = {
  kazakhstan: 'Республика Казахстан',
  russia: 'Российская Федерация',
  armenia: 'Республика Армения',
  belarus: 'Республика Беларусь',
  kyrgyzstan: 'Киргизская Республика',
};

const genderMap: Record<Passport['information']['gender'], string> = {
  male: 'Мужской',
  female: 'Женский',
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString('ru-RU', {
    // you can use undefined as first argument
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatPassportNumber = (information: Passport['information']) => {
  if ('serial' in information) {
    return `${information.serial} ${information.number}`;
  } else if ('type' in information) {
    return `${information.type} ${information.number}`;
  } else {
    return '-';
  }
};

export const Personal: FC = () => {
  const query = useContext(CvContext);

  const documents = query.data!.documents;
  const passport = documents?.passport;
  const snils = documents?.snils;
  const inn = documents?.inn;
  const diplomas = documents?.diploma;

  const residence = (passport && 'residence' in passport.information && passport.information.residence) || '-';

  return (
    <CvSection title={'Личные данные'}>
      <table>
        <tr className={styles['row-8']}>
          <td>
            <CvSubTitle>Паспорт</CvSubTitle>
          </td>
        </tr>
        <tr className={styles['row-8']}>
          <td className={styles['cell-130']}>
            <CvEntry title={'Фамилия'} value={passport?.information.surname || '-'} />
          </td>
          <td className={styles['cell-130']}>
            <CvEntry title={'Имя'} value={passport?.information.name || '-'} />
          </td>
          <td className={styles['cell-130']}>
            <CvEntry title={'Отчество'} value={passport ? passport.information.patronymic || '-' : '-'} />
          </td>
        </tr>
        <tr className={styles['row-8']}>
          <td className={styles['cell-130']}>
            <CvEntry title={'Гражданство'} value={passport ? countryMap[passport.information.country] : '-'} />
          </td>
          <td className={styles['cell-130']}>
            <CvEntry title={'Пол'} value={passport ? genderMap[passport.information.gender] : '-'} />
          </td>
          <td className={styles['cell-130']}>
            <CvEntry title={'Дата рождения'} value={passport ? formatDate(passport.information.birthday) : '-'} />
          </td>
        </tr>
        <tr className={styles['row-8']}>
          <td className={styles['cell-130']} style={{ whiteSpace: 'nowrap' }}>
            <CvEntry title={'Серия и номер'} value={passport ? formatPassportNumber(passport.information) : '-'} />
          </td>
          <td className={styles['cell-130']}>
            <CvEntry title={'Дата выдачи'} value={passport ? formatDate(passport.information.issuedAt) : '-'} />
          </td>
          {passport && 'issuerId' in passport.information ? (
            <td className={styles['cell-130']}>
              <CvEntry title={'Код подразделения'} value={passport.information.issuerId} />
            </td>
          ) : null}
        </tr>
      </table>
      <div style={{ display: 'flex', columnGap: '4px', paddingBottom: '8px' }}>
        <div style={{ width: '45px', flexShrink: 0 }}>
          <CvText>Кем выдан:</CvText>
        </div>
        <CvSubTitle>{passport ? passport.information.issuerName : '-'}</CvSubTitle>
      </div>
      <div style={{ display: 'flex', columnGap: '4px', paddingBottom: '16px' }}>
        <div style={{ width: '75px', flexShrink: 0 }}>
          <CvText>Адрес регистрации</CvText>
        </div>
        <CvSubTitle>{residence}</CvSubTitle>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px', marginBottom: '16px' }}>
        <CvSubTitle>СНИЛС</CvSubTitle>
        <CvEntry title={'Номер СНИЛС'} value={snils ? snils.information.number : '-'} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px', marginBottom: '16px' }}>
        <CvSubTitle>ИНН</CvSubTitle>
        <CvEntry title={'Номер ИНН'} value={inn ? inn.information.number : '-'} />
      </div>
      {diplomas.map((diploma) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }} key={diploma.id}>
            <CvSubTitle>Документ об образовании</CvSubTitle>
            <div style={{ display: 'flex', columnGap: '4px', paddingBottom: '8px' }}>
              <div style={{ flexShrink: 0 }}>
                <CvText>Наименование высшего учебного заведения:</CvText>
              </div>
              <CvSubTitle>{diploma.information.educationalInstitution}</CvSubTitle>
            </div>
            <div style={{ display: 'flex', columnGap: '4px', paddingBottom: '8px' }}>
              <div style={{ flexShrink: 0 }}>
                <CvText>Специальность:</CvText>
              </div>
              <CvSubTitle>{diploma.information.speciality}</CvSubTitle>
            </div>
            <table>
              <tr>
                <td style={{ width: '208px' }}>
                  <CvEntry title={'Год выпуска'} value={diploma.information.graduationYear.toString() || '-'} />
                </td>
                <td style={{ width: '208px' }}>
                  <CvEntry title={'Серия номер'} value={diploma.information.serialAndNumber} />
                </td>
              </tr>
            </table>
          </div>
        );
      })}
    </CvSection>
  );
};
