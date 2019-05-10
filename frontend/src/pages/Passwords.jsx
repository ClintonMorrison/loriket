import React from 'react';
import _ from 'lodash';
import Collection from "../components/passwords/Collection";

export default class Passwords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: null
    };
  }

  getPasswords() {
    return _.get(this.state, 'document.passwords', []);
  }

  componentDidMount() {
    return this.props.services.authService.loadDocument().then(document => {
      this.setState({ document });
    }).catch(() => {
      this.props.history.push("/login");
    });
  }

  render() {
    return (
      <div className="cp-passwords">
        <h1>Passwords</h1>
        <Collection passwords={this.getPasswords()} />
      </div>
    )
  }
}