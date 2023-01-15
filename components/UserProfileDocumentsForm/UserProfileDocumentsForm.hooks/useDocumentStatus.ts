import { useCallback } from 'react';
import { DocumentStatus } from '@components/UserProfileDocumentsForm/TherapistDocumentsForm.const';

export function useDocumentStatus() {
  return useCallback((document?: { isApprovedByModerator?: boolean | null } | null): DocumentStatus => {
    if (!document) {
      return 'not_arrived';
    } else if (document?.isApprovedByModerator === null) {
      return 'pending';
    } else if (document?.isApprovedByModerator === false) {
      return 'rejected';
    }
    return 'approved';
  }, []);
}
