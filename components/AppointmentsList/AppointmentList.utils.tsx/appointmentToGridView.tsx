import { differenceInMinutes } from 'date-fns';
import { AppointmentServiceWithToken } from '../../../api/services';

export type AppointmentListingPreview = Awaited<
    ReturnType<typeof AppointmentServiceWithToken.listAppointments>
>['data']['items'][0];

export function appointmentToGridView(it: AppointmentListingPreview) {
  const fullName = [it.therapist.surname, it.therapist.name].filter(Boolean).join(' ').trim();

  return {
    ...it,
    date: new Date(it.startsAt).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    // @ts-ignore
    therapist: { id: it.therapist.id, fullName },
    price: `${Intl.NumberFormat('ru-RU').format(it.price.amount)} \u20bd`,
    duration: `${differenceInMinutes(new Date(it.endsAt), new Date(it.startsAt))} минут`,
  };
}

export type AppointmentGridView = ReturnType<typeof appointmentToGridView>;
