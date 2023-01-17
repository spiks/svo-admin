import { VideoPresentationWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { Uuid, VideoPresentation } from 'generated';

export const getTherapistVideoPresentation = (therapistId: Uuid): ApiResponseSuccess<VideoPresentation> => {
  return VideoPresentationWithToken.getTherapistVideoPresentation({ requestBody: { arguments: { therapistId } } });
};
