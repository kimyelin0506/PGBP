// SPA 라우터
import { renderHeader } from "../components/header.js";
import { renderHome } from "../pages/home/Home.js";
import { getPath } from "../helper/path.js";
import { renderApplication } from "../pages/applications/applications.js";
/*
    #/              : Home
    #/applications  : 신청서 작성/조회
    #/approvals     : 승인/반려 현황 조회
    #/dashboard     : 통계/대시보드
*/
export function router() {
    const app = document.getElementById('app');

    let content = '';
    switch (getPath()) {
        case '/applications':
            content = renderApplication();
            break;
        case '/approvals':
            content = '<h1>승인/반려 현황 조회</h1><p>공사중</p>';
            break;
        case '/dashboard':
            content = '<h1>통계/대시보드</h1><p>공사중</p>';
            break;
        case '/':
        default:
            content = renderHome();
            break;
    }

    app.innerHTML = `
        ${renderHeader()}
        <main>${content}</main>
        `;
}
