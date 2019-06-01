import React from 'react';
import _ from 'lodash';
import BasicField from "./BasicField";
import ClipboardJS from 'clipboard';

import './CopyableField.scss';

const checkIcon = `<i class="material-icons">check</i>`;

export default class CopyableField extends React.Component {
  constructor(props) {
    super(props);
    this.id = _.uniqueId('copyable-field-');
  }

  componentDidMount() {
    console.log(ClipboardJS);
    this.clipboard = new ClipboardJS(`#${this.id}`);
    this.clipboard.on('success', () => {
      window.M.toast({html: `${checkIcon}${this.props.successMessage}`, classes: 'copy-success' });
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  onClick(e) {
    e.preventDefault();
  };

  getValue() {
    return this.props.mask ?
      _.repeat('•', this.props.value.length) :
      this.props.value;
  }

  renderToggleLink() {
    return (
      <button
        id={this.id}
        className="copy-button btn-small waves-effect waves-light btn-secondary"
        data-clipboard-text={this.props.value}
        onClick={(e) => this.onClick(e)}
        disabled={!this.props.value}>
        <i className="material-icons left">content_copy</i>
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