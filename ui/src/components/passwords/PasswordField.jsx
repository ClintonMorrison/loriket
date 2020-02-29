import React from 'react';
import _ from 'lodash';
import TextField from "../forms/TextField";

import './PasswordField.scss';

export default class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  toggleShow(e) {
    e.preventDefault();
    this.setState({ show: !this.state.show });
  }

  generatePassword(e) {
    e.preventDefault();

    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeric = '0123456789';
    const punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let password = "";
  
    while (password.length < 10) {
      let letterIndex = Math.floor(letters.length * Math.random());
      let numberIndex = Math.floor(numeric.length * Math.random());
      let puncIndex = Math.floor(punctuation.length * Math.random());

      password += letters[letterIndex];
      password += numeric[numberIndex];
      password += punctuation[puncIndex];
    }

    this.setState({ show: true });
    this.onChange(password);
    setTimeout(() => {
      window.M.updateTextFields();
    }, 0);
  }

  onChange(val) {
    this.props.updateItem('password', val);
  }

  getPassword() {
    return this.props.value;
  }

  renderGenerateButton() {
    return (
      <button
        className="waves-effect waves-light btn"
        onClick={e => this.generatePassword(e)}>
        <i className="material-icons left">loop</i>
        Generate
        </button>
    );
  }

  renderToggleButton() {
    return (
      <button
        className="waves-effect waves-light btn"
        onClick={e => this.toggleShow(e)}>
        <i className="material-icons left">{this.state.show ? 'visibility_off' : 'visibility' }</i>
        {this.state.show ? 'Hide' : 'Show'}
        </button>
    );
  }

  render() {
    const value = this.getPassword();
    return (
      <div class="cp-password-field">
        <TextField
          label="Password"
          id="password"
          type={this.state.show ? 'text' : 'password'}
          value={value}
          autoComplete="new-password"
          error={this.props.error}
          onChange={val => this.onChange(val)} />
        {this.props.value ? this.renderToggleButton() : this.renderGenerateButton()}
      </div>
    );
  }
}