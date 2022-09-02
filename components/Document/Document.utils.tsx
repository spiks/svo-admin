import { DocumentProps } from './Document.component';
import { CheckCircleFilled, ClockCircleFilled, ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { TherapistProfileStatus } from '../../generated';

export const DocumentStyleIcon: Record<DocumentProps['style'], JSX.Element> = {
  rejected: <ExclamationCircleFilled style={{ color: '#F5222D' }} />,
  approved: <CheckCircleFilled style={{ color: '#A0D911' }} />,
  pending: <ClockCircleFilled style={{ color: '#FA8C16' }} />,
  empty: <QuestionCircleFilled style={{ color: '#BFBFBF' }} />,
};

export function getDocumentStyle(
  isApproved: boolean | undefined | null,
  profileStatus: TherapistProfileStatus,
): DocumentProps['style'] {
  if (isApproved === true) {
    return 'approved';
  } else if (profileStatus === 'documents_not_submitted_yet') {
    return 'empty';
  } else {
    switch (isApproved) {
      case null:
        return 'pending';
      case false:
      default:
        return 'rejected';
    }
  }
}
