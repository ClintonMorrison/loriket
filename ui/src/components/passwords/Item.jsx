import React from 'react';
import { Link } from "react-router-dom";
import CopyableField from "./CopyableField";

import './Item.scss';

export default class Item extends React.Component {
  renderTitle() {
    const { item } = this.props;
    const title = item.title || 'Untitled';
    if (!item.website) {
      return title;
    }

    return (
      <a target="_blank" rel="noopener noreferrer" href={item.website}>{title}</a>
    );
  }

  renderViewButton() {
    const { item } = this.props;
    return (
      <Link
        className="waves-effect waves-light btn-small"
        to={`/passwords/${this.props.item.id}`}
        onClick={() => this.props.updateLastUsedDate(item.id)}>
        <i className="material-icons">edit</i>
      </Link>
    );
  }

  render() {
    const { item } = this.props;

    let userField = (
      <CopyableField
        title="Username"
        value={item.username}
        successMessage={`Copied username for ${item.title}`}
        onCopy={() => this.props.updateLastUsedDate(item.id)} />
    );
    if (!item.username && item.email) {
      userField = (
        <CopyableField
          title="Email"
          value={item.email}
          successMessage={`Copied email for ${item.title}`}
          onCopy={() => this.props.updateLastUsedDate(item.id)} />
      );
    }

    return (
      <li className="cp-item collection-item">
        <span className="title">{this.renderTitle()}</span>
        {userField}
        <CopyableField
          title="Password"
          value={item.password}
          successMessage={`Copied password for ${item.title}`}
          mask
          onCopy={() => this.props.updateLastUsedDate(item.id)} />
        {this.renderViewButton()}
      </li>
    );
  }
}
