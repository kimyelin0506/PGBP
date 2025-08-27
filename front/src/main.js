import { mountLayout } from './layout/layout.js';
import { router } from './router/router.js';

// 레이아웃 먼저, 그다음 라우터
mountLayout();  // 최초 1회 레이아웃 구성

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

