import React from 'react';

export default class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    window.M.FormSelect.init(this.ref.current);
  }

  render() {
    const { className, value } = this.props;
    return (
      <div className={`input-field ${className}`}>
        <select
          ref={this.ref}
          onChange={e => this.props.onChange(e.target.value)}
          value={value}>
          <option value="last_used">Last Used</option>
          <option value="added">Date Added</option>
          <option value="updated">Date Updated</option>
          <option value="title">Title</option>
        </select>
        <label>Sort</label>
      </div>
    );
  }
}
