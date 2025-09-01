import { topMenuSet } from "../topMenu.js";
import { DBParamPKG, DBParamSP, NOTICE_INSERT } from "../../../pages/biz/02/02.config";
import { toFormLikeJQuery } from "../../../lib/common.js";
import { csrfStore } from "../../../lib/csrfStore.js";
import { userStore } from "../../../lib/user.js";

let nickNameCheck = false;

export function init02_01_020() {
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'noticeSubmitBtn') insertNotice();
        else if (e.target && e.target.id === 'btnChangeNickName') changeNickName();
        else if (e.target && e.target.id === 'btnCheckNickNameDupl') checkNickNameDupli();
    });

    let no;
    // if(no) {
    //     // 데이터 세팅
    //     nickNameCheck = true;
    //     nickNameDisable();

    //     $('#NOTICE-NICK-NAME').val("${NICK_NAME}");
    //     $('#NOTICE-REGI-DD').val("${REGI_DD}");
    //     $('#NOTICE-EXP-DD').val("${EXP_DD}");
    //     $('#NOTICE-CATEGORY').val("${CATEGORY}");
    //     $('#NOTICE-SHORT-NO').val("${SHORT_NO}");
    //     $('#NOTICE-TITLE').val("${TITLE}");
    //     $('#NOTICE-CONTENTS').val("${CONTENTS}");
    //     console.log("${EXP_DD}");

    //     $('#noticeSubmitBtn').html("수정하기");
    //     // 수정 모드일 경우
    //     $('#noticeSubmitBtn')
    //             .off("click")
    //             .on("click", updateNotice);
    // }

    // 상위 메뉴 정보가져오기
    topMenuSet("02_01_020");
}

// 공지사항 등록하기
function insertNotice() {
    // 입력 값 유효성 검사
    if (!inputValidation()) return;

    // 데이터 세팅
    const pData = setInputData();
    // const pData = setFormData();

    // 등록 확인(button)
    if (!confirm("등록하시겠습니까?")) return;

    // 1. 데이터 전송(ajax)
    postNoticeDataForm("/PINS/biz/02/notice/insert.do", pData);
}

// 초/분 보정이 필요하면 사용 (예: ":00" 붙이기)
const ensureSec = (s) => (s ? (s.endsWith(':00') ? s : s + ':00') : s);

function setFormData() {
    const form = document.getElementById("notice-insert-data");

    form.append('P_PKG', DBParamPKG.KYL_P_PKG);
    form.append('P_SP', DBParamSP.INSERT_NOTICE);

    const data = new FormData(form);
    console.log(data);

    const regi = data.get('REGI_DD'); if (regi) data.set('REGI_DD', ensureSec(regi));
    const exp  = data.get('EXP_DD');  if (exp)  data.set('EXP_DD',  ensureSec(exp));

    return data;
}

// form 형식으로 전송
async function postNoticeDataForm(url, pData) {
    let formData = new FormData();

    for (const key in pData) {
        if (pData[key] !== null && pData[key] !== undefined) {
        formData.append(key, pData[key]);
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN':  csrfStore.getToken()
            },
            body: pData
        });

        if (response.ok) {
            const res = await response.json();
            alert(res.frontMsg);

            document.getElementById("notice-insert-data").reset();  //입력 화면 리셋
        }
    } catch(e) {console.log(e);}
}

// 입력 데이터 세팅
function setInputData(type) {
    const pData = NOTICE_INSERT;

    if(type === "UPDATE") {
        pData.P_SP = DBParamSP.UPDATE_NOTICE;

        pData.NO = document.getElementById("NOTICE-NO").value;
        pData.MODF_DD = document.getElementById("NOTICE-MODF-DD").value + ":00";
    }
    pData.FILE = document.getElementById("NOTICE-FILE").files[0];
    pData.NICK_NAME = document.getElementById("NOTICE-NICK-NAME").value;
    pData.REGI_DD = document.getElementById("NOTICE-REGI-DD").value + ":00";
    let expVal = document.getElementById("NOTICE-EXP-DD").value;
    pData.EXP_DD  = (expVal && expVal.trim() !== "") ? expVal + ":00" : null;
    pData.CATEGORY  = document.getElementById("NOTICE-CATEGORY").value;
    pData.SHORT_NO  = document.getElementById("NOTICE-SHORT-NO");
    pData.TITLE  = document.getElementById("NOTICE-TITLE").value;
    pData.CONTENTS  = document.getElementById("NOTICE-CONTENTS").value;
    pData.USER_ID = userStore.getUser().USER_ID();
    
    console.log(pData);
    return pData;
}

// 닉네임 중복 확인 : 현재 유저가 이전에 사용한 아이디일 경우는 허용
async function checkNickNameDupli() {
    let nickName = document.getElementById("NOTICE-NICK-NAME").value;

    // 빈 값 확인
    if(nickName === null || nickName === '') {
        nickNameCheck = false;
        alert("빈 값은 입력할 수 없습니다.");
        return;
    }

    // 전달 데이터 셋팅
    let pData = {};
    pData['P_PKG'] = DBParamPKG.KYL_P_PKG;
    pData['P_SP'] = DBParamSP.SELECT_NICKNAME_DUPLI;
    pData['USER_ID'] = document.getElementById("NOTICE-ID").value;
    pData['NICK_NAME'] = nickName;

    try {
        const response = await fetch('/PINS/common/SP_S.do', {
            method: 'POST',
            credentials: 'include',
            headers: {},
            body: toFormLikeJQuery(pData)
        });

        if (response.ok) {
            const res = await response.json();

             if(res.msg === 'SUCCESS') {
                nickNameCheck = true;
                alert("사용 가능한 닉네임 입니다.");
             } else {
                nickNameCheck = false;
                alert("이미 사용중인 닉네임 입니다.");
            }
        nickNameDisable();
        }
    } catch(e) {console.log(e);}
    // 확인(msg의 'SUCCESS' || 'FAIL' 로 사용 가능을 구분
}

// 닉네임 입력창 막기/풀기
function nickNameDisable() {
    if (nickNameCheck) {
        document.getElementById("NOTICE-NICK-NAME").setAttribute("disabled", true);
    } else {
        document.getElementById("NOTICE-NICK-NAME").removeAttribute("disabled");
    }
}

// 닉네임 다시 변경
function changeNickName() {
    nickNameCheck = false;
    nickNameDisable();
}

// 작성 내용 유효성 검사
function inputValidation() {
    let regiDd = document.getElementById("NOTICE-REGI-DD").value;
    let expDd = document.getElementById("NOTICE-EXP-DD").value || null;
    let nickName = document.getElementById("NOTICE-NICK-NAME").value || null;
    let category = document.getElementById("NOTICE-CATEGORY").value || null;
    let shortNo = document.getElementById("NOTICE-SHORT-NO").value || null;
    let title = document.getElementById("NOTICE-TITLE").value || null;
    let contents = document.getElementById("NOTICE-CONTENTS").value || null;

    const expAt = new Date(expDd).getTime();
    const regiAt = new Date(regiDd).getTime();

    // 등록 일자보다 만료 일자가 더 늦은 경우
    // expDd 값이 있을 때만 검증
    if (expDd) {
        const expAt = new Date(expDd).getTime();
        if (!(expAt > regiAt)) {
        alert("만료 일자는 작성 일자보다 늦어야 합니다.");
        document.getElementById("NOTICE-EXP-DD").focus();
        return false;
        }
    }

    // 닉네임이 빈칸인 경우
    if (nickName === null) {
        alert("닉네임은 필수로 작성되어야 합니다.");
        document.getElementById("NOTICE-NICK-NAME").focus()
        return false;
    }

    // 닉네임 인증을 하지 않은 경우
    if (!nickNameCheck) {
        alert("작성학신 닉네임을 중복 확인을 해주세요.");
        document.getElementById("btnCheckNickNameDupl").focus();
        return false;
    }

    // 카테고리를 선택하지 않은 경우
    if (category === null) {
        alert("카테고리는 필수로 선택되어야 합니다.");
        document.getElementById("NOTICE-CATEGORY").focus();
        return false;
    }

    // 중요 순서를 선택하지 않음 경우
    if (shortNo === null) {
        alert("중요도는 필수로 선택되어야 합니다. 우선순위: 0");
        document.getElementById("NOTICE-SHORT-NO").focus();
        return false;
    }

    // 제목이 빈칸인 경우
    if (title === null) {
        alert("제목은 필수로 작성되어야 합니다.");
        document.getElementById("NOTICE-TITLE").focus();
        return false;
    }

    // 내용이 빈칸인 경우
    if (contents === null) {
        alert("내용은 반드시 작성되어야 합니다.");
        document.getElementById("NOTICE-CONTENTS").focus();
        return false;
    }

    return true;
}