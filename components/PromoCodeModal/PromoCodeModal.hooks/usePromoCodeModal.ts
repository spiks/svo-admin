import { PromoCodeId } from 'generated';
import { useState } from 'react';

export type PromoCodeModalType = 'edit' | 'add';

/**
 * Модальное окно для работы с добавлением/редактированием промокода
 */
export const usePromoCodeModal = () => {
  /**
   * Флаг, соответствующий типу открытого модального окна для добавления/редактирования промокода
   *
   * В единицу времени, может быть открыто только одно модальное окно:
   * edit - модальное окно открыто на редактирование промокода
   * add - модальное окно открыто на добавление промокода
   * undefined - модальное окно закрыто
   */
  const [promoCodeModalType, setPromoCodeModalType] = useState<PromoCodeModalType | undefined>();
  const [editablePromoCodeId, setEditablePromoCodeId] = useState<PromoCodeId | undefined>();

  const changePromoCodeModalType = (type: PromoCodeModalType | undefined) => {
    setPromoCodeModalType(type);
  };

  const changeEditablePromoCodeId = (id: string | undefined) => {
    setEditablePromoCodeId(id);
  };

  return {
    promoCodeModalType,
    editablePromoCodeId,
    changeEditablePromoCodeId,
    changePromoCodeModalType,
  };
};
