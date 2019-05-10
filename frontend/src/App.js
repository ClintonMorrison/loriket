import React from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Routes from './Routes';

// Services
import AuthService from "./services/AuthService";

import './App.css';
import APIService from "./services/APIService";

// Instantiate services
const apiService = new APIService({
  baseURL: "http://localhost:8080/api/"
});

const authService = new AuthService({
  apiService
});

const services = {
  apiService,
  authService
};

window.services = services;

function App() {
  return (
    <div className="cp-app">
      <header>
        <Navigation />
      </header>

      <main className="container">
        <Routes services={services} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
