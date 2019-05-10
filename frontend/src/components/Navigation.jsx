import React from 'react';

import './Navigation.scss';
export default function Navigation() {
  return (
    <nav className="green">
      <div className="cp-navigation">
        <a href="/" className="brand-logo">Lorikeet</a>
        <ul id="nav-mobile" className="right">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    </nav>
  );
}