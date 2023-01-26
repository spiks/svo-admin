import { useCallback } from 'react';
import { RussianDiplomaOfHigherEducation } from '../../../../../generated';
import { DiplomaFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/DiplomaForm/DiplomaForm.component';

export function useDiplomaFormConverter() {
  return useCallback((diploma: Omit<DiplomaFormValues, 'document' | 'id'>): RussianDiplomaOfHigherEducation => {
    return {
      graduationYear: diploma.graduationYear.year(),
      speciality: diploma.speciality,
      serialAndNumber: diploma.serialAndNumber,
      educationalInstitution: diploma.educationalInstitution,
      country: diploma.country,
    };
  }, []);
}
