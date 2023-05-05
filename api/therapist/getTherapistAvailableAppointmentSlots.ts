import { TherapistServiceWithToken } from '../services';
import { getTimeZone } from '../../helpers/getTimeZone';

export const getTherapistAvailableAppointmentSlots = (therapistId: string, month: number, year: number) => {
  const timezone = getTimeZone(new Date());
  return TherapistServiceWithToken.getTherapistAvailableAppointmentSlots({
    requestBody: {
      arguments: {
        therapistId,
        date: {
          month,
          year,
        },
        timezone,
      },
    },
  });
};
