import { topMenuSet } from "../topMenu.js";
import { notice, arrName, arrWidth, DBParamPKG, DBParamSP } from "../../../pages/biz/02/02.config.js";
import { tableSet, toFormLikeJQuery } from "../../../lib/common.js";
import { pageing } from "../../../global/defaultDecorator.js";
import { csrfStore } from "../../../lib/csrfStore.js";
import { userStore } from "../../../lib/user.js";
import { formatDate } from "../../../lib/formateDate.js";

export function init02_01_010() {
    // top 메뉴 정보 받아오기
    topMenuSet('02_01_010');

    // 기존 존재하는 메서드 이용 : 테이블 속성 그리기
    noticeTableSet();

    // 저장되어 있는 게시글 불러오기(10건씩)
    getNoticeList(notice.PAGE_IDX, notice);

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === "notice-filtering") {
            filterNotice();
        }
    });
}

let tableHeadInfo;
// 테이블 속성 그리기
function noticeTableSet() {
    // 기존 존재하는 메서드 이용 : 테이블 속성 그리기
    tableHeadInfo = tableSet("tablegrid2", arrName, arrWidth);
}

// 공지사항 리스트 불러오기
// 매개변수: notice 객체, 이동하려는 페이지 번호
async function getNoticeList(pageIdx, n = notice) {
    // pageNo가 default값인 1이 아닌 경우 => 페이징 UI를 통해 이동 => notice 객체(n)에 변경된 PAGE_NO 적용
    if(pageIdx !== notice.PAGE_IDX) n.PAGE_IDX = pageIdx;
    
    const param = toFormLikeJQuery(n);
    // 데이터 세팅 확인하기
    console.log(param);

    try {
        const response = await fetch('/PINS/common/SP_L.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: param
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            drawNoticeListTable(res.list, n, res.rtnVal);
        }
    } catch(e) {console.log(e);}
}

function drawNoticeListTable(pData, n, rtnVal) {
    console.log(pData);
    const table = document.getElementById("tablegrid2");
    // 리셋
    table.innerHTML = "";
    noticeTableSet();

    for(let i=0; i<pData.length; i++) {
        const tr = document.createElement('tr');

        let row = pData[i];
        let regi_user = row.ID;
        let cols = [row.NO, row.ID, row.NICK_NAME, row.ROLE, row.TITLE, formatDate(row.REGI_DD), formatDate(row.MODF_DD),
            formatDate(row.EXP_DD), row.CATEGORY, row.DEL_YN, row.SHORT_NO, row.IP, row.FILE_NO, "UPDATE", "DEL", "DETAIL"]

        for(let j=0; j<cols.length; j++) {
            const td = document.createElement('td');

            const isMe = regi_user === userStore.getUser()?.USER_ID;  // 작성자가 나인지 확인
            const hasRole = userStore.getUser()?.USER_ROLE === "ADMIN";  // ADMIN 권한 => 모든 기능 열림

            if (cols[j] === "UPDATE") {  // 2. 컬럼인 '수정하기' 인 경우  => 본인이 작성한 경우 또는 관리자인 경우, 수정 버튼 생성
                if (isMe || hasRole) {
                    const btnModf = document.createElement('button');
                    btnModf.textContent = "수정하기";
                    // 수정하기로 가는 API 연결
                    btnModf.addEventListener("click", function () {
                        modfNotice(cols[0]);
                    });

                    td.append(btnModf);
                } else {  // 권한이 없을 경우 텍스트로 알림
                    td.textContent = "수정 권한 없음";
                }
            } else if (cols[j] === "DEL") {  // 3. 삭제 컬럼인 경우 => 본인이 작성한 경우 또는 관리자인 경우, 수정 버튼 생성
                if (isMe || hasRole) {
                    const btnDel = document.createElement('button');
                    // 아이디 부여 => 나중에 해당 버튼의 상태를 변경하기 위해
                    btnDel.id = "del_" + cols[0];

                    // 이미 삭제된 게시글인 경우 => 복구 기능
                    if(cols[10] === "Y") btnDel.textContent = "복구하기";
                    else btnDel.textContent = "삭제하기";

                    // 삭제하기로 가는 API 연결
                    btnDel.addEventListener("click", function () {
                        delNotice(cols[0], btnDel.textContent);
                    })

                    td.append(btnDel);
                } else {
                    td.textContent = "삭제 권한 없음";
                }
            } else if (cols[j] === "DETAIL") {  // 4. 현재 작성된 내용을 상세 페이지를 통해 확인
                const btnDetail = document.createElement('button');

                btnDetail.textContent = "상세 내용 확인";

                btnDetail.addEventListener("click", function () {
                    noticeDetail(cols[0], cols, pData, n, rtnVal);  // CONTENTS 내용 서버에서 가져오기
                });

                td.append(btnDetail);
            } else {  // 5. 일반 컬럼인 경우 => 그냥 텍스트로 내용 넣기
                td.textContent = cols[j];
            }
            td.classList.add('txtc');
            td.classList.add('noticeTd');
            tr.append(td);
        }
        table.append(tr);
    }

    // 페이징 처리 - 아래 페이지 이동 UI
    pageing(n.PAGE_IDX, n.PAGE_SIZE, n.PAGE_COUNT, Number(rtnVal), getNoticeList);
}

// 삭제하기 버튼 클릭
async function delNotice(no, action) {
    if (no === null || no === '') return;
    let DEL_YN;

    // 삭제하기인 경우
    if (action === "삭제하기") {
        // 삭제 확인
        if (!confirm(no + "번 게시글을 삭제하시겠습니까? 삭제 후 복구 가능합니다.")) return;
        DEL_YN = "Y";
    } else {
        // 복구 확인
        if (!confirm(no + "번 게시글을 복구하시겠습니까?")) return;
        DEL_YN = "N";
    }
    // 삭제 관련 데이터 세팅
    const pData = {
        P_PKG: DBParamPKG.KYL_P_PKG,
        P_SP: DBParamSP.UPDATE_DEL_YN,
        DEL_YN,
        NO: no
    };
    const dt = toFormLikeJQuery(pData);

    try {
        const response = await fetch('/PINS/biz/02/notice/delete.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: dt
        });

        if (response.ok) {
            const res = await response.json();
            alert(res.frontMsg);

            // 바뀐 상태로 화면 변경(필터링 상태는 유지해야 하기 때문에, 관련 내용만 다시 그림)
            const delBtn = document.getElementById("del_"+no);
            delBtn.textContent = DEL_YN === "Y" ? "복구 하기" : "삭제 하기";
        }
    } catch (e) {console.log(e);}
}

// 수정하기 버튼 클릭
function modfNotice(no) {
    if (no === null || no === '') return;

    // hidden input에 값 세팅
    document.getElementById("modfNo").value = no;
    document.getElementById("pkg").value = DBParamPKG.KYL_P_PKG;
    document.getElementById("sp").value = DBParamSP.SELECT_ONE_NOTICE;

    // form POST 전송
    document.getElementById("modfForm").submit();
}

// 선택한 카테고리 세팅
function filterNotice() {
    // id를 통해서 정보 가져오기
    let select_CT = document.getElementById("notice-category").value || null;  //''인 경우 => null값 처리
    let select_ord_col = document.getElementById("notice-ord-col").value || null;
    let select_ord = document.getElementById("notice-ord").value || null;

    console.log(select_CT);

    // notice 객체 세팅
    let filterN = notice;
    filterN.CATEGORY = select_CT;
    filterN.ORD_COL = select_ord_col;
    filterN.ORD = select_ord;

    getNoticeList(filterN.PAGE_IDX, filterN);
}

// 상세 정보를 위해 CONTENTS 가져오기
// 따로 분리 조회하는 이유
// 1. 성능 이슈: CLOB은 대용량 텍스트 저장용, 즉 스트리밍 I/O를 해야 함(네트워크 트래픽/메모리 사용량 문제)
// 2. DB 부하 감소
// 3. 화면 요구사항: CONTENTS는 화면 상 요구하지 않음(불필요)
async function noticeDetail(no, data, currData, n, rtnVal) {
    if (no === null || no === '') return;

    // 데이터 셋팅
    const pData = {
        P_PKG: DBParamPKG.KYL_P_PKG,
        P_SP: DBParamSP.SELECT_ONE_NOTICE_CONTENTS,
        NO: no
    };

    const dt = toFormLikeJQuery(pData);

    try {
        const resposne = await fetch('/PINS/biz/02/notice/select.do', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: dt
        });

        if (resposne.ok) {
            const res = await resposne.json();
            data.push(res.CONTENTS);
            openNoticeDetail(data, currData, n, rtnVal);
        }
    } catch (e) {console.log(e);}
}

// 상세 정보 창 열기 (POST 방식)
function openNoticeDetail(data, currData, n, rtnVal) {
    const pData = setNoticeDataListForMap(data);

    // _csrf 토큰 필요
    pData['_csrf'] = csrfStore.getToken();

    console.log("----------");
    console.log(pData);
    
    // 새 창 열기 (이름을 지정해서 target으로 사용)
    let popup = window.open('', 'noticeDetail', 'width=800,height=600,scrollbars=yes,resizable=yes');

    // 동적으로 form 생성
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "/PINS/biz/02/02_01_020_pop.do";
    form.target = "noticeDetail"; // 새 창의 이름과 일치해야 함

    // pData의 key-value를 hidden input으로 변환
    for (let key in pData) {
        if (pData.hasOwnProperty(key)) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = pData[key];
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();   // 새 창으로 POST 전송
    document.body.removeChild(form); // 깔끔히 제거

    let timer = setInterval(function() {
        if (popup.closed) {
            clearInterval(timer);
            afterPopupClosed(currData, n, rtnVal); // 팝업 닫힘 감지 시 실행
        }
    }, 500);
}

// list를 map형태로 매핑해줌
function setNoticeDataListForMap(data) {
    const attr = ['NO', 'ID', 'NICK_NAME', 'ROLE', 'TITLE', 'REGI_DD', 'MODF_DD', 'EXP_DD', 'CATEGORY', 'DEL_YN', 'SHORT_NO', 'IP', 'FILE_NO', 'CONTENTS'];
    const map = {};

    for (let i = 0; i < attr.length-1; i++) {
        map[attr[i]] = data[i];
    }

    // data는 UPDATE, DEL, DETAIL이 들어가있으므로 마지막 요소를 넣어야 함
    map[attr[attr.length-1]] = data[data.length-1];

    return map;
}