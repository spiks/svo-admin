import { useCallback } from 'react';
import { SubmitDiplomaOfHigherEducation } from '../../../../../generated';
import { DiplomaFormValues } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/DiplomaForm/DiplomaForm.component';

export function useDiplomaFromLocalToSubmitDtoConverter() {
  return useCallback((diploma: DiplomaFormValues): SubmitDiplomaOfHigherEducation => {
    if (!diploma.documentToken) {
      throw new Error('Невозможно преобразовать файл в DTO создания диплом без токена файла документа.');
    }

    return {
      document: diploma.documentToken,
      information: {
        graduationYear: diploma.graduationYear.year(),
        speciality: diploma.speciality,
        serialAndNumber: diploma.serialAndNumber,
        educationalInstitution: diploma.educationalInstitution,
        country: diploma.country,
      },
    };
  }, []);
}
