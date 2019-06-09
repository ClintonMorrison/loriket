import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

import './Register.scss';
import { validatePassword } from "../utils/validation";
import PasswordRequirements from "../components/PasswordRequirements";

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
    const passwordValidation = validatePassword(password);
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

                <PasswordRequirements result={this.state.passwordValidation}/>
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