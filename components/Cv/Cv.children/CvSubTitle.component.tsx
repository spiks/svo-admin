import React, { FC } from 'react';

export const CvSubTitle: FC = ({ children }) => {
  return (
    <p
      style={{
        fontFamily: 'Roboto',
        fontWeight: 600,
        fontSize: '10px',
        lineHeight: '12px',
        color: '#262626',
      }}
    >
      {children}
    </p>
  );
};
