import { RussianPassportInformation } from '../../../../../generated';
import { useMemo } from 'react';
import type {
  PassportDetails,
  PassportFormValues,
} from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.component';

const russianFromDto = (information: RussianPassportInformation): RussianPassportInformation => {
  const number = `${information.serial ?? ''} ${information.number ?? ''}`;
  return {
    ...information,
    number,
  };
};

/**
 * Конвертирует DTO паспорта в объект значений формы (backend -> frontend)
 * @param information
 */
export function usePassportConverterFromDto(information: PassportDetails): PassportFormValues {
  return useMemo<PassportFormValues>(() => {
    const [name, lastName, surName] = information.fullName.split(' ');

    let countryRelated = { ...information };
    switch (countryRelated.country) {
      case 'russia':
        countryRelated = russianFromDto(countryRelated);
    }

    return {
      ...countryRelated,
      name,
      lastName,
      surName,
    };
  }, [information]);
}
