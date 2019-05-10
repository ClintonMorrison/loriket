import React from 'react';

export default function BasicField({ title, value, className }) {
  if (!value) {
    return null;
  }

  return (
    <div className={`cp-basic-field ${className}`}>
      <strong>{title}</strong>: {value}
    </div>
  );
}

BasicField.defaultProps = {
  className: ""
};
