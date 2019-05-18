// import sha256 from 'js-sha256';
import sha256 from 'crypto-js/sha256';
import AES  from 'crypto-js/aes';
import UTF_8 from 'crypto-js/enc-utf8';

import _ from 'lodash';

const SALT_1 = 'CC352C99A14616AD22678563ECDA5';
const SALT_2 = '7767B9225CF66B418DD2A39CBC4AA';

export default class AuthService {
  constructor({ apiService }) {
    this.apiService = apiService;
    this.document = null;
  }

  setCredentials({ username, password }) {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('token', sha256(password + SALT_1).toString());
  }

  sessionExists() {
    return !!(this.getUsername() && this.getToken());
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getHashedToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    return sha256(token + SALT_2).toString();
  }

  encryptWithToken(text) {
    const token = this.getToken();
    return AES.encrypt(text, token).toString();
  }

  decryptWithToken(text) {
    const token = this.getToken();
    return AES.decrypt(text, token).toString(UTF_8);
  }

  getHeaders() {
    const username = this.getUsername();
    const token = this.getHashedToken();
    console.log('heading to encode: ', `${username}:${token}`);
    const encoded = btoa(`${username}:${token}`);
    return { 'Authorization': `Basic ${encoded}` };
  }

  createDocument({ username, password }) {
    this.setCredentials({ username, password });
    return this.apiService.post("document", {}, this.getHeaders());
  }

  loadDocument() {
    return this.apiService.get("document", {}, this.getHeaders()).then(resp => {
      const rawDocument = _.get(resp, "data.document") || '{}';
      console.log(rawDocument);
      this.document = JSON.parse(rawDocument);
      return this.document;
    });
  }

  updateDocument() {

  }
}