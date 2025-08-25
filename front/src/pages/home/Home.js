// 필요한 CSS를 불러올 수 있음 (Vite는 ESM import로 CSS도 지원)
import '../../assets/style/style.css';

// Home 렌더링 함수
export function renderHome() {
  return `
    <h1>Welcome to the Home Page</h1>
    <p>This is a simple home page rendered by Home.js</p>
  `;
}