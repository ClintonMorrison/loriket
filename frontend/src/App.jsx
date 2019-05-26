import React from 'react';
import Footer from './components/Footer';
import Routes from './Routes';

// Services
import AuthService from "./services/AuthService";
import APIService from "./services/APIService";
import DocumentService from "./services/DocumentService";

import './App.scss';

// Instantiate services
const apiService = new APIService({
  baseURL: `${window.location.origin}/api/`
});

const authService = new AuthService({
  apiService
});

const documentService = new DocumentService({
  authService,
  apiService
});

const services = {
  apiService,
  authService,
  documentService
};

window.services = services;

function App() {
  return (
    <div className="cp-app">
      <Routes services={services} />
      <Footer />
    </div>
  );
}

export default App;
