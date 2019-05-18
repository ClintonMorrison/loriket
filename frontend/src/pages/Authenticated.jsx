import React from 'react';

export default class Authenticated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: null
    };
  }


  componentDidMount() {
    return this.props.services.documentService.loadDocument().then(document => {
      this.setState({ document });
    }).catch(() => {
      this.props.history.push("/login");
    });
  }

  render() {

    return <h1>BLAH</h1>;
    if (this.state.document) {
      return (
        <div>
          this.props.children
        </div>
      );
    }

    return (
      <div className="cp-authenticated">
        <div className="progress">
          <div className="indeterminate" />
        </div>
      </div>
    );
  }
}