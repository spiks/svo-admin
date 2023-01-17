import { TherapistServiceWithToken } from 'api/services';
import { LongDescription, TherapistService, Uuid } from 'generated';

type TherapistWorkPrinciplesType = {
  therapistId: Uuid;
  workPrinciples: LongDescription | null;
};

export const updateTherapistWorkPrinciples = async (request: TherapistWorkPrinciplesType) => {
  return await TherapistServiceWithToken.updateTherapistWorkPrinciples({ requestBody: { arguments: request } });
};
