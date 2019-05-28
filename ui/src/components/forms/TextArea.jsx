import React from 'react';

export default class TextArea extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.M.updateTextFields();
      window.M.textareaAutoResize(window.$('textarea'))
    }, 0);
  }

  render () {
    const {
      id,
      label,
      onChange,
      value,
      error,
      icon
    } = this.props;

    return (
      <div className="cp-text-field row">
        <div className="input-field col s12">
          {icon && (<i className="material-icons prefix">{icon}</i>)}
          <textarea
            id={id}
            className={`materialize-textarea ${error ? 'invalid' : ''}`}
            value={value}
            onChange={(e) => onChange(e.target.value)} />
          <label htmlFor={id}>{label}</label>
          <span className="helper-text" data-error={error} />
        </div>
      </div>
    );
  }
}
