import { VideoPresentationWithToken } from 'api/services';
import { Uuid, VideoPresentation } from 'generated';

export const updateTherapistVideoPresentation = async (therapistId: Uuid, videoPresentation: VideoPresentation) => {
  return await VideoPresentationWithToken.updateTherapistVideoPresentation({
    requestBody: { arguments: { therapistId, videoPresentation } },
  });
};
