import { AccountProfiles, PatientListingPreview } from '../generated';

const profileTypeTranslations: Record<AccountProfiles, string> = {
  admin: 'Администратор',
  therapist: 'Терапевт',
  patient: 'Пациент',
};

export function toGridView(it: PatientListingPreview) {
  return {
    ...it,
    id: it.id,
    profiles: it.profiles
      .map((it) => {
        return profileTypeTranslations[it];
      })
      .join(' '),
  };
}

export type GridView = ReturnType<typeof toGridView>;
