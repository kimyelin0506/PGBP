// SPA 라우터
import { renderHeader } from "../components/header.js";
import { renderHome } from "../pages/home/Home.js";
import { getPath } from "../helper/path.js";
import { renderApplication } from "../pages/applications/applications.js";
import { renderApprovals } from "../pages/approvals/approvals.js";

/*
    #/              : Home
    #/applications  : 신청서 작성/조회
    #/approvals     : 승인/반려 현황 조회
    #/dashboard     : 통계/대시보드
*/
export function router() {
    const header = document.getElementById('header');
    const container_title = document.getElementById('container_title');
    const container_inner = document.getElementById('container_inner');

    let title_content = '';
    let container_inner_content = '';
    switch (getPath()) {
        case '/applications':
            title_content = '신청서 작성';
            container_inner_content = renderApplication();
            break;
        case '/approvals':
            title_content = '승인/반려 현황 조회';
            container_inner_content = renderApprovals();
            break;
        case '/dashboard':
            title_content = '통계/대시보드';
            break;
        case '/':
        default:
            title_content = "HOME";
            container_inner_content = renderHome();
            break;
    }

    header.innerHTML = ` ${renderHeader()}`;

    container_title.innerHTML = `
        ${title_content}
        `;

    container_inner.innerHTML = `
        ${container_inner_content}
        `;
}
