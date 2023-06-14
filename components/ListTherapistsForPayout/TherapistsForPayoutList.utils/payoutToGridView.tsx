import { PayoutSchema } from 'generated/models/PayoutSchema';

const appointmentType = {
  pair: 'Парный',
  individual: 'Индивидуальный',
};

export const payoutToGridView = (it: PayoutSchema) => {
  const fullName = [it.patient.surname, it.patient.name].filter(Boolean).join(' ').trim();
  return {
    ...it,
    date: new Date(it.appointmentEndsAt).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
    }),
    amount: `${Intl.NumberFormat('ru-RU').format(it.amount.amount)} \u20bd`,
    patient: { avatar: it.patient.avatar, fullName },
    appointmentType: appointmentType[it.appointmentType],
    therapistProfit: `${Intl.NumberFormat('ru-RU').format(it.therapistProfit.amount)} \u20bd`,
  };
};

export type PayoutGridView = ReturnType<typeof payoutToGridView>;
