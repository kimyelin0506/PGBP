// 필요한 CSS를 불러올 수 있음 (Vite는 ESM import로 CSS도 지원)
import '../../assets/style/style.css';

// Home 렌더링 함수
export function renderHome() {
  return `
    <span>이 사이트는 다음과 같은 기능을 제공합니다.</span>
    <p>신청서 작성/조회</p>
    <p>승인/반려 현황 조회</p>
    <p>통계/대시보드</p>
  `;
}