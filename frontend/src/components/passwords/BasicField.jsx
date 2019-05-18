import React from 'react';

import './BasicField.scss';

export default function BasicField({ title, value, className, children }) {
  if (!value) {
    return null;
  }

  return (
    <div className={`cp-basic-field ${className}`}>
      <strong>{title}</strong>: {value}
      {children}
    </div>
  );
}

BasicField.defaultProps = {
  className: ""
};
