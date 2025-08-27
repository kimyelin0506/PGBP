import { Outlet } from 'react-router-dom';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';

// export default function Layout() {
//     return `
//     <>
//         <div>
//             <${renderHeader} />
//         </div>
//         <main>
//             <${Outlet} />
//         </main>
//         <${Footer} />
//     </>
//     `; 
// }

export function mountLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <header id="slot-header"></header>
    <div class="contents_wrap">
      <div id="container">
        <h2 id="slot-title"></h2>
        <div class="container_inner">
          <section id="slot-col1"></section>
          <section id="slot-col2"></section>
        </div>
      </div>
    </div>
    <footer id="slot-footer"></footer>
  `;
}

export function slots() {
    return {
        header: document.getElementById('slot-header'),
        title: document.getElementById('slot-title'),
        col1: document.getElementById('slot-col1'),
        col2: document.getElementById('slot-col2'),
        footer: document.getElementById('slot-footer'),
    }
}