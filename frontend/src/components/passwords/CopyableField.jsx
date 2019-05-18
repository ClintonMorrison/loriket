import React from 'react';
import _ from 'lodash';
import BasicField from "./BasicField";

import './CopyableField.scss';

export default class CopyableField extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();

  }

  copyToClipboard(e) {
    e.preventDefault();
    const el = document.createElement('textarea');
    el.value = this.props.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    e.target.focus();
    this.setState({ copied: true });
  };


  getValue() {
    return this.props.mask ?
      _.repeat('•', this.props.value.length) :
      this.props.value;
  }

  renderToggleLink() {
    return (
      <a
        className="copy-link"
        href={`#copy-field-${this.props.title}`}
        onClick={(e) => this.copyToClipboard(e)}
        ref={this.linkRef}
      >
        Copy
      </a>
    );
  }

  render() {
    const value = this.getValue();
    return (
      <div className="cp-copyable-field">
        <BasicField
          className="cp-copyable-field"
          title={this.props.title}
          value={value} />
        {this.renderToggleLink()}
      </div>
    );
  }
}