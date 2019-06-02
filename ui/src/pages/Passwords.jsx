import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import uuid from "uuid/v4";

import Collection from "../components/passwords/Collection";
import Loader from "../components/Loader";
import TextField from "../components/forms/TextField";
import Sort from "../components/passwords/Sort";

import './Passwords.scss';

export default class Passwords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      sort: localStorage.getItem('sort') || 'last_use',
      document: null
    };
  }

  setSort(sort) {
    this.setState({ sort });
    localStorage.setItem('sort', sort);
  }

  applyFilter(password) {
    const query = this.state.query.toLowerCase().trim();

    if (!query) {
      return true;
    }

    const fields = ['title', 'notes', 'website'];

    return fields.some(field => password[field].toLowerCase().trim().indexOf(query) !== -1);
  }

  updateLastUsedDate(id) {
    const { documentService } = this.props.services;
    documentService.loadDocument().then(document => {
      const indexToUpdate = _.findIndex(document.passwords, { id });
      document.passwords[indexToUpdate].lastUsed = moment().toISOString();
      documentService.updateDocument({ document });
    });
  }

  getPasswords() {
    const { sort } = this.state;

    let passwords = _.chain(this.state)
      .get('document.passwords', [])
      .filter(p => this.applyFilter(p))
      .sortBy(this.getSortBys());

    if (sort !== 'title') {
      passwords = passwords.reverse();
    }

    return passwords.value();
  }

  getSortBys() {
    const { sort } = this.state;

    if (sort === 'title') {
      return [
        p => p.title.trim().toLowerCase(),
        p => moment(p.created).toISOString()
      ];
    } else if (sort === 'last_used') {
      return [
        p => moment(p.lastUsed).toISOString(),
        p => moment(p.created).toISOString()
      ];
    } else if (sort === 'updated') {
      return [
        p => moment(p.updated).toISOString(),
        p => moment(p.created).toISOString()
      ];
    } else if (sort === 'created') {
      return [
        p => moment(p.created).toISOString(),
        p => moment(p.updated).toISOString()
      ];
    }

    return null;
  }

  createPassword(e) {
    e.preventDefault();
    const { documentService } = this.props.services;

    const id = uuid();
    const password = documentService.createPassword(id);

    this.props.services.documentService.loadDocument().then(document => {
      document.passwords = [...document.passwords, password];
      return documentService.updateDocument({ document });
    }).then(() => {
      this.props.history.push(`/passwords/${id}`);
    }).catch((err) => {
      console.log('error', err);
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
        <form className="row" onSubmit={(e) => e.preventDefault()}>
          <TextField
            className="col s12 m6"
            label="Search"
            id="search"
            value={this.state.query}
            onChange={query => this.setState({ query })} />
          <Sort className="col s12 m6" onChange={sort => this.setSort(sort)} value={this.state.sort} />
        </form>


        <div className="row">
          <div className="col s12">
            <div className="top-actions">
              <button
                onClick={e => this.createPassword(e)}
                className="waves-effect waves-light btn">
                <i className="material-icons left">add</i>
                Add
              </button>
            </div>

            <Collection
              passwords={this.getPasswords()}
              updateLastUsedDate={id => this.updateLastUsedDate(id)} />
          </div>
        </div>
      </div>
    )
  }
}