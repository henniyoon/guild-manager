import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import { AuthProvider } from './components/AuthContext';
import Footer from './components/Footer';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <App />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);