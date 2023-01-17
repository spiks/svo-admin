export type DocumentStatus = 'approved' | 'rejected' | 'pending' | 'not_arrived' | 'unknown';

export const DocumentStatusSpelling: Record<DocumentStatus, string> = {
  approved: 'Подтверждён',
  rejected: 'Отклонён',
  pending: 'Ожидает проверки',
  not_arrived: 'Не получен',
  unknown: 'Неизвестно',
};
