/**
 * Собирает из модели имени (backend) полное имя
 * @param obj - любой объект имеющий `name`, `surname` и `patronymic` поля
 * @returns string ФИО или Аноним
 */
export function extractFullName(obj: { name: string | null; surname: string | null; patronymic: string | null }) {
  const fullName = [obj.name, obj.surname, obj.patronymic].filter(Boolean).join(' ').trim();
  return fullName ? fullName : 'Аноним';
}
