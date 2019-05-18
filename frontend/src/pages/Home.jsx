import React from 'react';

import './Home.scss';

export default function Home() {
  return (
    <div className="cp-home">
      <h4>Securely store your passwords</h4>


      <div className="bird-banner">
        <img src="https://placekitten.com/g/200/300" />
      </div>

      <div className="row">
        <div className="col s4">
          <div className="center promo promo-example">
            <i className="material-icons large">sentiment_very_satisfied</i>
            <h5 className="promo-caption">Easy</h5>
            <p className="light center">
              You can stop keeping track of your passwords. It's easy to check them at home or on the go with Lorikeet.
            </p>
          </div>
        </div>

        <div className="col s4">
          <div className="center promo promo-example">
            <i className="material-icons large">security</i>
            <h5 className="promo-caption">Secure</h5>
            <p className="light center">
              With strong AES encryption on the client-side and server-side, you don't need to worry about your passwords.
            </p>
          </div>
        </div>

        <div className="col s4">
          <div className="center promo promo-example">
            <i className="material-icons large">attach_money</i>
            <h5 className="promo-caption">Free</h5>
            <p className="light center">
              Lorikeet is free to use, and <a href="https://github.com/ClintonMorrison/lorikeet">open source</a>.
              It was created with Golang and React. If you like it you can <a href="https://ko-fi.com/T6T0VOWY">support me on Ko-fi</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}