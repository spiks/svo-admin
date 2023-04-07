import { AppointmentStatus } from '../generated';

export const appointmentStatusTranslations: Record<AppointmentStatus, string> = {
  booked: 'Забронирован',
  booking_canceled_by_timeout: 'Отменен по таймауту',
  booking_canceled_by_unsuccessful_payment: 'Отменен из-за неуспешной оплаты',
  booking_canceled_without_payment: 'Отменен без оплаты',
  cancelled_by_patient: 'Отменен пациентом',
  cancelled_by_therapist: 'Отменен терапевтом',
  completed: 'Завершен',
  nobody_came: 'Никто не пришел',
  paid: 'Предстоящий',
  patient_not_came: 'Пациент не пришел',
  therapist_not_came: 'Терапевт не пришел',
};
