import React from 'react';

export default class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      window.M.updateTextFields();
      if (this.props.autoFocus) {
        this.ref.current.focus();
      }
    }, 0);
  }

  render () {
    const {
      id,
      label,
      onChange,
      value,
      error,
      type,
      icon
    } = this.props;

    return (
      <div className="cp-text-field row">
        <div className="input-field col s12">
          {icon && (<i className="material-icons prefix">{icon}</i>)}
          <input
            id={id}
            type={type}
            className={error ? 'invalid' : ''}
            autoComplete={this.props.autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            ref={this.ref} />
          <label htmlFor={id}>{label}</label>
          <span className="helper-text" data-error={error} />
        </div>
      </div>
    );
  }
}

TextField.defaultProps = {
  type: 'text'
};
