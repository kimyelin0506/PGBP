import { postSubmit } from "../../lib/common.js";
import { userStore } from '../../lib/user.js';
import { csrfStore } from '../../lib/csrfStore.js'; 
// import { getPath } from '../helper/path.js'; // 필요시

export async function leftMenuSet(menuId) {
    const user = userStore.getUser();
    const role = user?.USER_ROLE || '';   // null-safe
    const menuEl = document.getElementById('menu');
    if (!menuEl) return;

    // 항상 처음에 초기화 (jQuery의 .html(...)과 동일한 효과)
    menuEl.innerHTML = '';

    // ADMIN 또는 USER + 99(시스템) 레벨1 진입 시: 정적 메뉴 구성
    const isAdmin = role === 'ADMIN';
    const isUserSys = role === 'USER' && menuId.substring(0, 2) === '99';

    if (isAdmin || isUserSys) {
        const li = document.createElement('li');
        li.id = 'left99_01';
        li.className = 'include on';

        const a = document.createElement('a');
        a.href = '#';
        a.className = 'm1la';
        a.textContent = '시스템 관리';
        a.addEventListener('click', e => { e.preventDefault(); leftMenuCtrl('99_01'); });

        const ul = document.createElement('ul');
        ul.id = 'left_um99_01';
        ul.className = 'depth2_list';

        const items = [
            { id: 'left99_01_010', url: '/PINS/biz/99/99_01_010.do', text: '공단사용자목록' },
            { id: 'left99_01_020', url: '/PINS/biz/99/99_01_020.do', text: '메뉴관리' },
            { id: 'left99_01_030', url: '/PINS/biz/99/99_01_030.do', text: '그룹관리' },
            { id: 'left99_01_040', url: '/PINS/biz/99/99_01_040.do', text: '그룹별메뉴관리' },
            { id: 'left99_01_050', url: '/PINS/biz/99/99_01_050.do', text: '첨부파일관리' },
        ];

        for (const it of items) {
            const subLi = document.createElement('li');
            subLi.id = it.id;

            const subA = document.createElement('a');
            subA.href = '#';
            subA.title = it.url.replace(/^\//, '');
            subA.textContent = it.text;
            subA.addEventListener('click', e => { e.preventDefault(); postSubmit(it.url, {}); });

            subLi.appendChild(subA);
            ul.appendChild(subLi);
        }

        li.append(a, ul);
        menuEl.appendChild(li);

        // 선택 표시
        const selected = document.getElementById(`left${menuId}`);
        if (selected) selected.className = 'include on';
        return;
    }

    // 일반(관리자 아님) 메뉴: 서버에서 받아서 구성
    const payload = {
        P_PKG: 'BIZ_00',
        P_SP: 'SP_BIZ_LEFTMENU_GET',
        P_LVL1_MENU_ID: menuId.substring(0, 2),
    };

    try {
        const resp = await fetch('/PINS/common/SP_L.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // 서버가 폼을 요구하면 x-www-form-urlencoded로 변경
                'X-CSRF-TOKEN': csrfStore.getToken(),
            },
            body: new URLSearchParams(payload), // 폼이라면 new URLSearchParams(payload)
        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const result = await resp.json(); // 꼭 await + () 호출
        const list = Array.isArray(result.list) ? result.list : [];

        // 중메뉴(MENU_LVL === '2')
        for (const item of list) {
        if (item.MENU_LVL === '2') {
            const li = document.createElement('li');
            li.id = `left${item.MENU_ID}`;
            li.className = 'include';

            const a = document.createElement('a');
            a.href = '#';
            a.className = 'm1la';
            a.textContent = item.MENU_NM;
            a.addEventListener('click', e => { e.preventDefault(); leftMenuCtrl(item.MENU_ID); });

            const ul = document.createElement('ul');
            ul.id = `left_um${item.MENU_ID}`;
            ul.className = 'depth2_list';

            li.append(a, ul);
            menuEl.appendChild(li);
        }
        }

        // 소메뉴(MENU_LVL === '3')
        for (const item of list) {
            if (item.MENU_LVL === '3') {
                const li = document.createElement('li');
                li.id = `left${item.MENU_ID}`;

                const a = document.createElement('a');
                a.href = '#';
                a.textContent = item.MENU_NM;

                if (!item.MENU_URL) {
                    a.addEventListener('click', () => {alert('준비중입니다.')});
                } else {
                    a.href = '#/' + item.MENU_URL;
                }

                li.appendChild(a);

                // 부모 중메뉴 ul에 붙이기
                const parentUl = document.getElementById(`left_um${item.PARENT_MENU_ID}`);
                if (parentUl) parentUl.appendChild(li);
            }
        }

        // 전체 펼침 + 현재 메뉴 강조
        document.querySelectorAll('#menu .include').forEach(li => { li.className = 'include on'; });
        const current = document.getElementById(`left${menuId}`);
        if (current) current.className = 'include on';

    } catch (e) {
        console.error('leftMenuSet 에러:', e);
        alert('좌측 메뉴 로드 중 오류가 발생했습니다.');
    }
}

function leftMenuCtrl(id) {
    const leftMenu = document.getElementById(`left${id}`);
    const subMenu = document.getElementById(`left_um${id}`);

    if (!leftMenu || !subMenu) return;

    // 상태 확인
    const isOpen = leftMenu.classList.contains('on');

    // 토글 애니메이션 (간단 slide 효과)
    subMenu.style.display = isOpen ? 'none' : 'block';

    // 클래스 교체
    if (isOpen) {
        leftMenu.className = 'include';
    } else {
        leftMenu.className = 'include on';
    }
}

// export async function leftMenuSet(menuId) {
//     // 시스템 관리자(ADMIN) 셋팅
//     // 일반 사용자(USER)의 경우도 셋팅 해달라고 해서 적용
//     if (userStore.getUser()?.USER_ROLE === 'ADMIN' || (userStore.getUser().USER_ROLE === 'USER' && menuId.substring(0, 2) === '99')){
//         const data = document.createElement('li');
//         const a = document.createElement('a');
        
//         data.className = "include on";
//         data.id = "left99_01";
//         a.href = "#";
//         a.className = "m1la";
//         a.addEventListener('click', () => {leftMenuCtrl('99_01');});
//         a.textContent = "시스템 관리";

//         data.append(a);

//         const ul = document.createElement('ul');
//         ul.className = "depth2_list";
//         ul.id = "left_um99_01";

//         for(const idx = 1; idx < 6; idx++) {
//             const li = document.createElement('li');
//             const a = document.createElement('a');

//             li.className = "";
//             li.id = `left99_01_0${idx}0`;

//             a.href = "#";
//             a.className = "";
//             a.addEventListener('click', () => {postSubmit(`/biz/99/99_01_0${idx}0.do`), {}})
//             a.title = `biz/99_01_0${idx}0`;
//             switch(idx) {
//                 case 1:
//                     a.textContent = "공단사용자목록";
//                     break;
//                 case 2:
//                     a.textContent = "메뉴관리";
//                     break;
//                 case 3:
//                     a.textContent = "그룹관리";
//                     break;
//                 case 4:
//                     a.textContent = "그룹별메뉴관리";
//                     break;
//                 case 5:
//                     a.textContent = "첨부파일관리";
//                     break;
//                 default:
//                     a.textContent = "";
//             }
//             li.append(a);
//             ul.append(li);
//         }
//         data.append(ul);

//         document.getElementById('menu').append(data);
//         document.getElementById(`left${menuId}`).classList.add('include on');
//         return;
//     }

//     //관리자메뉴
//     let pData = {};
//     pData['P_PKG'] = 'BIZ_00';
//     pData['P_SP'] = 'SP_BIZ_LEFTMENU_GET';
//     pData['P_LVL1_MENU_ID'] = menuId.substring(0, 2);

//     try {
//         const response = await fetch('/common/SP_L.do', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRF-TOKEN':  csrfStore.getToken()
//             },
//             body: JSON.stringify(pData)
//         });

//         if (response.ok) {
//             const result = await response.json;
//             console.log(result);
//             const menu = document.getElementById("menu");

//             //중메뉴
//             for (let i = 0; i < result.list.length; i++){
//                 if (result.list[i].MENU_LVL === '2'){
//                     const li = document.createElement('li');
//                     const a = document.createElement('a');
//                     const ul = document.createElement('ul');

//                     li.id = `left${result.list[i].MENU_ID}`;
//                     li.className = "include";
//                     a.href = "#";
//                     a.addEventListener('click', () => {leftMenuCtrl(`${result.list[i].MENU_ID}`)});
//                     a.textContent = result.list[i].MENU_NM;
//                     ul.id = `left_um${result.list[i].MENU_ID}`;
//                     ul.className = "depth2_list";
                    
//                     li.append(a, ul);
//                     menu.append(li);
//                 }
//             }

//             //소메뉴
//             for(let i = 0; i < result.list.length; i++){
//                 if (result.list[i].MENU_LVL === '3'){	//소메뉴
//                     const li = document.createElement('li');
//                     const a = document.createElement('a');

//                     li.className = "";
//                     li.id = `left${result.list[i].MENU_ID}`;
//                     a.href = "#";
//                     a.textContent = result.list[i].MENU_NM;
//                     if (isEmpty(result.list[i].MENU_URL)){
//                         a.addEventListener('click', () => {alert("준비중입니다.")});
//                     } else{
//                         a.addEventListener('click', () => {postSubmit(`/${result.list[i].MENU_URL}`,{})});
//                     }
//                     li.append(a);
//                     menu.querySelectorAll(`#left_um${result.list[i].PARENT_MENU_ID}`).append(li);
//                 }
//             }

//             //$('#left' + lvl1).prop('class', 'm1l_li on');	//선택요소만펼침
//             document.querySelectorAll('#menu .include').forEach(el => {el.classList.add('include on')});
//             document.querySelectorAll(`#left${menuId}`).forEach(el => {el.classList.add('include on')});

//         }
//     } catch(e) {
//         alert(e);        
//     }
// }