import React, { FC, useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { useDocumentStatus } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useDocumentStatus';
import { DocumentStatusSpelling } from '@components/UserProfileDocumentsForm/TherapistDocumentsForm.const';
import { StaticFile } from '../../../generated';

export type SelectStatusProps = {
  document?: { isApprovedByModerator: boolean | null; document?: StaticFile | null } | null;
  loading?: boolean;
  disabled: boolean;
  onApprove?: () => void;
  onReject?: () => void;
};

export const SelectStatus: FC<SelectStatusProps> = ({ document, disabled, onApprove, onReject, loading = false }) => {
  const documentStatus = useDocumentStatus();
  const status = documentStatus(document);

  const [value, setValue] = useState(status);

  useEffect(() => {
    setValue(status);
  }, [status]);

  const handleChange: SelectProps['onChange'] = (value) => {
    switch (value) {
      case 'approved':
        onApprove && onApprove();
        break;
      case 'rejected':
        onReject && onReject();
        break;
    }
    setValue(value);
  };

  return (
    <Select
      disabled={disabled || status !== 'pending'}
      loading={loading}
      onChange={handleChange}
      value={value}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ width: '133px' }}
    >
      <Select.Option value={'approved'}>{DocumentStatusSpelling.approved}</Select.Option>
      <Select.Option value={'rejected'}>{DocumentStatusSpelling.rejected}</Select.Option>
      <Select.Option value={'pending'} disabled={true}>
        {DocumentStatusSpelling.pending}
      </Select.Option>
      <Select.Option value={'not_arrived'} disabled={true}>
        {DocumentStatusSpelling.not_arrived}
      </Select.Option>
    </Select>
  );
};
