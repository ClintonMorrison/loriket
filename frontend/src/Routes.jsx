import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

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
        <Switch>
          <Route path="/" exact render={props => this.renderPage(Home, props)} />
          <Route path="/login" exact render={props => this.renderPage(Login, props)} />
          <Route path="/register" exact render={props => this.renderPage(Register, props)} />
          <Route path="/passwords" exact render={props => this.renderPage(Passwords, props)} />
          <Route path="/passwords/:id" render={props => this.renderPage(View, props)} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }
}
