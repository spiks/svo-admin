import React, { FC } from 'react';

export const CvText: FC = ({ children }) => {
  return (
    <p
      style={{
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '8px',
        color: '#595959',
        flexShrink: 0,
      }}
    >
      {children}
    </p>
  );
};
