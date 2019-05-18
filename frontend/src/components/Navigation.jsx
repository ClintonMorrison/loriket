import React from 'react';

import './Navigation.scss';
export default function Navigation({ services }) {
  const loggedIn = services.authService.sessionExists();

  const loggedOutItems = [
    <li key="register"><a href="/register">Register</a></li>,
    <li key="login"><a href="/login">Login</a></li>,
  ];

  const loggedInItems = [
    <li key="passwords"><a href="/passwords">My Passwords</a></li>,
    <li key="logout"><a href="/logout">Logout</a></li>
  ];

  return (
    <nav className="green">
      <div className="cp-navigation">
        <a href="/" className="brand-logo">Lorikeet</a>
        <ul id="nav-mobile" className="right">
          {loggedIn ? loggedInItems : loggedOutItems}
        </ul>
      </div>
    </nav>
  );
}