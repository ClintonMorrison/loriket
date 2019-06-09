import React from 'react';

import './Footer.scss';

export default function Footer() {
  return (
    <footer className="cp-footer page-footer">
      <div className="container">
        <div className="row">
          <div className="col s12 m6">
            <a className="grey-text text-lighten-4" href="https://clintonmorrison.com">Terms of Service</a>
            <a className="grey-text text-lighten-4" href="https://clintonmorrison.com">Privacy Policy</a>

          </div>

          <div className="col s12 m6">
              <a className="grey-text text-lighten-4 right" href="https://ko-fi.com/T6T0VOWY">Support Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}