import { userStore } from "../../lib/user.js";
import { postSubmit, tableSet, fn_formData, nvl, isEmpty } from '../../lib/common.js';
import { getPath } from "../../helper/path";
import { csrfStore } from "../../lib/csrfStore.js";
import { leftMenuSet } from "../biz/leftMenu.js";
import { getComCode, pageing } from "../../global/defaultDecorator.js";

//페이지 조회건수 셋팅
let pageSize = 10;

//DB조회 파라메터 셋팅
let pData = new URLSearchParams({
    P_PKG: 'BIZ_03',
    P_SP: 'SP_BIZ_03_01_010_L',
    COLUMN: '',
    ORD: 'DESC'
});

//테이블 요소 셋팅
/*
-사용방법
-> arrName은 2차원 배열, 나머지 항목은 1차원 배열로 값을 넣어줘야 함
-> 헤더 여러 로우를 그리는 경우 때문이고, 헤더가 1개여도 2차원배열로 넣어줘야 함
-> 셀 colspan과 rowspan은 행/열별 값이 같은 경우 자동 병합 됨
*/
let arrName =	[
    ['제출일시','업체코드','대상년도','사업자등록번호','업체명','대표자명','담당자명','신청서상태','확인서','이력보기','검토완료일시']
];
let arrRef =	['TRME_DATE','ENTE_CODE','ACHI_YEAR','ENTR_REGI_NUMB','ENTE_TITE','REPE_MANX_TITE','CHAR_MANX_TITE','MOVN_STAT_NM','','','TRME_DATE2'];
let arrWidth =	['130','130','100','130','300','100','100','100','100','100','130'];
let arrType =	['','','number','','','','','','','',''];

let tableHeadInfo;
// 로그인 성공 시 보여줄 네비바 변경됨
export function renderMenu01_01_010() {
    topMenuSet('01_01_010');

    let params = {"P_CODE_SCT" : "A006"};
    let headers = {"" : "전체"};
    getComCode('P_ACHI_YEAR','SP_COMM_CODE_LIST', params, headers, 0, 'D', '');

    let params2 = {"P_CODE_SCT" : "A010"};
    let headers2 = {"" : "전체"};
    getComCode('P_MOVN_STAT','SP_COMM_CODE_LIST', params2, headers2, 0, 'D', '');

    document.querySelectorAll("#P_MOVN_STAT option[value='00'], #P_MOVN_STAT option[value='05']")
    .forEach(opt => {
        opt.style.display = "none";
    });

    tableHeadInfo = tableSet("tablegrid1", arrName, arrWidth); //테이블 데이터 셋팅

    getData(1);
}

export async function topMenuSet(menuId) {
    let nowUrl = window.location.pathname;
    let topPath = getPath();
    console.log("topPath: " + topPath + " , nowURL: " + nowUrl);
    if(userStore.getUser()?.USER_ROLE !== 'ADMIN'){
        // console.log("topMenu debug");
        let gridId;
        gridId = document.getElementById('topMenu');
        const body = new URLSearchParams({
            P_PKG: 'BIZ_00',
            P_SP:  'SP_BIZ_TOPMENU_GET',
            _csrf: csrfStore.getToken()
        });

        try {
            const response = await fetch('/PINS/common/SP_L.do', {
                method: 'POST',
                credentials: 'include', // 세션 쿠키 포함
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRF-TOKEN':  csrfStore.getToken()
                },
                body: body
            });
            console.log(response);
            // 성공
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                gridId.innerHTML = ''
                for(let i = 0; i < result.list.length; i++) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');

                    li.id = nvl(result.list[i].MENU_ID);
                    li.className = "";
                    a.href = "#";
                    a.textContent = result.list[i].MENU_NM;
                    if(isEmpty(result.list[i].MENU_URL)){
                        a.addEventListener('click', () => {alert('준비중입니다.')});
                    } else {
                        a.href = '#/' + result.list[i].MENU_URL;
                    }
                    li.append(a);
                    
                    gridId.append(li);
                
                    // const topId = String(menuId).slice(0, 2); 
            }
            const topId = String(menuId).slice(0, 2); 
            document.getElementById(topId).classList.add("on");
        } 
    }catch(e) {
            console.log(e);
        }
    }
    leftMenuSet(menuId);
}

async function getData(pageindex) {
    document.getElementById('myModal3').style.display = "";

    pageindex = pageindex === -1 ? document.getElementById('P_PAGEINDEX').value : pageindex;

    const el = document.getElementById('P_PAGESIZE');
    if (el && el.value.trim() !== '') {
        pageSize = Number(el.value); // 숫자로 쓰면 Number 캐스팅 권장
    }
    // Object.assign(pData, fn_formData('formSearch')); //파라메터 셋팅
    
    pData["pageindex"] = pageindex;
    pData["pageSize"] = pageSize;

    try {
        const resposne = await fetch('/PINS/common/SP_L.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: pData
        });

        if (resposne.ok) {
            const result = await resposne.json();
            let gridData = '';
            let histBtnData = '';
            let contentBtnData = '';

            for (let i = 0; i < result.list.length; i++) {
            const row = result.list[i];

            histBtnData = row.MOVN_STAT >= 10
                ? `<a href="#" class="btn_table bg_color5" onclick="pupupOpen2('${row.ENTE_CODE}','${row.ACHI_YEAR}')">이력조회</a>`
                : '';

            contentBtnData = row.MOVN_STAT == 50
                ? `<a href="#" class="btn_table bg_color4" onclick="pupupOpen3('${row.ENTE_CODE}','${row.ACHI_YEAR}')">내용보기</a>`
                : '';

            gridData += `
                <tr>
                <td class="txtc">${nvl(row.TRME_DATE)}</td>
                <td class="txtc">${row.ENTE_CODE}</td>
                <td class="txtc">
                    <a href="#" onclick="pupupOpen('E','${row.ENTE_CODE}','${row.ACHI_YEAR}')" style="font-weight:bold;">
                    ${nvl(row.ACHI_YEAR)}
                    </a>
                </td>
                <td class="txtc">${nvl(row.ENTR_REGI_NUMB)}</td>
                <td class="txtl"><span class="with_300px">${nvl(row.ENTE_TITE)}</span></td>
                <td class="txtc">${nvl(row.REPE_MANX_TITE)}</td>
                <td class="txtc">${nvl(row.CHAR_MANX_TITE)}</td>
                <td class="txtc">${nvl(row.MOVN_STAT_NM)}</td>
                <td class="txtc">${contentBtnData}</td>
                <td class="txtc">${histBtnData}</td>
                <td class="txtc">${nvl(row.TRME_DATE2)}</td>
                </tr>`;
            }

            // 테이블에 렌더링
            const gridEl = document.getElementById('grid1');
            if (gridEl) {
                if (gridData !== '') {
                    gridEl.innerHTML = gridData;
                } else {
                    gridEl.innerHTML = '<tr><td class="txtc" colspan="11">데이터가 없습니다.</td></tr>';
                }
            }

            // 페이징 호출
            pageing(pageindex, pageSize, 10, result.ret_val, getData);

            // 모달 닫기
            const modal3 = document.getElementById('myModal3');
            if (modal3) {
                modal3.style.display = 'none';   // jQuery .hide() 대체
            }

        }
    } catch(e) {
        console.log(e);
    }
}