import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled, WarningFilled } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const ApprovedIndicator = () => {
  return <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />;
};

const RejectedIndicator = () => {
  return <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />;
};

const ErrorIndicator = () => {
  return <WarningFilled style={{ color: '#FADB14', fontSize: '21px' }} />;
};

const PendingIndicator = () => {
  return <QuestionCircleFilled style={{ color: '#FADB14', fontSize: '21px' }} />;
};

const SpinnerIndicator = () => {
  return <Spin spinning={true} style={{ width: '21px', height: '21px' }} />;
};

export function getDocumentIndicator(
  query: { isLoading: boolean; isError: boolean },
  document?: { isApprovedByModerator: boolean | null } | null,
) {
  if (query.isLoading) {
    return SpinnerIndicator;
  } else if (query.isError) {
    return ErrorIndicator;
  } else if (document?.isApprovedByModerator === true) {
    return ApprovedIndicator;
  } else if (document?.isApprovedByModerator === null) {
    return PendingIndicator;
  } else {
    return RejectedIndicator;
  }
}
