import './style.css';

// 간단한 fetch 래퍼
export async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    credentials: 'include',
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : res.text();
}

// 개발 중엔 Vite 프록시가 /biz 호출을 톰캣으로 넘겨줌
// 운영에선 동일 도메인/컨텍스트에서 /biz 로 직접 호출됨
// const data = await api('/biz/02/02_01_010.do', { method: 'POST', body: JSON.stringify({ ... }) });
