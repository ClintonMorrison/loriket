import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Passwords from './pages/Passwords';
import View from "./pages/View";


export default class AppRouter extends React.Component {

  renderPage(PageComponent, extraProps) {
    return <PageComponent services={this.props.services} {...extraProps} />;
  }

  render() {
    return (
      <Router>
        <Route path="/" exact render={props => this.renderPage(Home, props)} />
        <Route path="/login" exact render={props => this.renderPage(Login, props)} />
        <Route path="/register" exact render={props => this.renderPage(Register, props)} />
        <Route path="/passwords" exact render={props => this.renderPage(Passwords, props)} />
        <Route path="/passwords/view" render={props => this.renderPage(View, props)} />
      </Router>
    );
  }
}
