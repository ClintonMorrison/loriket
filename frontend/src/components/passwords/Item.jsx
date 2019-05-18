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
    return (
      <Link className="waves-effect waves-light btn-small" to={`/passwords/${this.props.item.id}`}>
        <i className="material-icons">edit</i>
      </Link>
    );
  }


  render() {
    const { item } = this.props;
    return (
      <li className="cp-item collection-item">
        <div className="row">
          <div className="title col s12">{this.renderTitle()}</div>
          <div className="col s9">
            <CopyableField title="Username" value={item.username} />
            <CopyableField title="Password" value={item.password} mask />
          </div>

          <div className="col s3 actions">
            {this.renderViewButton()}
          </div>
        </div>
      </li>
    );
  }
}
