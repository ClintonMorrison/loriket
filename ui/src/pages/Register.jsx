import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: ""
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
      passwordError: ""
    });
  }

  updateUsername(username) {
    this.clearErrors();
    this.setState({ username });
  }

  updatePassword(password) {
    this.clearErrors();
    this.setState({ password });
  }

  render() {
    return (
      <div className="cp-register">
        <h1>Sign Up</h1>

        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="col s12">
                Enter a username and a strong password for your new account.

                <p>
                  <strong>Please write down your account information and keep it safe. </strong>
                </p>

                <p>
                  Because of how your data will be encrypted, it will not be possible to regain
                  control of your account if you forget.
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