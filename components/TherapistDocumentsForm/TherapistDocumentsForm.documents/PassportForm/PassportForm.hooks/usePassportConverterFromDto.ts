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
  surName: '',
  lastName: '',
  issuedAt: moment(),
  issuerName: '',
  number: '',
  placeOfBirth: '',
  name: '',
  country: 'russia',
  gender: 'male',
  birthday: moment(),
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

    const [name, lastName, surName] = information.fullName.split(' ');

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
