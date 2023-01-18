import { useCallback } from 'react';
import { SubmitDiplomaOfHigherEducation } from '../../../../../generated';
import { DiplomaFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/DiplomaForm/DiplomaForm.component';

export function useDiplomaFromLocalToSubmitDtoConverter() {
  return useCallback((diploma: DiplomaFormValues): SubmitDiplomaOfHigherEducation => {
    const document = diploma.document.find(Boolean);
    if (!document?.response) {
      throw new Error('Невозможно преобразовать файл в DTO создания диплом без токена файла документа.');
    }

    return {
      document: document.response?.token,
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
