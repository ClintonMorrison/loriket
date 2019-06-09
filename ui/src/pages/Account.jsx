import React from 'react';
import _ from 'lodash';
import TextField from '../components/forms/TextField';

import './Account.scss';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      oldPasswordError: "",
      newPasswordError: ""
    };
  }

  submitPassword(e) {
    e.preventDefault();
    this.clearErrors();

    let anyErrors = false;
    if (!this.state.oldPassword) {
      this.setState({ oldPasswordError: 'Old password cannot be empty' });
      anyErrors = true;
    }

    if (!this.state.newPassword) {
      this.setState({ newPasswordError: 'New password cannot be empty' });
      anyErrors = true;
    }

    if (!this.state.oldPassword) {
      this.setState({ oldPasswordError: 'Old password cannot be empty' });
      anyErrors = true;
    }

    if (!this.props.services.authService.passwordMatchesSession(this.state.oldPassword)) {
      this.setState({ oldPasswordError: 'Old password is incorrect' });
      anyErrors = true;

    }

    if (anyErrors) {
      return;
    }

    this.props.services.documentService.updatePassword(this.state.newPassword).then(() => {
      this.props.history.push('/passwords');
    }).catch(err => {
      const newPasswordError = _.get(err, 'response.data.error', 'An error occurred.');
      this.setState({ newPasswordError });
    });
  }

  submitDelete(e) {
    e.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete your account? All your password data will be permanently deleted.");
    if (confirmed) {
      this.props.services.documentService.deleteDocument().then(() => {
        this.props.history.push('/logout');
      }).catch(err => {
        const errorMessage = _.get(err, 'response.data.error', 'An error occurred.');
        alert(errorMessage);
      });
    }
  }

  submitDownload(e, type) {
    e.preventDefault();
    this.props.services.documentService.downloadDocument(type);
  }

  clearErrors() {
    this.setState({
      oldPasswordError: "",
      newPasswordError: ""
    });
  }

  updateOldPassword(oldPassword) {
    this.clearErrors();
    this.setState({ oldPassword });
  }

  updateNewPassword(newPassword) {
    this.clearErrors();
    this.setState({ newPassword });
  }

  renderChangePassword() {
    return (
      <div className="row">
        <form className="col s12">
          <h2>Change Password</h2>
          <p>
            Please write down your new password and keep it safe.
            Because of how your data will be encrypted, it will not be possible to regain
            control of your account if you forget.
          </p>

          <div className="row">
            <TextField
              className="col s12"
              label="Old Password"
              id="old-passwrd"
              type="password"
              value={this.state.oldPassword}
              error={this.state.oldPasswordError}
              onChange={val => this.updateOldPassword(val)} />

            <TextField
              className="col s12"
              label="New Password"
              id="new-password"
              type="password"
              value={this.state.newPassword}
              error={this.state.newPasswordError}
              onChange={val => this.updateNewPassword(val)} />

            <div className="input-field col s12">
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={(e) => this.submitPassword(e)}>
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  renderExport() {
    return (
      <div className="row">
        <form className="col s12">
          <h2>Export Passwords</h2>
          <p>
            You can download your passwords as a text file, a CSV, or JSON.
          </p>

          <div className="row download-actions">
            <div className="col s12">
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={(e) => this.submitDownload(e, 'csv')}>
                <i className="material-icons left">file_download</i>
                CSV
              </button>
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={(e) => this.submitDownload(e, 'json')}>
                <i className="material-icons left">file_download</i>
                JSON
              </button>
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={(e) => this.submitDownload(e, 'text')}>
                <i className="material-icons left">file_download</i>
                Text
              </button>

            </div>
            <div className="col s4">
            </div>
            <div className="col s4">
            </div>
          </div>
        </form>
      </div>
    );
  }

  renderDeleteAccount() {
    return (
      <div className="row">
        <form className="col s12">
          <h2>Delete Account</h2>
          <p>
            If you no longer which you use Lorikeet to manage your passwords you can delete your account.
            This will delete all your stored passwords, and account data.
            You will not be able to login again, or view your passwords.
          </p>

          <p>
            <strong>This is irreversible.</strong>
          </p>
          <div className="row">
            <div className="input-field col s12">
              <button
                className="btn waves-effect waves-light btn-negative"
                type="submit"
                name="action"
                onClick={(e) => this.submitDelete(e)}>
                Delete All Data
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }


  render() {
    return (
      <div className="cp-account">
        <h1>Account</h1>
        {this.renderChangePassword()}
        <hr />
        {this.renderExport()}
        <hr />
        {this.renderDeleteAccount()}
      </div>
    );

  }
}