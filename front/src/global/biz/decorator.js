// src/global/biz/decorator.js
import { userStore } from '../../lib/user.js';
import { csrfStore } from '../../lib/csrfStore.js';
import { notice } from '../../pages/biz/02/02.config.js';

// SPA 진입 시 CSRF 토큰 미리 발급

(async () => {
  try {
    if (csrfStore.getToken()) return; // 이미 있으면 재호출 방지 (HMR 대비)
    const csrfResp = await fetch('/PINS/biz/getCsrfToken.do', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await csrfResp.json();
    csrfStore.setToken(data.token);   // 전역적으로 토큰 저장 
    console.log('CSRF token pre-issued:', csrfStore.getToken());
  } catch (err) {
    console.error('CSRF 토큰 발급 실패', err);
  }
})();

export function initLoginHandlers() {
    const btn = document.getElementById('login_in_button');
    if (!btn) return;
    btn.addEventListener('click', loginProc);

    // 엔터키 지원
    ['P_LOGIN_ID','P_PWD'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginProc();
        }
        });
    });
}

export async function loginProc() {
    const id = document.getElementById('P_LOGIN_ID').value.trim();
    const pw = document.getElementById('P_PWD').value;

    if (!id) { alert('사번를 입력해주세요.'); return; }
    if (!pw) { alert('비밀번호를 입력해주세요.'); return; }

    const body = new URLSearchParams();
    body.set('P_PKG', 'BIZ_00');
    body.set('P_SP', 'SP_BIZ_LOGIN');
    body.set('P_LOGIN_ID', id);
    body.set('P_PWD', pw);
    body.set('_csrf', csrfStore.getToken());

    console.log(csrfStore.getToken());
    try {
        // 로그인 API 호출 시 CSRF 토큰 포함
        const response = await fetch('/PINS/biz/loginProc.do', {
          method: 'POST',
          credentials: 'include', // 세션 쿠키 포함
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-CSRF-TOKEN':  csrfStore.getToken()
          },
          body: body
        });

        const result = await response.json();
        console.log(result);
        if (result.rtnVal === 'SUCCESS') {
            // 로그인 성공, SPA 앱 초기화
            //initApp();
            // URL을 /login으로 설정
            alert("성공");
            
            // 유저 데이터 저장
            userStore.setUser(result.cursorData[0]);
            notice.USER_ID = userStore.getUser()?.USER_ID || '';  
            console.log(userStore.getUser());

            window.location.hash = '/biz/01/01_01_010.do';
        } else {
            document.getElementById('loginMsg').innerText = result.msg || "로그인 실패";
        }
    } catch (e) {
        // 공통 인터셉터에서 alert 처리됨
        console.log(e);
    }
}
