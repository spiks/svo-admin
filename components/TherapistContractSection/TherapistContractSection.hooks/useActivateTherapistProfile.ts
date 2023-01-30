import { useTherapistDiplomas } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import { useTherapistInn } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistInn';
import { useTherapistPassport } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistPassport';
import { useTherapistSnils } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistSnils';
import { notification } from 'antd';
import { finishTherapistDocumentModeration } from 'api/therapist/finishTherapistDocumentModeration';
import { useContractsQuery } from 'hooks/useContractsQuery';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { useCallback, useMemo } from 'react';

export function useActivateTherapistProfile(therapistId: string) {
  const { passport } = useTherapistPassport(therapistId);
  const { snils } = useTherapistSnils(therapistId);
  const { inn } = useTherapistInn(therapistId);
  const { diplomas } = useTherapistDiplomas(therapistId);
  const { signedContract } = useContractsQuery(therapistId);
  const refetch = useTherapistSignupQueriesRefresh(therapistId);

  const isDocumentsApproved = useMemo(() => {
    return Object.values({ passport: passport, snils: snils, inn: inn }).every((doc) => {
      return doc?.isApprovedByModerator;
    });
  }, [passport, snils, inn]);

  const isDiplomaApproved = useMemo(() => {
    return diplomas?.some((diploma) => {
      return diploma.isApprovedByModerator;
    });
  }, [diplomas]);

  const canActivateTherapistProfile = useMemo(() => {
    return isDocumentsApproved && isDiplomaApproved && Boolean(signedContract);
  }, [isDiplomaApproved, isDocumentsApproved, signedContract]);

  const activateTherapistProfile = useCallback(async () => {
    try {
      await finishTherapistDocumentModeration(therapistId);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Профиль терапевта активирован',
      });
      refetch('therapist');
    } catch (e) {
      notification.success({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось активировать профиль терапевта',
      });
    }
  }, [refetch, therapistId]);

  return useMemo(() => {
    return {
      canActivateTherapistProfile,
      activateTherapistProfile,
    };
  }, [canActivateTherapistProfile, activateTherapistProfile]);
}
