import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

export default function Home() {
  return (
    <div className="cp-home">
      <div className="heading">
        <h1>Lorikeet</h1>
        <p className="subtitle">A secure online password manager.</p>
      </div>


      <div className="bird-banner">
        <img src={`${process.env.PUBLIC_URL}/bird_large.png`} />
      </div>

      <div className="row">
        <div className="col s12 m4">
          <div className="center promo promo-example">
            <i className="material-icons large">spa</i>
            <h5 className="promo-caption">Easy</h5>
            <p className="light center">
              You can stop keeping track of your passwords. It's easy to manage your passwords with Lorikeet.
            </p>
          </div>
        </div>

        <div className="col s12 m4">
          <div className="center promo promo-example">
            <i className="material-icons large">vpn_key</i>
            <h5 className="promo-caption">Secure</h5>
            <p className="light center">
              With strong AES encryption on the client-side and server-side, you don't need to worry about your passwords.
            </p>
          </div>
        </div>

        <div className="col s12 m4">
          <div className="center promo promo-example">
            <i className="material-icons large">favorite</i>
            <h5 className="promo-caption">Free</h5>
            <p className="light center">
              Lorikeet is free to use, and <a href="https://github.com/ClintonMorrison/lorikeet">open source</a>.
              It was created with Golang and React. If you like it you can <a href="https://ko-fi.com/T6T0VOWY">support me on Ko-fi</a>.
            </p>
          </div>
        </div>
      </div>

      <Link to="/register" className="sign-up-link waves-effect waves-light btn-large btn">Sign Up Now</Link>
    </div>
  );
}