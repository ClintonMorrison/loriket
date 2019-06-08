import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

export default class About extends React.Component {
  render() {
    return (
      <div className="about">
        <h1>About</h1>

        <p>
          Lorikeet is a personal project, created by <a href="https://clintonmorrison.com">Clinton Morrison</a>.
          It is designed to be a simple and secure online password manager.
          After you register for an account, you can login to Lorikeet to access your passwords at any time.
          You can add, remove, edit, sort, and search for passwords.
          Lorikeet works great on both computers and phones.
        </p>

        <p>
          Unlike other online services, you cannot reset your password if you forget it.
          This is because of how your passwords are encrypted. We cannot reset your password
          because we do not store your password. We don't have the ability to decrypt your passwords.
        </p>

        <p>
          It is easy to stop using Lorikeet any time you want.
          You can export your passwords as a CSV at any time.
          We will delete all your account data at your request as well.
          Just login and click "Delete All Data" on the "My Account" page.
        </p>

        <p>
          If you enter incorrect credentials several times in a row your account will be locked for a few hours.
          This helps keep your account safe, by making it difficult for others to guess your password.
        </p>


        <p>
          All the code for Lorikeet is on <a href="https://github.com/ClintonMorrison/lorikeet">GitHub</a>.
          Lorikeet is built with <a href="https://golang.org/">Golang</a>, <a href="https://reactjs.org/">React</a>, and <a href="https://materializecss.com">Materialize CSS</a>.
        </p>

        <p>
          Neither your login information or your stored passwords are ever sent to the server.


          When you login, an obfuscated copy of your Lorikeet username and password are stored temporarily in your browser session storage.
          A special token derived from your credentials is sent to the server when you login.
        </p>

        <p>
          When you add passwords, they are encrypted in the browser using your Lorikeet credentials.
          Our servers only ever receive this encrypted password data, never your real passwords.
          On the server it is encrypted a second time with your token, a username, and a salt, and is stored in a file on the server.

          When we retrieve your passwords, they are partially decrypted on the server with your token.

          In the browser, the original passwords are recovered using your credentials.
        </p>

        <p>
          If you like Lorikeet, you can <a href="https://ko-fi.com/T6T0VOWY">support me on Ko-fi</a>.
        </p>
      </div>
    );

  }
}