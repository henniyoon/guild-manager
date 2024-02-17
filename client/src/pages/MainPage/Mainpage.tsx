import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Mainpage.css'
import SelectServer from './components/SelectServer';
import InputBox from './components/InputBox';
import Button from '../../components/Button';

const Mainpage = () => {
  const navigate = useNavigate();
  const [worldName, setSelectedServer] = useState('스카니아');
  const [guildName, setInputValue] = useState('별빛');

  const handleButtonClick = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 서버에 데이터를 전송하는 fetch 사용
      await fetch(`/GuildPage/${encodeURIComponent(worldName)}/${encodeURIComponent(guildName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 필요에 따라 적절한 Content-Type 설정
        },
        // body에 필요한 데이터를 JSON 형태로 전달
        body: JSON.stringify({
          worldName: encodeURIComponent(worldName),
          guildName: encodeURIComponent(guildName),
        }),
      });

      // 성공적으로 요청이 완료되면 페이지 이동
      navigate(`/GuildPage/${encodeURIComponent(worldName)}/${encodeURIComponent(guildName)}`);
    } catch (error) {
      // 에러 처리
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='position-relative'>
      <img src="./main.png" alt="Guild Page" className="w-100" />

      <div className='position-absolute top-50 start-50 translate-middle'>
        <form onSubmit={handleButtonClick} className='d-flex flex-column align-items-center'>
          <div className='d-flex w-100 bg-dark rounded'>
            <div className='flex-grow-1'>
              <SelectServer value={worldName} onChange={setSelectedServer} />
            </div>
            <div className='flex-grow-1'>
              <InputBox value={guildName} onChange={setInputValue}/>
            </div>
            <button type='submit' className='btn d-flex flex-grow-1 align-items-center'>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M16.625 14.875C17.0938 15.375 17.0938 16.1562 16.625 16.6562C16.125 17.125 15.3438 17.125 14.8438 16.6562L11.125 12.9062C9.84375 13.75 8.28125 14.1875 6.59375 13.9688C3.71875 13.5625 1.40625 11.2188 1.03125 8.375C0.5 4.125 4.09375 0.53125 8.34375 1.0625C11.1875 1.4375 13.5312 3.75 13.9375 6.625C14.1562 8.3125 13.7188 9.875 12.875 11.125L16.625 14.875ZM3.46875 7.5C3.46875 9.71875 5.25 11.5 7.46875 11.5C9.65625 11.5 11.4688 9.71875 11.4688 7.5C11.4688 5.3125 9.65625 3.5 7.46875 3.5C5.25 3.5 3.46875 5.3125 3.46875 7.5Z" fill="#5CB85C"></path></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );




};

export default Mainpage;
