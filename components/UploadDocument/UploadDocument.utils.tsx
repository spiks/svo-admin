import { CheckCircleFilled, ClockCircleFilled, ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { UploadDocumentProps } from './UploadDocument.component';

export const UploadDocumentStyleIcon: Record<UploadDocumentProps['style'], JSX.Element> = {
  rejected: <ExclamationCircleFilled style={{ color: '#F5222D' }} />,
  approved: <CheckCircleFilled style={{ color: '#A0D911' }} />,
  pending: <ClockCircleFilled style={{ color: '#FA8C16' }} />,
  empty: <QuestionCircleFilled style={{ color: '#BFBFBF' }} />,
};
