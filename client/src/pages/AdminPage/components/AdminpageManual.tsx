// AdminPageManual.tsx
import React, { FC } from 'react';

const AdminPageManual: FC = () => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '10px'}}>관리자 페이지 이용 방법</h1>
    <style>
      {`
        .manual-list > li {
          margin-bottom: 10px;
        }
        .manual-list > li > strong {
          display: block;
          margin-bottom: 5px;
        }
        .sub-list, .sub-list ul {
          list-style-type: circle;
          padding-left: 40px; /* 서브 리스트의 들여쓰기를 더 깊게 조정 */
        }
        .sub-list li, .sub-list ul li {
          margin-bottom: 5px;
        }
      `}
    </style>
    <ol className="manual-list">
      <li>
        <strong>길드원 불러오기</strong>
        <ol className="sub-list">
          <li>원하는 주(week)을 선택합니다.</li>
          <li>길드원 불러오기 버튼을 클릭합니다.</li>
        </ol>
      </li>
      <li>
        <strong>이미지 첨부</strong>
        <ol className="sub-list">
          <li>인게임 길드컨텐츠 창의 스크린샷을 찍습니다.
            <ul>
              <li>메이플 해상도: 1366 x 768</li>
              <li>창의 왼쪽 상단에 길드컨텐츠 창이 오도록 배치</li>
              <li>닉네임 오름차순 정렬 후 1페이지부터 캡쳐</li>
              <img src="/SampleAdminImage.png" alt="sample" style={{ width: '300px', height: 'auto' }} />
            </ul>
          </li>
          <li>모든 이미지를 한 번에 첨부합니다.</li>
          <li>완료 메세지가 나타날 때까지 기다립니다.</li>
        </ol>
      </li>
      <li>
        <strong>데이터 확인</strong>
        <ol className="sub-list">
          <li>'행 추가', '선택된 행 삭제' 버튼을 사용하여 스크린샷 추출 데이터 수와 불러온 길드원 수를 비교합니다.</li>
        </ol>
      </li>
      <li>
        <strong>필터링</strong>
        <p>필터링 후 노블제한 여부를 저장합니다.</p>
      </li>
    </ol>
  </div>
);

export default AdminPageManual;
