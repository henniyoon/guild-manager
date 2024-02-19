import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography, Grid } from '@mui/material';
import SelectServer from './components/SelectServer';
import InputBox from './components/InputBox';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import './styles/Mainpage.css';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'top',
        alignItems: 'center',
        height: '60vh',
        // background: `url("./main.png") no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <form onSubmit={handleButtonClick} style={{ width: '100%', marginTop: 20 }}>
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item>
            <SelectServer value={worldName} onChange={setSelectedServer} />
          </Grid>
          <Grid item>
            <InputBox value={guildName} onChange={setInputValue} />
          </Grid>
          <Grid item>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Mainpage;
