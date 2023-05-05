import { AppointmentSlotAvailableForAppointment } from '../../../generated';
import { differenceInMinutes } from 'date-fns';

export const getBundlesFromSlots = (
  slots: AppointmentSlotAvailableForAppointment[] | undefined,
  bundleSize: number,
) => {
  if (!slots?.length) {
    return null;
  }

  const bundles = slots
    .map((it) => new Date(it.startsAt))
    .map((startSlot, index, array) => {
      const rest = array.slice(index + 1);

      const bundle = [startSlot];

      let prev: Date = startSlot;
      let count = 1;
      for (const slot of rest) {
        const diff = Math.abs(differenceInMinutes(prev, slot));
        const isContinuingOrder = diff === 30 && count < bundleSize;

        count += 1;
        prev = slot;

        if (!isContinuingOrder) {
          break;
        }

        bundle.push(slot);
      }

      if (bundle.length < bundleSize) {
        return undefined;
      }

      return bundle;
    })
    .filter(Boolean);

  // Может быть такое, что в последней группе было недостаточное количество слотов
  return bundles.filter((bundle) => {
    // Оставляем только те группы, количество которых соответствует выбранной длительности сеанса
    return bundle?.length === bundleSize;
  });
};
