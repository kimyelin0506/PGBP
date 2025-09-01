# PGBP – Vite SPA 구조 정리 (Architecture & Guide)

> 본 문서는 Vite 기반 해시 라우팅 SPA의 화면/라우팅/보안/상태 관리 구조를 정리하고, 실서비스 수준 안정성을 위한 권장 수정 사항을 포함합니다.

---

## 1. 전체 개요

- **런타임**: Vite(ESM), 해시 라우팅(`#`), DOM 슬롯 기반 레이아웃
- **진입점**: `index.html` → `src/main.js` → `router()`
- **레이아웃**: `mountLayout()`이 공통 영역 헤더/타이틀/컨텐츠/푸터/좌메뉴/모달을 구성
- **라우팅**: 해시 경로를 `getPath()`로 파싱 → `router()`가 슬롯에 화면 조립
- **스타일**: 경로별 CSS 번들 동적 교체(`default.bundle.css` ↔ `biz.bundle.css`)
- **보안**: `/biz/**`는 인증 가드(로그인 필수), CSRF 토큰 사전 발급 및 요청에 포함
- **상태**: `userStore`(유저), `csrfStore`(CSRF) 전역 스토어

---

## 2. 파일별 역할

### 2.1 `index.html`
- SPA 루트. `#app`을 렌더 타깃으로 두고 `type="module"`로 `src/main.js`를 로드.
- 권장: 모바일 대응을 위해 아래 메타 추가
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ```

### 2.2 `src/main.js`
- `mountLayout()`로 공통 레이아웃 1회 구성.
- `hashchange`/`load` 이벤트에 `router()` 연결.
- **중요**: 로그인 버튼 바인딩은 `/login` 페이지가 렌더된 직후에만 수행(= `router()` 내부에서 `initLoginHandlers()` 호출). 전역 델리게이션과 **중복 바인딩 금지**.

### 2.3 `src/layout/layout.js`
- `mountLayout()`이 공통 레이아웃을 `#app` 내부에 배치.
- `slots()`는 헤더/타이틀/컨텐츠/푸터/좌메뉴/모달 등 **DOM 참조를 반환**.
- `initSlots()`는 라우팅마다 **슬롯 내부만** 빈 상태로 초기화(부모 교체로 이벤트 파괴 방지).

### 2.4 `src/router/router.js`
- `getPath()`로 현재 경로 계산 → `applyCssForPath(path)`로 CSS 번들 교체.
- `userStore`로 로그인 상태에 따라 헤더/좌메뉴 분기.
- **인증 가드**: `path.startsWith('/biz/')` 인 경우 로그인 필수. 미로그인 시 `/login`으로 리다이렉트.
- 라우팅 시작 시 로딩 모달 표시, **라우팅 완료 후 제거**.
- `case '/'` **중복 금지**. “공단 사용자 목록”은 `/users` 등 **별도 경로**로 분리.

### 2.5 `src/helper/path.js`
- `location.hash`에서 `#`를 제거하고 선택적 `PREFIX('/PGBP/app')`를 제외한 **정제된 경로** 반환.
- 빈 경로는 `'/'`로 통일, `decodeURI` 및 여분 슬래시 정리로 안정성 강화.

### 2.6 `src/lib/user.js` (`userStore`)
- 로그인 성공 시 서버 응답의 유저 오브젝트를 저장/조회/초기화.

### 2.7 `src/lib/csrfStore.js` (`csrfStore`)
- CSRF 토큰을 1회 발급/보관하여 요청 시 재사용.

### 2.8 `src/global/biz/decorator.js`
- 앱 진입 시 **CSRF 토큰 사전 발급**(이미 있으면 스킵; HMR 대비).
- 로그인 처리: 폼 값 검증 → `X-CSRF-TOKEN` 헤더와 `_csrf` 바디에 토큰 포함 → 성공 시 `userStore` 저장, 보호 경로로 이동.
- `initLoginHandlers()`는 **렌더 직후 1회만** 바인딩하도록 `dataset.bound`로 중복 방지.

---

## 3. 라우팅 규칙 (예시 표)

| 경로 | 페이지 타이틀 | 슬롯 채움(col1/col2) | 인증 필요 | CSS 번들 |
|---|---|---|---|---|
| `/` | HOME | col2 = `renderHomeInner()` | ✗ | `default.bundle.css` |
| `/login` | 로그인 | col1 = `renderLogin()` → `initLoginHandlers()` | ✗ | `default.bundle.css` |
| `/applications` | 신청서 작성 | col1 = `renderApplicationsInner()`, col2 = `renderApplicationInner2()` | ✗ | `default.bundle.css` |
| `/approvals` | 승인/반려 현황 조회 | col1 = `renderApprovalsInner()`, col2 = `renderApprovalsInner2()` | ✗ | `default.bundle.css` |
| `/dashboard` | 통계/대시보드 | 필요한 슬롯만 채움 | (정책에 따라) | 경로 정책에 따름 |
| `/biz/01/01_01_010.do` | 배출량확인서 전체목록 | col2 = `render01_01_010_containerInner2()` → `renderMenu01_01_010()` | **✓** | `biz.bundle.css` |
| `/biz/02/02_01_010.do` | 게시글 전체 목록 | col1 = `render02_01_010_containerInner1()`, col2 = `render02_01_010_containerInner2()` → `init02_01_010()` | **✓** | `biz.bundle.css` |
| `/biz/02/02_01_020.do` | 공지사항 작성하기 | col2 = `render02_01_020(usr.USER_ID, usr.USER_ROLE, formatDate(new Date()))` → `init02_01_020()` | **✓** | `biz.bundle.css` |
| `/users` | 공단 사용자 목록 | col2 = `render99_01_010Container_Inner2()` → 초기화 2단계 | (정책에 따라) | 경로 정책에 따름 |

> **주의**: `/biz/**`는 로그인 필요. 미로그인 접근 시 `/login`으로 리다이렉트.

---

## 4. 필수 수정 사항 (핵심 체크리스트)

1. **`case '/'` 중복 제거**  
   - “HOME”과 “공단 사용자 목록”을 **별도 경로**로 분리(`/users` 권장).

2. **로그인 핸들러 단일화**  
   - `/login` 라우트 렌더 **직후**에만 `initLoginHandlers()` 호출.  
   - `main.js`의 전역 `document.body` 델리게이션 버튼 바인딩 **제거**.

3. **인증 가드 도입**  
   - `requireAuth`(예: `path.startsWith('/biz/')`) 체크 후 미로그인 시 `/login`으로 이동.

4. **로딩 스피너 라이프사이클**  
   - 라우팅 시작 시 표시 → 스위치 처리 후 **반드시 제거**.

5. **`getPath()` 안정화**  
   - PREFIX 유무 모두 처리, 빈 경로 `'/'`, `decodeURI`, 여분 슬래시 정리.

6. **CSRF 토큰 재발급 방지**  
   - `csrfStore`에 이미 값이 있으면 발급 스킵(HMR 대비).

7. **널 안전성 보강**  
   - 유저 값 접근 전 `userStore.getUser()` 존재 체크(특히 `/biz/02/02_01_020.do`).

8. **동적 CSS 교체 최적화**  
   - 현재 `href`와 동일하면 교체 스킵(이미 구현). 필요시 `link.onload`로 깜빡임 최소화.

---

## 5. 핵심 코드 스니펫 (레퍼런스)

### 5.1 인증 가드 & 로딩 제어
```js
function requireAuth(path) {
  return path.startsWith('/biz/');
}

export function router() {
  const path = getPath();
  applyCssForPath(path);

  const s = slots();
  initSlots();

  if (userStore.getUser()) {
    s.header.innerHTML = renderBizTopMenuHeader(userStore.getUser());
    s.leftMenu.innerHTML = renderBizLeftMenuHeader();
  } else {
    s.header.innerHTML = renderHeader();
    s.leftMenu.innerHTML = '';
  }

  if (requireAuth(path) && !userStore.getUser()) {
    window.location.hash = '/login';
    return;
  }

  s.modal_root.innerHTML = renderLoading(); // 시작
  // ... switch(path) ...
  s.modal_root.innerHTML = ''; // 완료
}
```

### 5.2 `getPath()` 안정화
```js
const PREFIX = '/PGBP/app';

export function getPath() {
  let raw = (location.hash || '').replace(/^#/, '');
  if (raw.startsWith(PREFIX)) raw = raw.slice(PREFIX.length);

  let path = raw || '/';
  try { path = decodeURI(path); } catch {}
  path = path.replace(/\/{2,}/g, '/');

  return path;
}
```

### 5.3 로그인 핸들러(중복 방지)
```js
export function initLoginHandlers() {
  const btn = document.getElementById('login_in_button');
  if (btn && !btn.dataset.bound) {
    btn.addEventListener('click', loginProc);
    btn.dataset.bound = '1';
  }

  ['P_LOGIN_ID','P_PWD'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.bound) {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          loginProc();
        }
      });
      el.dataset.bound = '1';
    }
  });
}
```

### 5.4 CSRF 토큰 사전 발급 (HMR 대비)
```js
(async () => {
  try {
    if (csrfStore.getToken()) return; // 이미 있으면 스킵
    const csrfResp = await fetch('/PINS/biz/getCsrfToken.do', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await csrfResp.json();
    csrfStore.setToken(data.token);
  } catch (err) {
    console.error('CSRF 토큰 발급 실패', err);
  }
})();
```

---

## 6. 베스트 프랙티스 & 팁

- **이벤트 바인딩의 타이밍**: DOM을 생성하는 라우트가 **렌더된 직후**에만 바인딩. 전역 위임은 최소화.
- **슬롯 초기화 전략**: 부모 컨테이너를 다시 그리지 말고, 슬롯 내부만 초기화해 기존 이벤트 파괴 방지.
- **CSS 번들 교체**: 같은 파일이면 교체 스킵. 필요 시 `link.onload`에서 교체 또는 prefetch.
- **예외 처리**: 라우팅/로그인/데이터 로딩에서 `try/catch`와 사용자 메시지를 명확히 표출.
- **경로 명료성**: 기본 홈(`/`)과 목록 페이지(`/users`)를 분리해 중복/충돌 방지.
- **배포 경로**: 서브 디렉토리 배포 시 `vite.config.js`의 `base` 설정 고려.

---

## 7. 흐름 요약 (Sequence)

1. **초기 진입**: `index.html` → `main.js` → `mountLayout()` → `router()`
2. **경로 파싱**: `getPath()`로 현재 경로 계산
3. **보안/스타일**: 인증 가드 확인, 경로별 CSS 적용
4. **화면 조립**: `initSlots()` 후 슬롯에 컴포넌트 렌더 & 초기화
5. **완료 처리**: 로딩 제거, 이벤트 핸들러(예: 로그인) 바인딩
6. **내비게이션**: 해시 변경 시 동일 사이클 반복

---

## 8. 변경 포인트 요약

- `case '/'` **중복 제거**, `/users` 분리
- 로그인 바인딩 **단일화** (라우트 렌더 후 1회)
- `/biz/**` **인증 가드**
- **스피너** 표시/해제 위치 명확화
- `getPath()` **안정화**
- CSRF **중복 발급 방지**
- 유저 접근 전 **널 체크**

---

## 9. 부록: 권장 vite.config 예시 (선택)
```js
import { defineConfig } from 'vite';

export default defineConfig({
  // 배포 하위 경로가 있을 경우
  // base: '/PGBP/app/',
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url)), // 경로 별칭 예시
    },
  },
});
```

---

**Author**: 김예린 프로젝트 – Vite SPA 구조 문서화  
**Last Updated**: YYYY-MM-DD