import { FC, PropsWithChildren } from 'react';
import { CvSectionTitle } from '@components/Cv/Cv.children/CvSectionTitle.component';

export type CvSectionProps = PropsWithChildren<{ title: string }>;

export const CvSection: FC<CvSectionProps> = ({ title, children }) => {
  return (
    <section
      style={{ display: 'flex', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #E8E8F4' }}
    >
      <div style={{ flexShrink: 0, width: '148px' }}>
        <p style={{ width: '108px' }}>
          <CvSectionTitle>{title}</CvSectionTitle>
        </p>
      </div>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </section>
  );
};
