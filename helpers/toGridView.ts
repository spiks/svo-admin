import { AccountProfiles, PatientListingPreview } from '../generated';

const profileTypeTranslations: Record<AccountProfiles, string> = {
  admin: 'Администратор',
  therapist: 'Терапевт',
  patient: 'Пациент',
};

export function toGridView(it: PatientListingPreview) {
  const fullName = [it.surname, it.name].filter(Boolean).join(' ').trim();
  return {
    ...it,
    fullName: fullName || 'Аноним',
    id: it.id,
    key: it.id,
    profiles: it.profiles
      .map((it) => {
        return profileTypeTranslations[it.profile];
      })
      .join(' '),
  };
}

export type GridView = ReturnType<typeof toGridView>;
