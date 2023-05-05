/**
 * Преобразует дату в строку стандарта ISO 8601 с поправками, необходимыми для back-end'а;
 * @param {Date} date экземпляр даты
 */
export const dateToFormattedIso8601 = (date: Date): string => {
  return date.toISOString().slice(0, -5) + '+00:00';
};
