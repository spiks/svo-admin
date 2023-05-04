import { AppointmentStatus } from '../generated';

export const getAppointmentStatusTranslations = (appointmentStatus: AppointmentStatus, startAt: string) => {
  switch (appointmentStatus) {
    case 'booked': {
      return 'Забронирована';
    }
    case 'booking_canceled_by_timeout': {
      return 'Отменена по таймауту';
    }
    case 'booking_canceled_by_unsuccessful_payment': {
      return 'Отменена из-за неуспешной оплаты';
    }
    case 'booking_canceled_without_payment': {
      return 'Отменена без оплаты';
    }
    case 'cancelled_by_patient': {
      return 'Отменена пациентом';
    }
    case 'cancelled_by_therapist': {
      return 'Отменена терапевтом';
    }
    case 'completed': {
      return 'Завершена';
    }
    case 'nobody_came': {
      return 'Никто не пришел';
    }
    case 'paid': {
      return new Date(startAt) > new Date() ? 'Предстоящая' : 'Текущая';
    }
    case 'patient_not_came': {
      return 'Пациент не пришел';
    }
    case 'therapist_not_came': {
      return 'Терапевт не пришел';
    }
    case 'cancelled_by_admin': {
      return 'Отменена администратором';
    }
    case 'booking_canceled_without_payment_by_admin': {
      return 'Отменена администратором (не была оплачена)';
    }
  }
};
