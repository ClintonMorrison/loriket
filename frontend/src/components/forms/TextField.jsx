import React from 'react';

export default function TextField(props) {
  const {
    id,
    label,
    onChange,
    value,
    error,
    type
  } = props;

  return (
    <div className="cp-text-field row">
      <div className="input-field col s12">
        <input
          id={id}
          type={type}
          className={error ? 'invalid' : ''}
          value={value}
          onChange={onChange} />
        <label htmlFor={id}>{label}</label>
        <span className="helper-text" data-error={error} />
      </div>
    </div>
  );
}

TextField.defaultProps = {
  type: 'text'
};
