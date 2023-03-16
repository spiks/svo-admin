import React, { FC } from 'react';

export const CvName: FC = ({ children }) => {
  return (
    <h2
      style={{
        fontFamily: 'Roboto',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '16px',
        color: '#262626',
        width: '169px',
      }}
    >
      {children}
    </h2>
  );
};
