import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

import './Register.scss';


const digitsChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const specialChars = [
  '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-',
  '_', '+', '=', '[', ']', '|', '\\', ';', ':', '\'', '"',
  '<', ',', '.', '>', '/', '?'
];


export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
      passwordValidation: {
        valid: true,
        containsLower: true,
        containsUpper: true,
        containsDigit: true,
        containsSpecial: true
      }
    };
  }

  validatePassword(password) {
    const result = {};


    const containsLower = _.some(password, c => c.toLowerCase() === c);
    const containsUpper = _.some(password, c => c.toUpperCase() === c);
    const containsDigit = _.some(password, c => digitsChars.includes(c));
    const containsSpecial = _.some(password, c => specialChars.includes(c));
    const valid = containsLower && containsUpper && containsDigit && containsSpecial;

    return {
      valid,
      containsLower,
      containsUpper,
      containsDigit,
      containsSpecial
    };
  }

  submit(e) {
    e.preventDefault();

    let isOkay = true;

    if (!this.state.username) {
      this.setState({ usernameError: "Username cannot be empty" });
      isOkay = false;
    }

    if (!this.state.password) {
      this.setState({ passwordError: "Password cannot be empty" });
      isOkay = false;
    }

    const validation = this.state.passwordValidation;
    if (!validation.valid) {
      this.setState({
        passwordError: 'Password does not meet requirements',
      });
      isOkay = false;
    }

    if (!isOkay) {
      return;
    }

    const { username, password } = this.state;
    this.props.services.documentService.createDocument({ username, password })
      .then(() => {
        this.props.history.push('/passwords')
      })
      .catch(err => {
        console.log({ ...err });
        const errorMessage = _.get(err, 'response.data.error', 'An error occurred.');
        if (errorMessage) {
          this.setState({ usernameError: errorMessage });
        }
    });
  }

  clearErrors() {
    this.setState({
      usernameError: "",
      passwordError: "",
    });
  }

  updateUsername(username) {
    this.clearErrors();
    this.setState({ username });
  }

  updatePassword(password) {
    this.clearErrors();
    const passwordValidation = this.validatePassword(password);
    this.setState({ password, passwordValidation });
  }

  render() {
    const { passwordValidation } = this.state;
    return (
      <div className="cp-register">
        <h1>Sign Up</h1>

        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="col s12">
                <p>
                  Enter a username and a strong password for your new account.
                  Please write down your account information and keep it safe.

                  Because of how your data will be encrypted, it will not be possible to regain
                  control of your account if you forget.
                </p>

                <p>
                  Your password must:
                  <ul className="browser-default password-requirements">
                    <li className={passwordValidation.containsLower ? '' : 'invalid'}>contains at least 1 lowercase letter</li>
                    <li className={passwordValidation.containsUpper ? '' : 'invalid'}>contains at least 1 capital letter</li>
                    <li className={passwordValidation.containsDigit ? '' : 'invalid'}>contains at least 1 number</li>
                    <li className={passwordValidation.containsSpecial ? '' : 'invalid'}>contains at least 1 special character (! @ # ? etc.)</li>
                  </ul>
                </p>
              </div>
            </div>

            <TextField
              label="Username"
              id="username"
              value={this.state.username}
              error={this.state.usernameError}
              onChange={val => this.updateUsername(val)} />

            <TextField
              label="Password"
              id="password"
              type="password"
              value={this.state.password}
              error={this.state.passwordError}
              onChange={val => this.updatePassword(val)} />

            <div className="row">
              <div className="input-field col s12">
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  name="action"
                  onClick={(e) => this.submit(e)}>
                  Register
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );

  }
}