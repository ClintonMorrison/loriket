import _ from 'lodash';

export default class AuthService {
  constructor({ apiService, authService }) {
    this.apiService = apiService;
    this.authService = authService;
  }

  createDocument({ username, password }) {
    this.authService.setCredentials({ username, password });

    const initialDocument = JSON.stringify({ passwords: [] });
    const encryptedDocument = this.authService.encryptWithToken(initialDocument);

    return this.apiService.post("document", encryptedDocument, this.authService.getHeaders());
  }

  loadDocument() {
    return this.apiService.get("document", {}, this.authService.getHeaders()).then(resp => {
      console.log(resp);
      const encryptedDocument = _.get(resp, "data") || '{}';
      const decryptedDocument = this.authService.decryptWithToken(encryptedDocument);
      console.log(encryptedDocument, '->', decryptedDocument);
      this.document = JSON.parse(decryptedDocument);
      console.log(this.document);
      return this.document;
    });
  }

  updateDocument(document) {
    const unencryptedDocument = JSON.stringify(document);
    const encryptedDocument = this.authService.encryptWithToken(unencryptedDocument);

    return this.apiService.put("document", encryptedDocument, this.authService.getHeaders());
  }
}