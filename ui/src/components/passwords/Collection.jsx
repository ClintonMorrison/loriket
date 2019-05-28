import React from 'react';
import Item from "./Item";

export default class Collection extends React.Component {
  render() {
    return (
      <ul className="collection">
        {this.props.passwords.map(item => <Item key={item.id || item.title} item={item} />)}
      </ul>
    );
  }
}