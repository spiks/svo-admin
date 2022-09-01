import { TherapistProfileStatus } from '../../generated';
import { DocumentProps } from '../Document/Document.component';

/**
 * Возвращает отображаемый стиль для компонента <Document/> в контексте решения модератора касательно подписанного контракта терапевта
 * @param status - Статус профиля пользователя
 */
export const getSignedContractStyle = (status: TherapistProfileStatus): DocumentProps['style'] => {
  switch (status) {
    case 'contract_rejected':
      return 'rejected';
    case 'contract_awaiting_review':
      return 'pending';
    case 'contract_not_submitted_yet':
      return 'empty';
    default:
      throw new Error('Не корректный статус терапевта: ' + status);
  }
};
