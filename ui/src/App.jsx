import React from 'react';
import Footer from './components/Footer';
import Routes from './Routes';

// Services
import AuthService from "./services/AuthService";
import APIService from "./services/APIService";
import DocumentService from "./services/DocumentService";

import './App.scss';
import PreferencesService from './services/PreferencesService';

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

const preferencesService = new PreferencesService({
  onDarkModeChanged: () => {}
});

const services = {
  apiService,
  authService,
  documentService,
  preferencesService
};

window.services = services;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: preferencesService.isDarkModeEnabled()
    }

    preferencesService.onDarkModeChanged = (darkMode) => {
      this.setState({ darkMode: darkMode });
    }
  }
  render() {
    return (
      <div className={`cp-app ${this.state.darkMode ? 'dark-mode' : ''}`}>
        <Routes services={services} />
        <Footer />
      </div>
    );
  }
}

