import { useQuery } from '@tanstack/react-query';
import { getTherapistById } from '../../api/therapist/getTherapistById';
import { getTherapistServicePricing } from '../../api/therapist/getTherapistServicePricing';
import { getTherapistDocuments } from '../../api/therapist/getTherapistDocuments';
import { getTherapistSocialLinks } from '../../api/therapist/getTherapistSocialLinks';
import { getTherapistVideoPresentation } from '../../api/therapist/getTherapistVideoPresentation';

export function useCv(therapistId: string) {
  return useQuery(['CV', therapistId], async () => {
    const personalInformation = await getTherapistById(therapistId);
    const servicePricing = await getTherapistServicePricing(therapistId);
    const documents = await getTherapistDocuments(therapistId);
    const socialLinks = await getTherapistSocialLinks(therapistId);
    const presentation = await getTherapistVideoPresentation(therapistId);

    return {
      personalInformation: personalInformation.data,
      servicePricing: servicePricing.data,
      documents: documents,
      socialLinks: socialLinks.data,
      presentation: presentation.data,
    };
  });
}
