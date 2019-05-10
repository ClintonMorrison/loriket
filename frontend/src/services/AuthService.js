import sha256 from 'js-sha256';
import _ from 'lodash';

const SALT = 'CC352C99A14616AD22678563ECDA5';

export default class AuthService {
  constructor({ apiService }) {
    this.apiService = apiService;
    this.document = null;

    // TODO: debug
    this.setCredentials({
      username: 'c',
      password: 'c'
    });
  }

  setCredentials({ username, password }) {
    this.username = username;
    this.password = sha256(password + SALT);
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  getDocument() {
    return this.document;
  }

  getHeaders() {
    const username = this.getUsername();
    const password = this.getPassword();
    const encoded = btoa(`${username}:${password}`);
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
      this.document = JSON.parse(rawDocument)
      return this.document;
    });
  }

  updateDocument() {

  }
}