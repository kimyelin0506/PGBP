// src/router/router.js
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/biz/footer.js";
import { renderHomeInner } from "../pages/home/Home.js";
import { renderApplicationInner2, renderApplicationsInner } from "../pages/applications/applications.js";
import { renderApprovalsInner2, renderApprovalsInner } from "../pages/approvals/approvals.js";
import { getPath } from "../helper/path.js";
import { slots, initSlots } from "../layout/layout.js";
import { render01_01_010_containerInner2 } from "../pages/biz/01/01_01_010.js";
import { renderBizTopMenuHeader, renderBizLeftMenuHeader } from '../components/biz/header.js';
import { userStore } from "../lib/user.js";
import { renderMenu01_01_010 } from "../components/biz/topMenu.js";
import { renderLoading } from "../pages/loading.js";
import { render02_01_010_containerInner1, render02_01_010_containerInner2 } from "../pages/biz/02/02_01_010.js";
import { init02_01_010 } from "../components/biz/02/02_01_010.js";
import { render02_01_020 } from "../pages/biz/02/02_01_020.js";
import { renderLogin } from "../pages/biz/00/login.js";
import { formatDate } from "../lib/formateDate.js";
import { init02_01_020 } from "../components/biz/02/02_01_020.js";
import { render99_01_010Container_Inner2 } from "../pages/biz/99/99_01_010.js";
import { init99_01_010_beforeRender, init99_01_010_afterRender } from "../components/biz/99/99_01_010.js";

// css
import defaultCssUrl from "../assets/style/default.bundle.css?url";
import bizCssUrl     from "../assets/style/biz.bundle.css?url";

const ROUTE_CSS_ID = "route-style-link";

// 동적으로 css 적용
function applyCssForPath(path) {
    const isBiz = path.startsWith("/biz/");
    const href = isBiz ? bizCssUrl : defaultCssUrl;

    let link = document.getElementById(ROUTE_CSS_ID);
    if (!link) {
        link = document.createElement("link");
        link.id = ROUTE_CSS_ID;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    // 같은 파일이면 교체 생략
    if (link.getAttribute("href") === href) return;

    link.setAttribute("href", href);
}

export function router() {
    const path = getPath();
    applyCssForPath(path);  // 경로별 CSS 적용

    const s = slots(); // 매 라우팅 때마다 fresh하게 가져오기 (DOM 갱신 안전)
    initSlots();

    let title = '';
    let col1;
    let col2;

    if (userStore.getUser()) {
        s.header.innerHTML = renderBizTopMenuHeader(userStore.getUser());
        s.leftMenu.innerHTML = renderBizLeftMenuHeader();
    } else {
        s.header.innerHTML = renderHeader();
        s.leftMenu.innerHTML = '';
    }
    s.modal_root.innerHTML = renderLoading();

    switch (getPath()) {
        case '/applications':
            title = '신청서 작성';
            s.col1.innerHTML  = renderApplicationsInner();
            s.col2.innerHTML  = renderApplicationInner2();
            break;
        case '/approvals':
            title = '승인/반려 현황 조회';
            s.col1.innerHTML  = renderApprovalsInner();
            s.col2.innerHTML  = renderApprovalsInner2();
            break;
        case '/dashboard':
            title = '통계/대시보드';
            col1  = '';
            col2  = '';
            break;
        case '/login':
            title = '로그인';
            s.col1.innerHTML = renderLogin();
            break;
        case '/biz/01/01_01_010.do':
            title = '배출량확인서 전체목록';
            s.col2.innerHTML = render01_01_010_containerInner2();
            renderMenu01_01_010();
            break;
        case '/biz/02/02_01_010.do':
            title = '게시글 전체 목록'
            s.col1.innerHTML = render02_01_010_containerInner1();
            s.col2.innerHTML = render02_01_010_containerInner2();
            init02_01_010();
            break;
        case '/biz/02/02_01_020.do':
            title = '공지사항 작성하기';
            s.col2.innerHTML = render02_01_020(userStore.getUser().USER_ID,
                                    userStore.getUser().USER_ROLE, formatDate(new Date()));
            init02_01_020();
            break;
        case '/':
            title = '공단 사용자 목록';
            
            s.col2.innerHTML = render99_01_010Container_Inner2();
            init99_01_010_beforeRender();
            init99_01_010_afterRender();
            break;
        case '/':
        default:
            title = 'HOME';
            col1  = '';
            s.col2.innerHTML  = renderHomeInner();
            break;
    }

    // 공통 헤더/푸터
    s.footer.innerHTML = renderFooter();
    // 슬롯에만 채운다 (부모 innerHTML로 자식 삭제 금지!)
    s.title.textContent = title;
}
