import { FC } from 'react';

export const CvSectionTitle: FC = ({ children }) => {
  return (
    <h3 style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: '10px', lineHeight: '14px', color: '#262626' }}>
      {children}
    </h3>
  );
};
