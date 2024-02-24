import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = () => {
    const handleRedirect = () => {
        window.location.href = 'https://discord.gg/bhMtQeTMjn';
    };

    return (
        <Box
            mt={3}
            p={4}
            textAlign="center"
            color="text.secondary"
            style={{ fontSize: '12px' }}
        >
            <Box mb={1}>
            <svg
                    onClick={handleRedirect}
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    className="bi bi-discord"
                    viewBox="0 0 16 16"
                    style={{ cursor: 'pointer' }} // 마우스 커서를 포인터로 변경
                >
                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                </svg>
            </Box>
            <Typography variant="body2">
                Copyright 2024. 스카니아@임채아@헨쁘 all rights reserved
            </Typography>
            <Typography variant="body2">
                This site is not associated with NEXON Korea. Data sourced from NEXON OpenAPI.
            </Typography>
        </Box>
    );
};

export default Footer;
