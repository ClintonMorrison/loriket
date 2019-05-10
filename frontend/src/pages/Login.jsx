import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

export default class Login extends React.Component {
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
    this.props.services.authService.setCredentials({ username, password });
    this.props.services.authService.loadDocument()
      .then(() => {
        this.props.history.push('/passwords');
      })
      .catch(err => {
        console.log(err);
        const errorMessage = _.get(err, 'response.data.error', 'An error occurred.');
        if (errorMessage) {
          this.setState({ usernameError: errorMessage, passwordError: ' ' });
        }
      });
  }

  clearErrors() {
    this.setState({
      usernameError: "",
      passwordError: ""
    });
  }

  updateUsername(e) {
    this.clearErrors();
    this.setState({ username: e.target.value });
  }

  updatePassword(e) {
    this.clearErrors();
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="cp-login">
        <h1>Login</h1>

        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="col s12">
                Enter your username and password to login.
              </div>
            </div>

            <TextField
              label="Username"
              id="username"
              value={this.state.username}
              error={this.state.usernameError}
              onChange={e => this.updateUsername(e)} />

            <TextField
              label="Password"
              id="password"
              type="password"
              value={this.state.password}
              error={this.state.passwordError}
              onChange={e => this.updatePassword(e)} />

            <div className="row">
              <div className="input-field col s12">
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  name="action"
                  onClick={(e) => this.submit(e)}>
                  Submit
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );

  }
}