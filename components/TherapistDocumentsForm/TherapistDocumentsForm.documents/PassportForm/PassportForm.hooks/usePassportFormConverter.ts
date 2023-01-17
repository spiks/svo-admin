import { PassportFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.component';
import { RussianPassportInformation, UpdateTherapistPassport } from '../../../../../generated';
import { useCallback } from 'react';

/**
 * Конвертирует объект значений формы в DTO паспорта (frontend -> backend)
 */
export function usePassportFormConverter() {
  return useCallback((formValues: PassportFormValues): UpdateTherapistPassport['information'] => {
    const values: Partial<UpdateTherapistPassport['information']> = {};
    values.fullName = [formValues.name, formValues.lastName, formValues.surName].filter(Boolean).join(' ');

    switch (formValues.country) {
      case 'russia': {
        const passport = { ...formValues, ...values } as RussianPassportInformation;
        const [serial, number] = formValues.number.split(' ');
        passport.serial = serial;
        passport.number = number;
        return passport;
      }
    }

    return values as UpdateTherapistPassport['information'];
  }, []);
}
