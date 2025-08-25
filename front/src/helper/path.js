const PREFIX = '/PGBP/app';

export function getPath() {
  let path = location.hash.replace('#', '');
  if (path.startsWith(PREFIX)) {
    path = path.substring(PREFIX.length);
  }
  return path || '/';  // 기본 경로 처리
}