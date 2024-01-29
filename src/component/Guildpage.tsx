import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const server = queryParams.get('server');
  const input = queryParams.get('input');

  return (
    <div>
      <h1>결과 페이지</h1>
      <p>선택된 서버: {server}</p>
      <p>입력된 값: {input}</p>
      {/* 여기에 기반하여 추가적인 컨텐츠 렌더링 */}
    </div>
  );
};

export default ResultPage;
