import React from 'react';
import BasicField from "./BasicField";
import DateField from "./DateField";

export default class Details extends React.Component {
  renderWebsite() {
    const { item } = this.props;
    if (!item.website) {
      return null;
    }

    return (
      <div>
        <a target="_blank" href={item.website}>Website</a>
      </div>
    );
  }

  renderUsernameButton() {
    return (
      <button class="waves-effect waves-light btn-small">
        <i class="material-icons left">content_copy</i>
        Username
      </button>
    );
  }

  renderPasswordButton() {
    return (
      <button class="waves-effect waves-light btn-small">
        <i class="material-icons left">content_copy</i>
        Password
      </button>

    );
  }

  render() {
    const { item } = this.props;
    /*
    title": "Steam",
			"username": "clint222",
			"password": "1234",
			"email": "clintonmorrison2@gmail.com",
			"website": "https://steam.com",
			"notes": "Clint's Steam account\n.This is it.",
			"tags": ["gaming"],
			"category": "gaming",
			"dateCreated": "2019-01-01",
			"dateUpdated
     */
    return (
      <li className="cp-details">
        <i className="material-icons circle red">play_arrow</i>
        <h1 className="title">{item.title}</h1>
        <BasicField title="Username" value={item.username} className="notes" />
        <BasicField title="Password" value={item.password} />
        <BasicField title="Notes" value={item.notes} className="notes" />
        <BasicField title="Email" value={item.email} />
        <DateField title="Created" value={item.dateCreated} />
        <DateField title="Last Updated" value={item.dateUpdated} />
        {this.renderWebsite()}
        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
      </li>

    );
  }
}
