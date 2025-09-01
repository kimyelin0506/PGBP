import axios from 'axios';

// 메타 태그에서 CSRF 정보 읽기
// function getCsrf() {
//     const token = document.querySelector("meta[name='_csrf']")?.getAttribute("content");
//     const header = document.querySelector("meta[name='_csrf_header']")?.getAttribute("content") || 'X-CSRF-TOKEN';
//     const param = document.querySelector("meta[name='_csrf_parameter']")?.getAttribute("content") || '_csrf';
//     return { token, header, param };
// }

const api = axios.create({
    baseURL: '/PINS',
    withCredentials: true,    // JSESSIONID & XSRF 쿠키 주고받기
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
      // xsrf 기본 이름은 axios가 이미 'XSRF-TOKEN' / 'X-CSRF-TOKEN'으로 가정함
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-CSRF-TOKEN',
});

// 요청마다 CSRF 헤더 추가
// api.interceptors.request.use(config => {
//     const { token, header } = getCsrf();
//     if (token && header) {
//         config.headers[header] = token;
//     }
//     return config;
// });

api.interceptors.response.use(
    res => res,
    err => {
        console.error(err);
        alert(err.response?.data?.message ?? '요청 실패');
        return Promise.reject(err);
    }
);

export default api;