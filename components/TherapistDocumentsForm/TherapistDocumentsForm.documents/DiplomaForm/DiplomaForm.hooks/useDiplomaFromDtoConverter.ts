import { useCallback } from 'react';
import { DiplomaOfHigherEducation } from '../../../../../generated';
import { LocalDiploma } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import moment from 'moment';
import { getUploadFileFromStaticFile } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getUploadFileFromStaticFile';

export function useDiplomaFromDtoConverter() {
  return useCallback((diploma: DiplomaOfHigherEducation): LocalDiploma => {
    return {
      id: diploma.id,
      document: [getUploadFileFromStaticFile(diploma.document)],
      information: {
        ...diploma.information,
        graduationYear: moment(0).year(diploma.information.graduationYear),
      },
      isApprovedByModerator: diploma.isApprovedByModerator,
    };
  }, []);
}
