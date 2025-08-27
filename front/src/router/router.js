// src/router/router.js
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { renderHomeInner } from "../pages/home/Home.js";
import { renderApplicationInner2, renderApplicationsInner } from "../pages/applications/applications.js";
import { renderApprovalsInner2, renderApprovalsInner } from "../pages/approvals/approvals.js";
import { getPath } from "../helper/path.js";
import { slots } from "../layout/layout.js";

export function router() {
    const s = slots(); // 매 라우팅 때마다 fresh하게 가져오기 (DOM 갱신 안전)

    let title = '';
    let col1 = '';
    let col2 = '';

    switch (getPath()) {
        case '/applications':
            title = '신청서 작성';
            col1  = renderApplicationsInner();
            col2  = renderApplicationInner2();
            break;
        case '/approvals':
            title = '승인/반려 현황 조회';
            col1  = renderApprovalsInner();
            col2  = renderApprovalsInner2();
            break;
        case '/dashboard':
            title = '통계/대시보드';
            col1  = '';
            col2  = '';
            break;
        case '/':
        default:
            title = 'HOME';
            col1  = '';
            col2  = renderHomeInner();
            break;
    }

    // 공통 헤더/푸터
    s.header.innerHTML = renderHeader();
    s.footer.innerHTML = renderFooter();
    // 슬롯에만 채운다 (부모 innerHTML로 자식 삭제 금지!)
    s.title.textContent = title;
    s.col1.innerHTML = col1 || '';
    s.col2.innerHTML = col2 || '';
}
