import { AccountProfiles, PatientListingPreview } from '../generated';

const profileTypeTranslations: Record<AccountProfiles, string> = {
  admin: 'Администратор',
  therapist: 'Терапевт',
  patient: 'Пациент',
};

export function toGridView(it: PatientListingPreview) {
  return { ...it, profiles: it.profiles.map((it) => profileTypeTranslations[it]).join(' ') };
}

export type GridView = ReturnType<typeof toGridView>;
