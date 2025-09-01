import { postPopupOpen, tableSet, fn_formData } from "../../../lib/common.js";
import { pData, tableHeadInfo, arrName, arrWidth } from "../../../pages/biz/99/99.config.js";
import { topMenuSet } from "../topMenu.js";
import { csrfStore } from "../../../lib/csrfStore.js";

export function init99_01_010_beforeRender() {
    topMenuSet('99_01_010');

    tableHeadInfo = tableSet("tablegrid1", arrName, arrWidth); //테이블 데이터 셋팅
		
    getData(1);
}

export function init99_01_010_afterRender() {
    document.addEventListener('DOMContentLoaded', () => {
        const ids = ['P_USERID', 'P_USERNAME'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    e.preventDefault();          // 기본 제출/포커스 이동 방지
                    window.fn_Search();          // 전역 함수 호출 (호환)
                }
            });
        });
    });
}

async function getData(pageindex){
    let gridId = document.getElementById("grid1");
    const modal  = document.getElementById('myModal3');

    if (modal) modal.style.display = 'block';
    
    if (pageindex === -1)
    {
        pageindex = document.getElementById("P_PAGEINDEX").value;
    }
    
    if(nvl(document.getElementById("P_PAGESIZE")) !== '')
    {					
        pageSize = document.getElementById("P_PAGESIZE").value;
    }
    
    Object.assign(pData, fn_formData('formSearch')); //파라메터 셋팅
    pData["pageindex"] = pageindex;
    pData["pageSize"] = pageSize;

    try {
        const response = await fetch('/PINS/common/SP_L.do', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: pData
        });

        if (response.ok) {
            const result = await response.json();
            let gridData = '';
            for(let i = 0; i < result.list.length; i++){
                gridData += `<tr>
                    <td class="txtc"><a href="#" onclick="pupupOpen('${result.list[i].TYPE}', '${result.list[i].USERID}')" style="font-weight:bold;">${nvl(result.list[i].USERID)}</a></td>
                    <td class="txtc">${nvl(result.list[i].USERNAME)}</td>
                    <td class="txtl">${nvl(result.list[i].USEREMAIL)}</td>
                    <td class="txtl">${nvl(result.list[i].DEPT_NAME)}</td>
                    <td class="txtl">${nvl(result.list[i].USER_ROLE_NM)}</td>
                    <td class="txtl">${nvl(result.list[i].REGI_DD)}</td>
                    <td class="txtl">${nvl(result.list[i].REGI_MAN)}</td>
                    <td class="txtl">${nvl(result.list[i].REMARK)}</td>
                </tr>`;
            }
            if(gridData !== '') gridId.html(gridData);
            else gridId.html('<tr><td class="txtc" colspan="8">데이터가 없습니다.</td></tr>');
            
            pageing(pageindex, pageSize, 10, result.rtnVal, getData);
            if (modal) modal.style.display = 'none';
        }
    } catch(e) {console.log(e);}
}

// 검색 함수 (전역에 노출: 기존 코드와 동일한 사용성)
window.fn_Search = function () {
    getData(1);
};

// 팝업 오픈 (전역에 노출)
window.pupupOpen = function (P_TYPE, P_USERID) {
const payload = { P_TYPE, P_USERID };
console.log(payload);

const url = '/PINS/biz/99/99_01_011_pop.do';
    postPopupOpen('사용자 상세 정보', url, 1000, 500, payload);
};

// 오타 대비 alias (원하면 유지)
window.popupOpen = window.pupupOpen;