import React from 'react';
import BasicField from "./BasicField";
import DateField from "./DateField";

export default class Item extends React.Component {
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

  renderViewButton() {
    return (
      <button class="waves-effect waves-light btn-small">
        View
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
      <li className="cp-item collection-item avatar">
        <i className="material-icons circle red">play_arrow</i>
        <span className="title">{item.title}</span>
        <BasicField title="Username" value={item.username} className="notes" />
        <BasicField title="Password" value={item.password} />
        <BasicField title="Notes" value={item.notes} className="notes" />
        {this.renderWebsite()}
        <div  className="secondary-content">
          {this.renderViewButton()}
        </div>
      </li>
    );
  }
}
