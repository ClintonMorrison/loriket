import React from 'react';
import _ from 'lodash';
import Collection from "../components/passwords/Collection";
import Loader from "../components/Loader";
import TextField from "../components/forms/TextField";

import './Passwords.scss';
import uuid from "uuid/v4";

export default class Passwords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      document: null
    };
  }

  applyFilter(password) {
    const query = this.state.query.toLowerCase().trim();

    if (!query) {
      return true;
    }

    const fields = ['title', 'notes', 'website'];

    return fields.some(field => password[field].toLowerCase().trim().indexOf(query) !== -1);
  }

  getPasswords() {
    return _.chain(this.state)
      .get('document.passwords', [])
      .filter(p => this.applyFilter(p))
      .value();
  }

  createPassword(e) {
    e.preventDefault();

    const id = uuid();
    const password = {
      id,
      title: '',
      username: '',
      password: '',
      email: '',
      website: '',
      notes: ''
    };

    this.props.services.documentService.loadDocument().then(document => {
      document.passwords = [...document.passwords, password];
      this.props.services.documentService.updateDocument(document);
    }).then(() => {
      this.props.history.push(`/passwords/${id}`);
    }).catch(() => {
      this.props.history.push("/logout");
    });
  }

  componentDidMount() {
    return this.props.services.documentService.loadDocument().then(document => {
      this.setState({ document });
    }).catch(() => {
      this.props.history.push("/logout");
    });
  }

  render() {
    if (!this.state.document) {
      return (
        <Loader />
      );
    }

    return (
      <div className="cp-passwords">
        <h1>Passwords</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            label="Search"
            id="search"
            icon="search"
            value={this.state.query}
            onChange={query => this.setState({ query })} />
        </form>

        <div className="top-actions">
          <button
            onClick={e => this.createPassword(e)}
            className="waves-effect waves-light btn">
            <i className="material-icons left">add</i>
            Add
          </button>
        </div>

        <Collection passwords={this.getPasswords()} />
      </div>
    )
  }
}