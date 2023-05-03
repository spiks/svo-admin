import { appointmentStatusTranslations } from '../../../constants/appointmentStatusTranslations';
import { differenceInMinutes } from 'date-fns';
import { AppointmentEndsAt, AppointmentStartsAt, AppointmentStatus, Uuid } from '../../../generated';

export type AppointmentListingPreview = {
  appointmentId: Uuid;
  endsAt: AppointmentEndsAt;
  patientId: Uuid;
  price: {
    amount: number;
  };
  startsAt: AppointmentStartsAt;
  status: AppointmentStatus;
  therapistId: Uuid;
};

export function appointmentToGridView(it: AppointmentListingPreview) {
  return {
    ...it,
    date: new Date(it.startsAt).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    therapist: { id: it.therapistId, fullName: 'Иван Сергеев' },
    status: appointmentStatusTranslations[it.status],
    price: `${Intl.NumberFormat('ru-RU').format(it.price.amount)} ₽`,
    duration: `${differenceInMinutes(new Date(it.endsAt), new Date(it.startsAt))} минут`,
    appointment: it,
  };
}

export type AppointmentGridView = ReturnType<typeof appointmentToGridView>;
