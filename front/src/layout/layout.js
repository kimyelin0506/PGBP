
// index의 id=app인 div 안에 최초로 한번만 그림
export function mountLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <header id="header"></header>
    <div class="contents_wrap">
      <div id="container">
        <h2 id="title"></h2>
        <div id="hidden-title"></div>
        <div class="container_inner">
          <section id="container_inner"></section>
          <section id="container_inner2"></section>
        </div>
      </div>
    </div>
    <footer id="footer"></footer>
    <div id='leftMenu'></div>
    <!-- 전역 모달 루트 (라우팅과 무관하게 유지) -->
    <div id="modal-root"></div>
  `;
}

// 각각 헤더, 타이틀, 슬롯, 푸터 지정
export function slots() {
    return {
        header: document.getElementById('header'),
        title: document.getElementById('title'),
        hidden_title: document.getElementById('hidden-title'),
        col1: document.getElementById('container_inner'),
        col2: document.getElementById('container_inner2'),
        footer: document.getElementById('footer'),
        modal_root: document.getElementById('modal-root'),
        leftMenu: document.getElementById('leftMenu'),
    }
}

export function initSlots() {
    const s = slots();
    s.header.innerHTML = '';
    s.title.innerHTML = '';
    s.hidden_title.innerHTML = '';
    s.col1.innerHTML = '';
    s.col2.innerHTML = '';
    s.modal_root.innerHTML = '';
    s.leftMenu.innerHTML = '';
}