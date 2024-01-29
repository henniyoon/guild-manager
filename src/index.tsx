import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './component/Header';
import reportWebVitals from './reportWebVitals';
import SelectServer from './component/SelectServer';
import InputBox from './component/InputBox';
import Button from './component/Button';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {
  const [selectedServer, setSelectedServer] = useState('스카니아');
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = async () => {
    try {
      const serverParam = encodeURIComponent(selectedServer);
      const inputParam = encodeURIComponent(inputValue);
      const response = await fetch(`/guild?server=${serverParam}&input=${inputParam}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  }

  return (
    <React.StrictMode>
      <Header />
      <div className="MainPage-Contents">
        <SelectServer value={selectedServer} onChange={setSelectedServer} />
        <InputBox value={inputValue} onChange={setInputValue} />
        <Button onClick={handleButtonClick}>Enter</Button>
      </div>
    </React.StrictMode>
  );
}

root.render(<App />);

reportWebVitals();