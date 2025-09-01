
import { mountLayout } from './layout/layout.js';
import { router } from './router/router.js';
import { loginProc } from './global/biz/decorator.js';

// 레이아웃 먼저, 그다음 라우터
mountLayout();  // 최초 1회 레이아웃 구성

window.addEventListener('hashchange', router);

// 로딩시 바인딩
window.addEventListener('load', router);

// 로그인 클릭 버튼 이벤트 바인딩
document.body.addEventListener('click', e => {
    if (e.target && e.target.id === 'login_in_button') {
        loginProc();
    }
});
