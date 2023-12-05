function toggleEditable(cell, subMemberName) {
  const input = cell.querySelector('input');
  const displayValue = cell.querySelector('.display-value');

  input.style.display = 'block';
  displayValue.style.display = 'none';

  input.focus();

  input.addEventListener('blur', async () => {
    input.style.display = 'none';
    displayValue.style.display = 'block';

    const newValue = input.value;
    console.log('Received subMemberName:', subMemberName);
    console.log('newValue:', newValue);
    // 여기서 서버에 업데이트 요청을 보내고 DB 값을 업데이트할 수 있습니다.
    await requestUpdateSubMember(subMemberName, newValue);
  });
}

async function requestUpdateSubMember(subMemberName, newValue) {
  // 서버에 업데이트 요청을 보내는 코드
  const response = await fetch(`/updateSubMember?subMemberName=${subMemberName}&newValue=${newValue}`, {
    method: 'POST',
  });

  // 서버에서 온 응답을 확인하고 필요한 작업을 수행
  if (response.ok) {
    console.log('본캐 추가 성공');
    
    // 리다이렉트 후에 새로고침
    window.location.reload();
  } else {
    console.error('본캐 추가 실패');
  }
}