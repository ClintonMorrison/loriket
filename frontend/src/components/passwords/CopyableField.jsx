import React from 'react';
import _ from 'lodash';
import BasicField from "./BasicField";

import './CopyableField.scss';

export default class CopyableField extends React.Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
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
      <button
        className="copy-button btn-small waves-effect waves-light btn-negative"
        onClick={(e) => this.copyToClipboard(e)}
        ref={this.buttonRef}>
        <i class="material-icons left">content_copy</i>
        {this.props.title}
      </button>
    );
  }

  render() {
    const value = this.getValue();
    return (
      <div className="cp-copyable-field">
        {this.props.renderField && <BasicField
          className="cp-copyable-field"
          title={this.props.title}
          value={value} />}
        {this.renderToggleLink()}
      </div>
    );
  }
}