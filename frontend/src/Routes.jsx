import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import Navigation from './components/Navigation';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';

import Passwords from './pages/Passwords';
import View from "./pages/View";

export default class AppRouter extends React.Component {

  renderPage(PageComponent, extraProps) {
    return <PageComponent services={this.props.services} {...extraProps} />;
  }

  render() {
    const { services } = this.props;
    return (
      <Router>
        <header>
          <Navigation services={services} />
        </header>

        <main className="container">
          <Switch>
            <Route path="/" exact render={props => this.renderPage(Home, props)} />
            <Route path="/login" exact render={props => this.renderPage(Login, props)} />
            <Route path="/logout" exact render={props => this.renderPage(Logout, props)} />
            <Route path="/register" exact render={props => this.renderPage(Register, props)} />
            <Route path="/passwords" exact render={props => this.renderPage(Passwords, props)} />
            <Route path="/passwords/:id" render={props => this.renderPage(View, props)} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </main>

      </Router>
    );
  }
}
