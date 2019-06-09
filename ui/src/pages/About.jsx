import React from 'react';
import _ from 'lodash';

import TextField from '../components/forms/TextField';

export default class About extends React.Component {
  render() {
    return (
      <div className="cp-about">
        <h1>About</h1>

        <p>
          Lorikeet is a personal project, created by <a href="https://clintonmorrison.com">Clinton Morrison</a>
          and <a href="#TODO">Emma MacDonald</a>.

          It is designed to be a simple and secure online password manager.
          We built a password manager we love because we weren't happy with existing ones.
        </p>

        <p>
          All the code for Lorikeet is on <a href="https://github.com/ClintonMorrison/lorikeet">GitHub</a>.
          Lorikeet is built with <a href="https://golang.org/">Golang</a>, <a href="https://reactjs.org/">React</a>, and <a href="https://materializecss.com">Materialize CSS</a>.
        </p>

        <h2>Security</h2>

        <p>
          Security was our main focus in Lorikeet. This led to some unconventional decisions.
          Unlike other online services, you cannot reset your password if you forget it.
          This is because of how your passwords are encrypted. We cannot reset your password
          because we do not store your password. We don't have the ability to decrypt your passwords.
        </p>


        <p>
          If you enter incorrect credentials several times in a row your account will be locked for a few hours.
          This helps keep your account safe, by making it difficult for others to guess your password.
        </p>

        <p>
          Neither your login information or your stored passwords are ever sent to the server.

          When you login, an obfuscated copy of your Lorikeet username and password are stored temporarily in your browser session storage.
          A special token derived from your credentials is sent to the server when you login.
        </p>

        <p>
          When you add passwords, they are encrypted in the browser using your Lorikeet credentials.
          Our servers only ever receive this encrypted password data, never your real passwords.
          On the server it is encrypted a second time with your token, your username, and a salt.

          When we retrieve your passwords, they are partially decrypted on the server with your token.

          In the browser, the original passwords are recovered using your credentials.
        </p>

        <p>
          We use strong AES encryption, and SHA256 hashing.
          All requests to the server are also sent over HTTPS.
        </p>

        <h2>Contact</h2>
        If you have feedback, suggestions, or comments, we would love to hear from you.
        You can send us an email at{' '}
        <a href="email:clintonmorrison2@gmail.com">clintonmorrison2@gmail.com</a>.
        You can also reach out on <a href="https://twitter.com/clint_morrison">Twitter</a>.

        <h2>Support Us</h2>

        <p>
          We created Lorikeet for fun; not for profit. It is currently not monetized in any way.
          If you like Lorikeet, you can <a href="https://ko-fi.com/T6T0VOWY">support us on Ko-fi</a>.
        </p>
      </div>
    );

  }
}