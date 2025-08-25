// SPA 라우터
import { renderHeader } from "../components/header.js";
import { renderHome } from "../pages/home/Home.js";

export function router() {
    const app = document.getElementById('app');
    let content = '';

    switch (location.hash) {
        case '#/about':
            content = '<h1>About Page</h1><p>공사중</p>';
            break;
        case '#/home':
        default:
            content = renderHome();
            break;
    }

    app.innerHTML = `
        ${renderHeader()}
        <main>${content}</main>
        `;
}
