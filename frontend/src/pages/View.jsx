import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import uuid from 'uuid/v5';

import Details from "../components/passwords/Details";
import Loader from "../components/Loader";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: null
    };
  }

  updatePassword(password) {
    const { id } = password;
    this.props.services.documentService.loadDocument().then(document => {
      const indexToUpdate = _.findIndex(document.passwords, { id });
      document.passwords[indexToUpdate] = password;
      this.props.services.documentService.updateDocument(document);
    }).then(() => {
      this.props.history.push("/passwords");
    }).catch(() => {
      this.props.history.push("/login");
    });
  }

  deletePassword(password) {
    const { id } = password;
    this.props.services.documentService.loadDocument().then(document => {
      const indexToDelete = _.findIndex(document.passwords, { id });
      document.passwords.splice(indexToDelete, 1);
      this.props.services.documentService.updateDocument(document);
    }).then(() => {
      this.props.history.push("/passwords");
    }).catch(() => {
      this.props.history.push("/login");
    });
  }

  getPasswords() {
    return _.get(this.state, 'document.passwords', []);
  }

  componentDidMount() {
    return this.props.services.documentService.loadDocument().then(document => {
      this.setState({ document });
    }).catch(() => {
      this.props.history.push("/login");
    });
  }

  render() {
    if (!this.state.document) {
      return (
        <Loader />
      );
    }

    console.log(this);

    const { id } = this.props.match.params;
    const passwords = this.getPasswords();
    const item = _.find(passwords, { id });

    if (!item) {
      return <Redirect to="/passwords" />;
    }

    return (
      <div className="cp-view">
        <Details
          item={item}
          createPassword={() => this.createPassword()}
          updatePassword={p => this.updatePassword(p)}
          deletePassword={p => this.deletePassword(p)} />
      </div>
    );
  }
}