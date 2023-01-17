import { TherapistServiceWithToken } from 'api/services';
import { CreedLongDescription, LongDescription, Uuid } from 'generated';

type TherapistBiographyAndCreed = {
  therapistId: Uuid;
  biography: LongDescription | null;
  creed: CreedLongDescription | null;
};

export const updateTherapistBiographyAndCreed = async (request: TherapistBiographyAndCreed) => {
  return await TherapistServiceWithToken.updateTherapistBiographyAndCreed({
    requestBody: { arguments: request },
  });
};
