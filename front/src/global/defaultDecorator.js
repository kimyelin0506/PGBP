import { csrfStore } from "../lib/csrfStore.js";
import pgn01URL from "../img/pgn01.png";
import pgn02URL from "../img/pgn02.png";
import pgn03URL from "../img/pgn03.png";

/**
 * 공통코드 데이터로 UI 컨트롤 생성 (드롭다운, 라디오박스, 체크박스)
 *
 * @param {string} id         - 컨트롤을 삽입할 HTML 요소의 ID
 * @param {string} sp         - 호출할 저장 프로시저명 (예: 'SP_COMMON_CODE_LIST')
 * @param {Object} params     - SP 호출에 필요한 파라미터 객체 (예: { P_CODE_SCT: 'A009' })
 * @param {Object} headers    - 드롭다운에 추가할 헤더 옵션 (key-value 형태)
 * @param {number} selected   - 드롭다운에서 선택할 인덱스, 9999는 전체선택(멀티셀렉트)
 * @param {string} gbn        - 컨트롤 타입 ('D' = 드롭다운, 'R' = 라디오박스, 'C' = 체크박스)
 * @param {string} ncChkNm    - 필수 체크명칭, input 요소에 data-name 속성으로 삽입 (옵션)
 */
export async function getComCode (id, sp, params, headers, selected, gbn, ncChkNm) {

    let pData = new Object();
    pData['P_PKG'] = 'COMMON';
    pData['P_SP'] = sp;

    for (const key in params) {
        pData[key] = params[key];
    }

    try {
        const response = await fetch('/PINS/common/SP_L.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: new URLSearchParams(pData)
        });

        if (response.ok) {
            const result = await response.json();
            bindControl(gbn, id, headers, result, selected, ncChkNm);
        }
    } catch(e) {
        console.log(e);
    }
}

/**
 * 드롭다운(D), 라디오(R), 체크박스(C) 바인딩 (바닐라 JS)
 * @param {'D'|'R'|'C'} gbn - D(드롭다운) / R(라디오) / C(체크박스)
 * @param {string} id - 그려 넣을 엘리먼트 id (select 또는 ul)
 * @param {Object} headers - 상단 고정 옵션들 { key: label } 형태
 * @param {{list: Array<{KEY:string, VALUE:string}>}} result - 서버에서 받은 목록
 * @param {number|string} selected - 선택 인덱스(헤더+리스트 기준 연속 인덱스), 9999=전체선택(멀티셀렉트)
 * @param {string} [ncChkNm] - data-name 값 (옵션)
 */
function bindControl(gbn, id, headers = {}, result = { list: [] }, selected, ncChkNm) {
    const root = document.getElementById(id);
    if (!root) return;

    // 초기화
    root.innerHTML = '';

    const list = Array.isArray(result?.list) ? result.list : [];
    const headerEntries = Object.entries(headers);
    const headerLen = headerEntries.length;
    const sel = Number(selected);
    const hasName = ncChkNm !== undefined && ncChkNm !== null && String(ncChkNm).trim() !== '';

    if (gbn === 'D') {
        // root는 <select>여야 함
        // 9999(전체선택)를 지원하려면 <select multiple>이어야 모두 선택이 의미가 있어요.
        // (multiple이 없으면 브라우저는 마지막 selected만 반영)
        // 필요 시: root.setAttribute('multiple','multiple');

        // headers 먼저
        let idx = 0;
        for (const [key, label] of headerEntries) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = label;
            if (sel === idx || sel === 9999) opt.selected = true;
            root.appendChild(opt);
            idx++;
        }

        // result.list 이어서
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const opt = document.createElement('option');
            opt.value = item.KEY;
            opt.textContent = item.VALUE;
            if (sel === (headerLen + i) || sel === 9999) opt.selected = true;
            root.appendChild(opt);
        }

        if (hasName) root.dataset.name = ncChkNm;
        return;
    }

    // 라디오/체크박스: root는 <ul> 같은 컨테이너여야 함
    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const li = document.createElement('li');
        li.className = (gbn === 'R') ? 'radio_li' : 'checkbox_li';

        const input = document.createElement('input');
        input.id = `${id}${i}`;
        input.name = id;
        input.type = (gbn === 'R') ? 'radio' : 'checkbox';
        input.value = item.KEY;
        if (hasName) input.dataset.name = ncChkNm;

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = item.VALUE;

        li.append(input, label);
        root.appendChild(li);
    }
}

/**
 * 페이징 UI 생성 및 이벤트 바인딩 (Vanilla JS)
 *
 * @param {number} pageIndex 현재 페이지 번호(1부터)
 * @param {number} pageSize  한 페이지 데이터 수
 * @param {number} pageCount 한 번에 보여줄 페이지 번호 개수
 * @param {number} totalCount 전체 데이터 건수
 * @param {function} bindFnNm 페이지 이동 시 호출할 함수 (pageNo 인자 필요)
 * @param {string} id 페이징 구분자(동일 화면 다중 페이징 구분용)
 */
export function pageing(pageIndex, pageSize, pageCount, totalCount, bindFnNm, id) {
    // nvl 대체 (전역 nvl이 있으면 그걸 사용)
    const sid = (typeof window !== 'undefined' && typeof window.nvl === 'function')
        ? window.nvl(id)
        : (id ?? '');

    // 전체 페이지 수
    let totalPage = Math.floor(totalCount / pageSize);
    totalPage = (totalCount % pageSize) > 0 ? totalPage + 1 : totalPage;

    // pageIndex 보정
    pageIndex = totalPage < pageIndex ? totalPage : pageIndex;

    // 현재 블록 시작/끝
    const startPage = (Math.floor((pageIndex - 1) / pageCount)) * pageCount + 1;
    const endPage = Math.min(startPage + pageCount - 1, totalPage);

    // 이전/다음 블록 첫 페이지
    const befo = Math.max(startPage - pageCount, 1);
    const next = Math.min(startPage + pageCount, totalPage);

    const container = document.getElementById('divPaging' + sid);
    if (!container) return;

    if (totalCount > 0) {
        const startNum = ((pageIndex - 1) * pageSize) + 1;
        const endNum = Math.min(pageIndex * pageSize, totalCount);

        let html = `
        <input type="hidden" id="P_PAGEINDEX${sid}" name="P_PAGEINDEX${sid}" value="${pageIndex}">
        <div class="pagination_wrap">
            <div class="total_page">
            전체 ${totalCount} 건 [ ${startNum} - ${endNum} ]
            </div>
            <!--페이징-->
            <ul class="pagination">
            <li id="pageLInk${sid}Li_Start" data-pageno="1">
                <a href="#"><img src="${pgn02URL}" alt="처음 목록 아이콘" class="n_a_icon"></a>
            </li>
            <li id="pageLInk${sid}Li_Befo" data-pageno="${befo}">
                <a href="#"><img src="${pgn01URL}" alt="이전 목록 아이콘" class="e_a_icon"></a>
            </li>
        `;

        for (let num = startPage; num <= endPage; num++) {
            const on = (num === pageIndex) ? ' class="on"' : '';
            html += `
                <li id="pageLInk${sid}Li_${num}" data-pageno="${num}"${on}>
                <a href="#">${num}</a>
                </li>`;
        }

        html += `
            <li id="pageLInk${sid}Li_Next" data-pageno="${Math.min(totalPage, next)}">
                <a href="#"><img src="${pgn02URL}" alt="다음 목록 아이콘" class="n_a_icon"></a>
            </li>
            <li id="pageLInk${sid}Li_End" data-pageno="${totalPage}">
                <a href="#"><img src="${pgn03URL}" alt="맨끝 목록 아이콘" class="e_a_icon"></a>
            </li>
            </ul>
            <!-- /페이징-->
            <!-- 페이지 수 -->
            <div class="page_num">
            <ul class="page_list">
                <li><span>페이지 게시글 수</span></li>
                <li>
                <select id="P_PAGESIZE${sid}" name="P_PAGESIZE${sid}">
                    <option value="5">5개</option>
                    <option value="10">10개</option>
                    <option value="15">15개</option>
                    <option value="30">30개</option>
                    <option value="50">50개</option>
                    <option value="100">100개</option>
                </select>
                </li>
            </ul>
            </div>
            <!-- 페이지 수 -->
        </div>
        `;

        // 렌더
        container.innerHTML = html;

        // 페이지 사이즈 select 값 설정
        const sel = document.getElementById('P_PAGESIZE' + sid);
        if (sel) sel.value = String(pageSize);

        // 모달 닫기 (jQuery .hide() 대체)
        const modal3 = document.getElementById('myModal3');
        if (modal3) modal3.style.display = 'none';

        // 페이지 이동 이벤트 (li prefix 매칭)
        container.querySelectorAll(`li[id^="pageLInk${sid}Li"]`).forEach(li => {
            li.addEventListener('click', (e) => {
                e.preventDefault();
                const pageNo = Number(li.dataset.pageno);
                const hidden = document.getElementById('P_PAGEINDEX' + sid);
                if (hidden) hidden.value = String(pageNo);
                // 데이터 바인딩 콜백
                bindFnNm(pageNo);
            });
        });

        // 페이지 사이즈 변경
        sel?.addEventListener('change', (e) => {
        // 보통 pageSize를 바꾸면 서버 조회 파라미터에도 반영해야 함.
        // 여기서는 jQuery와 동일하게 첫 페이지로 이동 호출만 수행
        bindFnNm(1);
        });

    } else {
        // 데이터 없을 때
        container.innerHTML = '';
        const modal3 = document.getElementById('myModal3');
        if (modal3) modal3.style.display = 'none';
    }
}
