import sha256 from 'crypto-js/sha256';
import AES  from 'crypto-js/aes';
import UTF_8 from 'crypto-js/enc-utf8';

const SALT_1 = 'CC352C99A14616AD22678563ECDA5';
const SALT_2 = '7767B9225CF66B418DD2A39CBC4AA';

export default class AuthService {
  constructor({ apiService }) {
    this.apiService = apiService;
    this.document = null;
  }

  hashPassword(password) {
    return sha256(password + SALT_1).toString();
  }

  hashToken(token) {
    return sha256(token + SALT_2).toString();
  }

  passwordMatchesSession(password) {
    return password && this.hashPassword(password) === this.getToken();
  }

  setCredentials({ username, password }) {
    sessionStorage.setItem('username', username);
    this.setToken(password);
  }

  setToken(password) {
    sessionStorage.setItem('token', this.hashPassword(password));
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

  logout() {
    sessionStorage.clear();
  }

  getHashedToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    return this.hashToken(token);
  }

  encryptWithToken(text, token = false) {
    token = token || this.getToken();
    return AES.encrypt(text, token).toString();
  }

  decryptWithToken(text) {
    const token = this.getToken();
    return AES.decrypt(text, token).toString(UTF_8);
  }

  getHeaders() {
    const username = this.getUsername();
    const token = this.getHashedToken();
    const encoded = btoa(`${username}:${token}`);
    return { 'Authorization': `Basic ${encoded}` };
  }
}
