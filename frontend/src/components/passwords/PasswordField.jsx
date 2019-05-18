import React from 'react';
import _ from 'lodash';
import BasicField from "./BasicField";

import './PasswordField.scss';

export default class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  getPassword() {
    return this.state.show ?
      this.props.value :
      _.repeat('•', this.props.value.length);
  }

  renderToggleLink() {
    return (
      <a
        className="toggle-link"
        href="#toggle-password"
        onClick={() => this.setState({ show: !this.state.show })}>
        {this.state.show ? 'Hide' : 'Show'}
      </a>
    );
  }

  render() {
    const value = this.getPassword();
    return (
      <BasicField className="cp-password-field" title="Password" value={value}>
        {this.renderToggleLink()}
      </BasicField>
    );
  }
}