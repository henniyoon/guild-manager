import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './component/Header';
import reportWebVitals from './reportWebVitals';
import SelectServer from './component/SelectServer';
import InputBox from './component/InputBox';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Header />
    <div className="MainPage-Contents">
    <SelectServer />
    <InputBox />
    </div>
  </React.StrictMode>
);

reportWebVitals();
