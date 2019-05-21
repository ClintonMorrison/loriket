import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import './Navigation.scss';
export class Navigation extends React.Component {

  render() {
    const { services } = this.props;
    const loggedIn = services.authService.sessionExists();

    const loggedOutItems = [
      <li key="register"><Link to="/register">Register</Link></li>,
      <li key="login"><Link to="/login">Login</Link></li>,
    ];

    const loggedInItems = [
      <li key="account"><Link to="/account">My Account</Link></li>,
      <li key="passwords"><Link to="/passwords">My Passwords</Link></li>,
      <li key="logout"><Link to="/logout">Logout</Link></li>
    ];

    return (
      <nav className="">
        <div className="cp-navigation">
          <Link to="/" className="brand-logo">Lorikeet</Link>
          <ul id="nav-mobile" className="right">
            {loggedIn ? loggedInItems : loggedOutItems}
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navigation);