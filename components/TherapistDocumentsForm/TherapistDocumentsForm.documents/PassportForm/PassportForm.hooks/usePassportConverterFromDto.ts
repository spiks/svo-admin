import { RussianPassportInformation, StaticFile } from '../../../../../generated';
import { useMemo } from 'react';
import type {
  PassportDetails,
  PassportFormValues,
} from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.component';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';
import moment from 'moment';

const russianFromDto = (information: RussianPassportInformation): RussianPassportInformation => {
  const number = `${information.serial ?? ''} ${information.number ?? ''}`;
  return {
    ...information,
    number,
  };
};

const cleanValues: PassportFormValues = {
  surname: '',
  patronymic: '',
  issuedAt: moment(),
  issuerName: '',
  number: '',
  name: '',
  country: 'russia',
  gender: 'male',
  birthday: moment().subtract(1, 'day'),
  document: [],
};

/**
 * Конвертирует DTO паспорта в объект значений формы (backend -> frontend)
 * @param information
 * @param document
 */
export function usePassportConverterFromDto(information?: PassportDetails, document?: StaticFile | null) {
  return useMemo<PassportFormValues>(() => {
    if (!information) {
      return cleanValues;
    }

    const [name, lastName, surName] = [information.name, information.surname, information.patronymic];

    let countryRelated = { ...information };
    switch (countryRelated.country) {
      case 'russia':
        countryRelated = russianFromDto(countryRelated);
    }

    return {
      ...countryRelated,
      issuedAt: moment(countryRelated.issuedAt, 'YYYY-MM-DD'),
      birthday: moment(countryRelated.birthday, 'YYYY-MM-DD'),
      name,
      lastName,
      surName,
      document: document ? [getUploadFileFromStaticFile(document)] : [],
    };
  }, [document, information]);
}
