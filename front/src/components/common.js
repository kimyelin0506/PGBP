/**
 * 문자열 템플릿의 {0}, {1}, {2} 형태의 토큰을 실제 값으로 치환합니다.
 * 
 * @param {string} template - 포맷팅할 문자열 (예: "Hello {0}, today is {1}")
 * @param {...any} args - 치환할 값 목록 (예: "Yerin", "Monday")
 * @returns {string} 치환된 최종 문자열
 * 
 * 사용 예시:
 * stringFormat("Hello {0}, today is {1}", "Yerin", "Monday");
 * // => "Hello Yerin, today is Monday"
 **/
function stringFormat(template, ...args) {
    return template.replace(/{(\d+)}/g, function(match, index) {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

/**
 * 지정된 URL과 파라미터 객체를 사용하여 동적으로 <form>을 생성하고 GET 요청을 전송합니다.
 * 
 * @param {string} url - 전송할 대상 URL
 * @param {Object} valueObjects - 폼에 포함할 key-value 데이터 객체
 * @param {string} formtarget - 폼 전송 대상 (예: "_self", "_blank")
 * @returns {void} - 반환값 없음, 폼 전송 후 자동으로 제거됨
 * 
 * 사용 예시:
 * getSubmit("/search", { q: "javascript", page: 1 }, "_self");
 * // => 브라우저에서 /search?q=javascript&page=1 로 이동
 */
export function getSubmit(url, valueObjects, formtarget){
    const form = document.createElement('form');

    for(const key in valueObjects) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = valueObjects[key];
        form.append(input);
    }
    form.method = 'get';
    form.target = formtarget;
    form.action = url;

    document.body.append(form);
    form.submit();
    form.remove();
}

/**
 * 지정된 URL과 파라미터 객체를 사용하여 동적으로 <form>을 생성하고 POST 요청을 전송합니다.
 * CSRF 토큰(meta 태그 기반)을 자동으로 포함합니다.
 * 
 * @param {string} url - 전송할 대상 URL
 * @param {Object} valueObjects - 폼에 포함할 key-value 데이터 객체
 * @param {string} [formtarget="_self"] - 폼 전송 대상 (기본값: "_self")
 * @returns {void} - 반환값 없음, 폼 전송 후 자동으로 제거됨
 * 
 * 사용 예시:
 * postSubmit("/submit", { userId: 123, name: "Yerin" }, "_self");
 * // => POST /submit (body에 userId=123, name=Yerin, CSRF 토큰 포함)
 */
export function postSubmit(url, valueObjects, formtarget){
    
    /*CSRF Token apply - 2021.04.20*/
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const tokenName = document.querySelector('meta[name="_csrf_parameter"]').getAttribute('content');

    valueObjects[tokenName] = token;
    /*//CSRF Token apply - 2021.04.20*/

    const form = document.createElement('form');
    
    for(key in valueObjects) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = valueObjects[key];
        form.append(input);
    }

    form.method = 'post';
    form.target = '_self';
    form.action = url;

    document.body.append(form);
    form.submit();
    form.remove();
}

/**
 * 동적으로 <form>을 생성하여 POST 방식으로 데이터를 전송하고,
 * 결과를 새로운 팝업 창으로 띄웁니다. (CSRF 토큰 포함)
 * 
 * @param {string} popupName - 팝업 창 이름 (빈 문자열일 경우 "NewWindow"로 기본 설정)
 * @param {string} url - 요청할 URL
 * @param {number} width - 팝업 창 너비(px)
 * @param {number} height - 팝업 창 높이(px)
 * @param {Object} valueObjects - 폼에 담을 key-value 데이터 객체
 * @returns {Window|null} - 새로 열린 팝업 창 객체 (실패 시 null)
 * 
 * 사용 예시:
 * postPopupOpen("UserPopup", "/user/detail", 600, 400, { userId: 123 });
 * // => /user/detail (POST) 호출 후, 새 팝업 창으로 결과 표시
 */
export function postPopupOpen(popupName, url, width, height, valueObjects) {
    
    /*CSRF Token apply - 2021.04.20*/
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const tokenName = document.querySelector('meta[name="_csrf_parameter"]').getAttribute('content');

    valueObjects[tokenName] = token;
    /*//CSRF Token apply - 2021.04.20*/

    if (popupName === "") popupName = 'NewWindow';
    
    const form = document.createElement('form');
    const stat = stringFormat('menubar={0} location={1} directories={2} resizable={3} scrollbars={4} status={5} titlebar={6} toolbar={7} left={8} top={9}'
        , 0, 0, 0, 1, 1, 0, 1, 0, 
        (window.screen.width - width) / 2, (window.screen.height - height) / 2);
    
    for (key in valueObjects) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = valueObjects[key];
        form.append(input);
    }

    form.method = 'post';
    form.target = popupName;
    form.action = url;

    const openWindow = window.open('', popupName, stringFormat('width={0}px height={1}px {2}', width, height, stat));
    
    if (openWindow !== null)  openWindow.focus();

    document.body.append(form);
    form.submit();
    form.remove();

    return openWindow;
}

/***********************버튼 중복체크 방지 모듈 시작***********************/
/*
1. 단순 조회에서 사용
	- ajax 호출 전 버튼체크 및 락 거는 로직 추가
        beforeSend: function () {
            if (BtnBlocker.isBlocked()) {
                alert('처리중입니다. 잠시만 기다려주세요.');
                return false; // 요청 자체를 막음
            }
            BtnBlocker.block();
        },
	- ajax complete 안에 버튼 락 해제 추가
		BtnBlocker.unblock();
		
2. 저장버튼에서 사용(btnEevent, btnEeventReturn 사용하는 경우)
	- btnEevent 함수에서 버튼 락 거는 로직 자동 처리
	- ajax complete에 버튼 락 해제 추가
		BtnBlocker.unblock();
	- btnEevent 호출 후 callback 결과가 아니오(false)인 경우 초기화 추가  
		BtnBlocker.unblock();

3. 저장버튼에서 사용(btnEevent, btnEeventReturn 사용하는 하지 않는 경우)
	- 1번 단순 조회에서 사용과 동일하게 사용
*/
let isLock = false;

/**
 * 버튼 중복 클릭 방지를 위한 상태 관리 모듈
 */
export const BtnBlocker = {
    isBlocked: () => isLock,
    block: () => { isLock = true; },
    unblock: () => { isLock = false; }
};

/**
 * 확인/취소 다이얼로그를 띄우고, 버튼 중복 클릭을 방지합니다.
 * 
 * @param {string} val - 확인 메시지
 * @param {Function} [callback] - 사용자 정의 콜백 (true=예, false=아니오)
 * @returns {boolean|undefined} callback이 없으면 boolean 반환, 있으면 callback 실행
 */
export function btnEvent(val, callback) {
    if (BtnBlocker.isBlocked()) {
        alert('처리중 입니다. 잠시만 기다려주세요.');
        return false;
    }

    // callback 없는 경우: 기본 confirm 사용
    if (!callback || typeof callback !== 'function') {
        const mc = window.confirm(val);
        if (!mc) BtnBlocker.unblock();
        else BtnBlocker.block();
        return mc;      
    }

    // callback 있는 경우: 커스텀 confirm 다이얼로그
    createConfirmDialog("확인", val, () => {
        BtnBlocker.block();
        callback(true);
    }, () => {
        BtnBlocker.unblock();
        callback(false);
    });
}

/**
 * 커스텀 confirm 다이얼로그 생성(바닐라 JS로 리팩토링하려면 커스텀 모달(confirm 다이얼로그)을 직접 구현)
 * 
 * @param {string} message - 다이얼로그 메시지
 * @param {Function} onConfirm - '예' 클릭 시 실행
 * @param {Function} onCancel - '아니오' 클릭 시 실행
 */
function createConfirmDialog(title, content, onConfirm, onCancel) {
    // 기존 다이얼로그 제거
    const oldDialog = document.getElementById("custom-confirm");
    if (oldDialog) oldDialog.remove();

    // 다이얼로그 생성
    const dialog = document.createElement("div"); 
    dialog.id = "custom-confirm"; 
    const div1 = document.createElement("div"); 
    const div2 = document.createElement("div"); 
    const h3 = document.createElement("h3"); 
    const p = document.createElement("p"); 
    const div3 = document.createElement("div"); 
    const btnYes = document.createElement("button"); 
    const btnNo = document.createElement("button"); 
    
    div1.className = "confirm-overlay"; 
    div2.className = "confirm-box"; 
    h3.textContent = title; 
    p.className = "confirm-message"; 
    div3.className = "confirm-buttons"; 
    btnYes.className = "btn-blue"; 
    btnYes.innerHTML = "예"; 
    btnNo.className = "btn-orange"; 
    btnNo.innerHTML = "아니오"; 

    // 버튼 구성
    if (typeof onCancel === "function") {
        div3.append(btnYes, btnNo); 
    } else {
        div3.append(btnYes); 
    }
    div2.append(h3, p, div3); 
    dialog.append(div1, div2);

    document.body.appendChild(dialog);

    // message는 textContent로 안전하게 넣음
    dialog.querySelector(".confirm-message").textContent = content;

    // 이벤트 바인딩
    const [yesBtn, noBtn] = dialog.querySelectorAll("button");
    yesBtn.addEventListener("click", () => {
        onConfirm();
        dialog.remove();
    });

    if (typeof onCancel === "function") {
        noBtn.addEventListener("click", () => {
        onCancel();
        dialog.remove();
    });
    }
}

/**
 * 확인 다이얼로그(확인 버튼만 있는 형태)를 띄우고, 버튼 중복 클릭 상태를 해제합니다.
 * 
 * @param {string} val - 다이얼로그에 표시할 메시지(본문 내용)
 * @param {string} msg - 다이얼로그 타이틀(제목)
 * @param {Function} [callback] - 확인 버튼 클릭 시 실행되는 콜백 함수
 * @returns {void}
 * 
 * 사용 예시:
 * btnEventReturn("저장이 완료되었습니다.", "알림", () => {
 *   console.log("확인 버튼 클릭됨");
 * });
 */
export function btnEventReturn(val, msg, callback) {
    if(!callback || typeof callback !== 'function') {
        alert(val);
        return;
    }

    // callback 있는 경우: 커스텀 confirm 다이얼로그
    createConfirmDialog(msg, val, () => {
        BtnBlocker.unblock();
        callback(true);
    });
}

/***********************버튼 중복체크 방지 모듈 끝***********************/

/**
 * 문자열의 앞뒤 공백(whitespace)을 제거합니다.
 *
 * @param {string} strSource - 공백을 제거할 원본 문자열
 * @returns {string} 앞뒤 공백이 제거된 문자열
 *
 * 사용 예시:
 * trim("   Hello World!   ");
 * // => "Hello World!"
 */
export function trim(strSource) {
    return strSource.replace(/^\s+|\s+$/g, '');
}

/**
 * 입력 필드에 숫자만 허용하고, 지정된 소수점 자리수까지만 입력되도록 제한합니다.
 *
 * @param {HTMLInputElement} obj - 제어할 input 요소
 * @param {number} precision - 허용할 소수점 자리수 (0 = 정수만 허용)
 * @returns {boolean} 유효 입력 여부 (true = 정상 입력, false = 잘못된 값으로 초기화됨)
 *
 * 사용 예시:
 * <input id="price" oninput="inputNumberOnly(this, 2)">
 * // => "123.4567" 입력 시 "123.45" 로 잘림
 * // => precision = 0 일 경우 소수점 입력 불가 (정수만 허용)
 */
export function inputNumberOnly(obj, precision) {
    const tmp = obj.value;

    // 공백 또는 빈 값이면 초기화
    if (tmp.indexOf(" ") !== -1 || tmp === "") {
        document.getElementById(obj.id).value = "";
        return false;
    } 
    
    // 숫자형이 아니면 초기화
    if (isNaN(tmp)) {
        document.getElementById(obj.id).value = "";
        return false;
    } 

    // 정수만 허용
    if (precision === 0) {
        document.getElementById(obj.id).value = tmp.replace('.', '');
    } else {
        // 소수점 자리수 제한
        if (tmp.indexOf(".") !== -1) {
            const [intPart, decPart] = tmp.split(".");
            if (decPart.length > precision) {
                document.getElementById(obj.id).value =
                intPart + "." + decPart.substring(0, precision);
            }
        }
    }
    return true;
}

/**
 * 입력 필드에 숫자만 허용하고, 소수점 자릿수를 제한하며, 3자리마다 콤마(,)를 붙여줍니다.
 * 음수 입력도 허용합니다.
 *
 * @param {HTMLInputElement} obj - 제어할 input 요소
 * @param {number} precision - 허용할 소수점 자리수 (0 = 정수만 허용)
 * @returns {boolean} 유효 입력 여부
 */
export function inputNumberOnlyComma(obj, precision) {
    let tmp = obj.value;
    const mainus = tmp.startsWith("-") ? true : false; //음수허용여부

    // 소수점 처리
    if (tmp.indexOf(".") !== -1) {
        tmp = tmp.split('.')[0].replace(/[^0-9]/g, '') + '.' + tmp.split('.')[1];
    } else {
        tmp = tmp.replace(/[^0-9]/g, '');
    }

    const object = document.getElementById(obj.id);

    // 공백이거나 빈 값이면 초기화
    if (tmp.indexOf(" ") !== -1 || tmp === "") {
        if (mainus) object.value = "-";
        else  {
            object.value = '0';
            object.focus();
        }
        return false;
    }

    // 숫자가 아니면 초기화
    if (isNaN(tmp)) {
        object.value = '0';
        object.focus();
        return false;
    }

    // 값 포맷팅
    let ret = "";
    if (precision === 0) {
        ret = comma(tmp.replace('.', ''));
    } else {
        if (tmp.indexOf(".") !== -1) {
        const [intPart, decPart] = tmp.split(".");
        if (decPart.length >= precision) {
            ret = comma(intPart) + '.' + decPart.substring(0, precision);
        } else {
            ret = comma(intPart) + '.' + decPart.substring(0, precision);
        }
        } else {
        ret = comma(tmp.replace('.', ''));
        }
    }

    if (mainus) ret = '-' + ret;

    if (object.value != ret) object.value = ret;
    
    return true;
}

/**
 * 숫자 또는 문자열을 3자리마다 콤마(,)로 구분해 반환합니다.
 * 정수/소수 모두 지원하며, 음수도 정상 처리합니다.
 * 기존 comma() + comma2() 함수 통합 버전입니다.
 *
 * @param {string|number} p_x - 콤마를 추가할 대상 값
 * @returns {string} 콤마가 추가된 문자열
 *
 * 사용 예시:
 * formatComma(1234567);       // "1,234,567"
 * formatComma("9876543");     // "9,876,543"
 * formatComma(12345.6789);    // "12,345.6789"
 * formatComma("-98765.4321"); // "-98,765.4321"
 */
export function comma(p_x) {
    if (value === undefined || value === '' || value === null) return "0";

    const strValue = String(value);

    // 소수점이 들어간 숫자 처리
    if (strValue.includes('.')) {
        const [intPart, decPart] = strValue.split('.');
        const regx = new RegExp(/(-?\d+)(\d{3})/);
        let formattedInt = intPart;
        while (regx.test(formattedInt)) {
        formattedInt = formattedInt.replace(regx, "$1,$2");
        }
        return `${formattedInt}.${decPart}`;
    } 

    // 정수 처리 (comma 방식)
    let tmp = "";
    let num_len = strValue.length;
    let co = 3;

    while (num_len > 0) {
    num_len -= co;
    if (num_len < 0) {
        co += num_len;
        num_len = 0;
    }
    tmp = "," + strValue.replace(/,/g, '').slice(num_len, num_len + co) + tmp;
    }
    return tmp.substring(1).replace('-,', '-');

}

/**
 * 문자열 형태의 날짜(예: "20180101")를 "YYYY-MM-DD" 형식으로 변환합니다.
 *
 * @param {string} num - 변환할 날짜 문자열 (예: "20180101")
 * @returns {string} 변환된 날짜 문자열 (예: "2018-01-01"), 잘못된 입력은 그대로 반환
 */
export function YMDFormatter(num) { 
    if (!num) return ""
    else if (String(num).length !== 8) return num; // 형식이 맞지 않으면 원본 반환

    let formatNum = '';
    num = num.replace(/\s/gi, "");
    try {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    } catch (e) {
        formatNum = num;
        console.log(e);
    }
    return formatNum;
}

/**
 * "YYYY-MM-DD" 형식의 날짜 문자열을 "YYYYMMDD" 형식으로 변환합니다.
 *
 * @param {string} date - 변환할 날짜 (예: "2018-01-01")
 * @returns {string} 변환된 날짜 (예: "20180101"), 잘못된 형식은 원본 반환
 */
export function RevYMDFormatter(date) {
    if (!date) return ""
    else if (date.split('-').length !== 3) return date; // 형식이 맞지 않으면 원본 반환

    const [yyyy, mm, dd] = date.split('-');
    return `${yyyy}${mm}${dd}`;
}

// Wrapper
export const bizNoFormatter = num => NoFormatter(num, "biz");
export const coNoFormatter = num => NoFormatter(num, "co");

/**
 * 사업자번호 문자열(10자리)을 "000-00-00000" 형식으로 변환합니다.
 * or 또는 법인등록번호(13자리)를 "000000-0000000" 형식으로 변환합니다.
 *
 * @param {string|number} num - 변환할 사업자번호 (예: "1234567890")
 * @returns {string} 변환된 사업자번호 (예: "123-45-67890"), 잘못된 입력은 원본 반환
 */
function NoFormatter(num, type) {
    if (!num || (type !== "co" && type !== "biz")) return "";

    let formatNum = '';
    num = num.replace(/\s/gi, "");

    if ((type === "biz" && num.length !== 10) || (type === "co" && num.length !== 13)) return num; // 10자리(사업자) && 13자리(법인) 아니면 원본 반환

    try {
        formatNum = type === "biz"
        ? num.replace(/^(\d{3})(\d{2})(\d{5})$/, "$1-$2-$3")
        : num.replace(/(\d{6})(\d{7})/, "$1-$2");
    } catch (e) {
        formatNum = num;
        console.log(e);
    }
    return formatNum;
}

// Wrapper
export const phoneFormatter = num => TelFormatter(num, "phone");
export const telFormatter = num => TelFormatter(num, "tel");

/**
 * 전화번호 문자열을 하이픈(-) 포함 형식으로 변환합니다.
 * - 휴대폰 (phone): 01012345678 → 010-1234-5678
 * - 유선전화 (tel): 0212345678 → 02-123-45678, 8~11자리 대응
 *
 * @param {string|number} num - 변환할 번호
 * @param {"phone"|"tel"} type - 번호 유형
 * @returns {string} 변환된 번호, 잘못된 입력은 원본 반환
 */
function TelFormatter(num, type) {
    if (!num || (type !== "phone" && type !== "tel")) return "";

    num = String(num).replace(/\s/gi, "");
    let formatNum = num;
    
    try {
        if (type === "phone") { // 휴대폰
            if (num.length === 11) {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            } else if (num.length === 10) {
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            }
        } else { // 일반전화
            if (num.length === 11) {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            } else if (num.length === 10) {
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
            } else if (num.length === 9) {
                formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
            } else if (num.length === 8) {
                formatNum = num.replace(/(\d{4})(\d{4})/, "$1-$2");
            } 
        }
    } catch (e) {
        console.log(e);
    }
    return formatNum;
}

/**
 * 하이픈(-)으로 구분된 전화번호 문자열을 잘라서
 * 지정된 id 규칙을 가진 여러 input 요소에 각각 채워 넣습니다.
 *
 * 예: "010-1234-5678" 이고 id="phone" 이면
 *  - phone_0 → "010"
 *  - phone_1 → "1234"
 *  - phone_2 → "5678"
 *
 * @param {string} obj - 하이픈(-) 포함 전화번호 문자열 (예: "010-1234-5678")
 * @param {string} id - input 요소 id prefix (예: "phone")
 * @returns {void}
 */
export function phoneFormatterRev(obj, id) {
    if (!obj) return;

    obj.split('-').forEach((part, idx) => {
        const el = document.getElementById(`${id}_${idx}`);
        if (el) el.value = part;
    });
}

/**
 * 지정된 form 컨테이너(id) 내에서 data-param 속성이 붙은 요소들의 값을 수집하여
 * FormData 객체로 반환합니다.
 *
 * - 수집 대상: input[type=text|number|hidden|password|date], select, radio, checkbox, textarea
 * - radio/checkbox는 체크된 경우만 포함합니다.
 * - name 속성이 없는 요소는 무시됩니다.
 *
 * @param {string} id - form 컨테이너의 id
 * @returns {FormData} 수집된 데이터를 담은 FormData 객체
 *
 * 사용 예시:
 * const data = fn_formData("myForm");
 * fetch("/api/submit", { method: "POST", body: data });
 */
export function fn_formData(id) {
    const pData = new FormData();
    const row = document.getElementById(id);
    const inputs = row.querySelectorAll(
    'input[type=text][data-param], input[type=number][data-param], input[type=hidden][data-param], input[type=password][data-param], input[type=date][data-param]');
    const selects = row.querySelectorAll('select[data-param]');
    const radios = row.querySelectorAll('input[type=radio][data-param]');
    const checkboxes = row.querySelectorAll('input[type=checkbox][data-param]');
    const textareas = row.querySelectorAll('textarea[data-param]');

    inputs.forEach(input => { if (input.name !== "")  pData.append(input.name, input.value); });
    selects.forEach(select => { if (select.name !== "")  pData.append(select.name, select.value); });
    radios.forEach(radio => { if (radio.checked && radio.name !== "")  pData.append(radio.name, radio.value);});
    checkboxes.forEach(checkbox => { if (checkbox.checked && checkbox.name !== "")  pData.append(checkbox.name, checkbox.value);});
    textareas.forEach(textarea => { if (textarea.name !== "")  pData.append(textarea.name, textarea.value);});

    return pData;
}

/**
 * fn_formData 함수로 생성한 FormData 객체를 JSON 객체 형태로 변환합니다.
 * (디버깅, 로깅, JSON 전송 등에 유용)
 *
 * @param {string} id - form 컨테이너의 id
 * @returns {Object} key-value 쌍을 담은 일반 JavaScript 객체
 *
 * 사용 예시:
 * const dataJson = fn_formDataJson("myForm");
 * console.log(JSON.stringify(dataJson));
 * // => {"username":"yerin","age":"23"}
 */
export function fn_formDataJson(id) {
    const formData = fn_formData(id);
    const obj = {};
    for (const [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}

/**
 * 특정 form 컨테이너(id) 내부에서 `data-name` 속성이 지정된 요소들을 검사하여
 * 값이 비어 있거나 선택되지 않은 경우 사용자에게 안내 메시지를 띄웁니다.
 * 
 * - 검사 대상: `data-name` 속성이 있는 input, select, textarea 등
 * - 라디오/체크박스는 같은 name 그룹 중 체크된 항목이 없으면 경고
 * - 일반 input/select/textarea는 값이 공백일 경우 경고
 * - 메시지 출력 시 `data-name` 속성값을 문구에 사용
 * 
 * @param {string} id - 검사할 form 컨테이너의 id
 * @param {string} disableChk - "Y"인 경우 disabled/readonly 요소도 검사 포함
 * @returns {boolean} 모든 필수값이 채워져 있으면 true, 하나라도 누락되면 false
 */
export function fn_dataChk(id, disableChk) {
    let chk = true;
    const datas = document.getElementById(id).querySelectorAll('*[data-name]');

    for (const data of datas) {
        const type = data.type;
        const name = data.name;                 // 그룹 판별용
        const label = data.getAttribute('data-name'); // 메시지 출력용

        if ((data.readOnly !== true && data.disabled !== true) || disableChk === 'Y') {
            if (type === "radio" || type === "checkbox") {
                if (!validateOptionGroup(type, name, label)) {
                    chk = false;
                    break;
                }
            }
            else {
                if (data.value.trim() === "") {
                    data.focus();
                    
                    if (data.tagName === "SELECT") {
                        btnEventReturn(`${label}을(를) 선택 하셔야 합니다.`, '', function(msgResult){});
                    } else {
                        btnEventReturn(`${label}을(를) 선택 하셔야 합니다.`, '', function(msgResult){})
                    }
                    chk = false;
                    return false;
                }
            }
        } 
    };

    return chk;
}

/**
 * 라디오/체크박스 그룹에 대해 하나 이상 선택되었는지 검사하는 보조 함수
 * 
 * @param {string} type - "radio" 또는 "checkbox"
 * @param {string} name - 같은 그룹을 판별하는 name 속성 값
 * @param {string} label - 사용자 안내 메시지에 표시할 data-name 속성 값
 * @returns {boolean} 그룹 내 체크된 항목이 있으면 true, 없으면 false
 */
function validateOptionGroup(type, name, label) {
    if (document.querySelectorAll(`input[type=${type}][name='${name}']:checked`).length === 0) {
        const el = document.querySelector(`input[type=${type}][name='${name}']`);
        if (el) el.focus();
        
        btnEventReturn(`${label}을(를) 선택 하셔야 합니다.`, '', function(msgResult){});
        return false;
    }
    return true;
}

/**
 * form 태그 안에 있는 input[data-numform] 요소들의 숫자 입력을 제어합니다.
 * 
 * - data-numform 속성:
 *   A : 숫자만 입력
 *   B : 숫자만 입력 + 3자리 콤마
 *   C : 숫자만 입력 + 3자리 콤마 + 소수점 허용 (data-numdigit 소수점 자리수 제한)
 *   D : 숫자만 입력 + 소수점 허용 (data-numdigit 소수점 자리수 제한)
 *
 * @param {string} id - form 태그의 id
 */
export function fn_numberFormatter(id) {
    const datas = document.getElementById(id).querySelectorAll('*[data-numform]');
    datas.forEach(data => {
        input.addEventListener('keyup', formatHandler);
        input.addEventListener('blur', formatHandler);
    });

    function formatHandler(event) {
        let value = event.target.value;
        let replaceValue = '';
        const numform = event.target.dataset.numform;
        const digit = Number(event.target.dataset.numdigit);

        if (numform === "A") {
            // 숫자만 입력
            replaceValue = value.replace(/[^0-9]/g, "");
        } 
        else if (numform === "B") {
            // 숫자만 입력 + 3자리 콤마
            replaceValue = value.replace(/[^0-9]/g, "");
            replaceValue = replaceValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } 
        else if (numform === "C") {
            // 숫자 + 콤마 + 소수점
            replaceValue = value.replace(/[^\d.]/g, "");
            const decimalCount = (replaceValue.match(/\./g) || []).length;

        if (decimalCount > 1) {
            replaceValue = "";
        } else if (decimalCount === 1) {
            const decimalIndex = replaceValue.indexOf(".");
            let decimalPntBef = replaceValue.substring(0, decimalIndex);
            let decimalPntAft = replaceValue.substring(decimalIndex + 1);

            decimalPntBef = decimalPntBef.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            if (!isNaN(digit) && decimalPntAft.length > digit) {
                decimalPntAft = decimalPntAft.substring(0, digit);
            }
            replaceValue = decimalPntBef + "." + decimalPntAft;
        } else {
            replaceValue = replaceValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        } 
        else if (numform === "D") {
            // 숫자 + 소수점
            replaceValue = value.replace(/[^\d.]/g, "");
            const decimalCount = (replaceValue.match(/\./g) || []).length;

        if (decimalCount > 1) {
            replaceValue = "";
        } else if (decimalCount === 1) {
            const decimalIndex = replaceValue.indexOf(".");
            const decimalPntBef = replaceValue.substring(0, decimalIndex);
            let decimalPntAft = replaceValue.substring(decimalIndex + 1);

            if (!isNaN(digit) && decimalPntAft.length > digit) {
                decimalPntAft = decimalPntAft.substring(0, digit);
            }
            replaceValue = decimalPntBef + "." + decimalPntAft;
        }
    }
        event.target.value = replaceValue;
    }
}

/**
 * 전화번호 문자열을 하이픈(-) 포함 형식으로 변환합니다.
 * 
 * 사용 예시:
 * - 인풋에서 직접 입력 시 (key = "1")
 *   <input type="text" onblur="TelNumberformet(this, '1')" />
 *   → 입력값을 자동으로 010-1234-5678 같은 형식으로 변환
 * 
 * - DB 바인딩 시 (key = "2")
 *   TelNumberformet("01012345678", "2") → "010-1234-5678"
 * 
 * @param {HTMLInputElement|string} obj - key가 "1"일 경우 input 요소, "2"일 경우 전화번호 문자열
 * @param {"1"|"2"} key - 호출 방식 구분 ("1" = input요소에서 입력 시, "2" = DB 값 문자열 변환 시)
 * @returns {string|void} key가 "2"일 경우 변환된 전화번호 문자열 반환, "1"일 경우 input.value를 직접 수정
 */
export function TelNumberformet(obj, key) {
    let number = "";
    let tel = "";

    if (obj === null || obj === undefined) return "";

    switch (key) {
        case "1":
            number = obj.value.replace(/[^0-9]/g, "");
            break;
        case "2":
            number = obj.replace(/[^0-9]/g, "");
            break;
        default:
            return "";
    }

    // 서울 지역 번호(02)가 들어오는 경우
    const areaLen = number.startsWith("02") ? 2 : 3; // 서울번호는 2자리, 그 외는 3자리
    tel = telFormatter(number, areaLen);

    if (key === "1") obj.value = tel;
    else if (key === "2") return tel;
}

/**
 * 전화번호 포맷터
 * 
 * @param {string} number - 숫자만 있는 전화번호 문자열
 * @param {number} areaLen - 지역번호 길이 (서울 02 → 2, 그 외 3)
 * @returns {string} 하이픈(-) 포함 포맷된 전화번호
 */
function telFormatter(number, areaLen) {
    let tel = "";
    areaLen += 1;  // 분기점 기준

    if (number.length < areaLen) {
        return number;
    } else if (number.length < areaLen + 3) {
        tel += number.slice(0, areaLen);
        tel += "-";
        tel += number.slice(areaLen);
    } else if (number.length < areaLen + 7) {
        tel += number.slice(0, areaLen);
        tel += "-";
        tel += number.slice(areaLen, areaLen + 3);
        tel += "-";
        tel += number.slice(areaLen + 3);
    } else {
        tel += number.slice(0, areaLen);
        tel += "-";
        tel += number.slice(areaLen, areaLen + 4);
        tel += "-";
        tel += number.slice(areaLen + 4);
    }
    return tel;
}

/**
 * 자동 로그아웃 카운터 초기화 함수
 * - 지정된 시간(초)부터 1초 단위로 감소하며 화면에 남은 시간을 표시
 * - 시간이 0이 되면 자동 로그아웃 함수(logOutAuto) 호출
 * - 화면 클릭 시 카운터 리셋
 *
 * @example
 * counter_init();
 * // => 화면에 "0:20:00" 형식으로 표시 후 감소, 클릭 시 다시 20분으로 초기화
 */
export function counter_init() {
    let cnt = parseInt(1200);

    // 자동 로그아웃 시작
    setInterval(function () {
        document.getElementById('counter').textContent = time_format(cnt--);

        if (cnt < 0) logOutAuto();
    }, 1000);

    // 자동 로그아웃 리셋
    function counter_reset () {cnt = parseInt(1200); }

    // 자동 로그아웃 시간 포맷
    function time_format (s) {
        let nHour = 0;
        let nMin = 0;
        let nSec = 0;

        if (s > 0) {
            nMin = Math.floor(s / 60);
            nSec = s % 60;

            if (nMin >= 60) {
                nHour = Math.floor(nMin / 60);
                nMin = nMin % 60;
            }
        }

        if (nSec < 10) nSec = "0" + nSec;
        if (nMin < 10) nMin = "0" + nMin;

        return `${nHour}:${nMin}:${nSec}`;
    }

    // 화면 클릭 시 리셋
    document.onclick = function () {
		counter_reset();
		
	    // 팝업창에서 opener(부모창)가 존재할 경우, 부모창의 counter_reset도 실행
        if (opener && typeof opener.window["counter_reset"] === "function") {
            opener.counter_reset();
        }
	}
}

/**
 * 값이 비어있는지 여부를 확인합니다.
 * 
 * @param {*} str - 확인할 값
 * @returns {boolean} 비어있으면 true, 아니면 false
 */
export function isEmpty(str) {
    return (typeof str === "undefined" || str === null || str === "");
}

/**
 * NVL (Null Value Logic)
 * 
 * 주어진 값이 `undefined`, `null`, 빈 문자열("")일 경우
 * 기본값(`defaultStr`)을 반환하며,
 * 기본값마저 없으면 빈 문자열("")을 반환합니다.
 *
 * @param {any} str - 확인할 값
 * @param {any} defaultStr - 기본값 (옵션)
 * @returns {any} str 값이 유효하면 그대로, 아니면 defaultStr,
 *               둘 다 없으면 빈 문자열("") 반환
 *
 * 사용 예시:
 * nvl("Hello", "World");   // "Hello"
 * nvl("", "World");        // "World"
 * nvl(null, "World");      // "World"
 * nvl(undefined, "World"); // "World"
 * nvl(null, null);         // ""
 */
export function nvl(str, defaultStr) {
    if (typeof str === "undefined" || str === null || str === ""){
        str = defaultStr;
        if (typeof defaultStr === "undefined" || defaultStr === null || defaultStr === "") str = '';
    }
    return str;
}

/**
 * Excel 다운로드용 배열 데이터를 JSON 문자열로 변환합니다.
 *
 * @param {Array[]} arrName  - 컬럼명 배열 (2차원 배열, 마지막 행 사용)
 * @param {Array} arrRef     - 컬럼 참조키 배열
 * @param {Array} arrWidth   - 컬럼 너비 배열
 * @param {Array} arrType    - 컬럼 타입 배열
 * @returns {string|undefined} 
 *    - 변환된 JSON 문자열 (예: '[{"NAME":"이름","REF":"NAME","WIDTH":100,"TYPE":"STRING"}, ...]')
 *    - 입력 배열의 길이가 서로 다르면 alert를 띄우고 undefined 반환
 *
 * 사용 예시:
 * const arrName = [["컬럼명"], ["이름", "나이", "주소"]];
 * const arrRef = ["NAME", "AGE", "ADDR"];
 * const arrWidth = [100, 50, 200];
 * const arrType = ["STRING", "NUMBER", "STRING"];
 *
 * const json = exelDownJson(arrName, arrRef, arrWidth, arrType);
 * console.log(json);
 * // => '[{"NAME":"이름","REF":"NAME","WIDTH":100,"TYPE":"STRING"}, ...]'
 */
export function exelDownJson(arrName, arrRef, arrWidth, arrType) {
    const maxRow = arrName.length - 1;

    if(arrName[maxRow].length === arrRef.length && arrName[maxRow].length === arrWidth.length && arrName[maxRow].length === arrType.length) {
        let objs = [];
        for(let i = 0; i < arrName[maxRow].length; i++){
	        let obj = {};
	    	obj.NAME = arrName[maxRow][i];
	    	obj.REF = arrRef[i];
	    	obj.WIDTH = arrWidth[i];
	    	obj.TYPE = arrType[i];
	    	objs.push(obj);
	    }	
        return JSON.stringify(objs);
    }
    alert("입력한 파라메터 배열의 길이가 다릅니다.");
}

/**
 * 문자열 배열을 JSON 문자열로 변환합니다.
 * 각 요소는 { name: 값 } 형태의 객체로 변환됩니다.
 *
 * @param {string[]} arr - 변환할 문자열 배열
 * @returns {string} JSON 문자열 (예: '[{"name":"a"},{"name":"b"}]')
 */
export function arrToJson(arr) {
    let objs = [];
    arr.forEach(v => {
        const obj = {};   // 객체로 생성
        obj.name = v;
        objs.push(obj);
    });
    return JSON.stringify(objs);
}

/**
 * 이메일 주소의 유효성을 검증합니다.
 *
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} 유효하면 true, 잘못된 경우 false
 */
export function verifyEmail(email) {
	const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (email.match(regExp) !== null) return true;

    alert("메일주소가 올바르지 않습니다.");
    return false;
}

/**
 * 비밀번호 유효성 검증
 * - 영문 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 함
 * - 8자리 이상
 *
 * @param {string} pwd - 검사할 비밀번호
 * @returns {boolean} 유효하면 true, 아니면 false
 */
export function verifyPwd(pwd) {
    const regExp = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (pwd.match(regExp) !== null) return true;

    alert("비밀번호는 영문자(대,소문자), 숫자, 특수문자를 혼합한 8자리 이상으로 입력해 주세요.");
    return false;
}

/**
 * 소수점 자릿수 처리
 * 
 * @param {number|string} num - 입력 숫자
 * @param {number} digit - 소수점 자릿수
 * @param {"0"|"1"|"2"} [sct="0"] - 처리 방식 (0: 반올림, 1: 올림, 2: 버림)
 * @returns {string|number} 포맷팅된 숫자 (문자열)
 */
export function roundNum(num, digit, sct) {
    let digitnum = Math.pow(10, digit);
    if (digit === 0) { 
        digitnum = 1;
    } else if (digit === 1) {
        digitnum = 10;
    }

    if (num === '' || num === undefined || num === null) {
        return digit !== 0 ? '0.' + String(digitnum).slice(1) : '0';  // 자릿수 0 아니면 자릿수만큼 0 붙이기
    }

    num = Number(num);

     // 반올림 / 올림 / 버림 처리
    if (sct === '' || sct === undefined || sct === null) num = Math.round(num * digitnum) / digitnum;  
    else if (sct === '1') num = Math.ceil(num * digitnum) / digitnum;  
    else if (sct === '2') num = Math.floor(num * digitnum) / digitnum;  

    let strNum = String(num);

    // 소수점 없는 경우
    if (strNum.indexOf('.') === -1) {
        return digit !== 0 ? strNum + '.' + String(digitnum).slice(1) : strNum;
    }

    // 소수점 자릿수 맞추기
    let currentDigit = strNum.length - strNum.indexOf('.') - 1;
    while (currentDigit < digit) {
        strNum += '0';
        currentDigit++;
    }

    return strNum;
}

/**
 * 고정 테이블의 헤더(left 위치)를 자동 계산하여 CSS 적용
 * @param {string} id - 테이블 ID
 */
export function setFixTableHeadCss(id) {
	let thLeft = 0;
    const element = document.getElementById(id);

    // 헤더 left 계산
    element.querySelectorAll(".fix_thd").forEach((el) => {
        el.style.left = thLeft + "px";
        thLeft += parseInt(getComputedStyle(el).width, 10);  // width 누적
    });

    // 테이블 margin-left 계산
    element.style.marginLeft = thLeft + "px";
}

/**
 * 고정 테이블(body) left 위치 자동 계산
 * - 헤더(.fix_thd)와 데이터(.fix_tdd)의 left 값을 누적 width 기준으로 계산
 * - 열 고정된 테이블 UI를 구성할 때 사용
 *
 * @param {string} id - 고정 테이블을 감싸고 있는 부모 요소의 ID
 */
export function setFixTableBodyCss(id) {
	let thLeft = 0;
	let tdLeft = 0;
	let fixCnt = 0;

    // 헤더 left 계산
    document.getElementById(id).querySelectorAll(".fix_thd").forEach((el) => {
        el.style.left = thLeft + "px";
        thLeft += parseInt(getComputedStyle(el).width, 10);  // width 누적
        fixCnt++;
    });

    // 데이터 left 계산
    document.getElementById(id).querySelectorAll(".fix_tdd").forEach((el, idx) => {
        if (idx%fixCnt === 0) tdLeft = 0;

        el.style.left = tdLeft + "px";
        tdLeft += parseInt(getComputedStyle(el).width, 10);
    });
}

/**
 * 같은 값이 연속된 열을 병합(rowspan) 처리합니다.
 *
 * @param {HTMLTableElement} table - 대상 테이블 요소
 * @param {number} colIdx - 병합할 열 인덱스 (0부터 시작)
 * @param {boolean} [isStats=false] - true일 경우 이전 열 값이 같은 경우에만 병합
 * 
 * 사용법: setRowspan(document.getElementById("테이블ID"), 0);
 */
export function setRowspan(table, colIdx, isStats = false) {
    if (!(table instanceof HTMLTableElement)) {
        console.warn("setRowspan: table 요소가 아닙니다.");
        return;
    }

    let that = null;  // 비교 기준 셀
    let rowspan = 1;

    [...table.rows].forEach((row) => {
        const cell = row.cells[colIdx];
        if (!cell) return; // 셀이 없으면 skip

        if (that &&
            cell.textContent === that.textContent &&
            (!isStats || (isStats && cell.previousElementSibling?.textContent === that.previousElementSibling?.textContent))) {
            // 기존 셀 rowspan 증가
            rowspan = parseInt(that.getAttribute("rowspan") || "1", 10) + 1;
            that.setAttribute("rowspan", rowspan);

            // 현재 셀 숨김 처리
            cell.style.display = "none";
        } else {
            // 새로운 그룹 시작
            that = cell;
            rowspan = 1;
        }
    });
}

/**
 * 같은 값이 연속된 셀들을 병합(colspan) 처리합니다.
 *
 * @param {HTMLTableElement} table - 대상 테이블 요소
 * @param {number} rowIdx - 병합할 행 인덱스 (0부터 시작)
 * 
 * 사용법: setColspan(document.getElementById("테이블ID"), 0);
 */
export function setColspan(table, rowIdx) {
    if (!(table instanceof HTMLTableElement)) {
        console.warn("setColspan: table 요소가 아닙니다.");
        return;
    }

    const row = table.rows[rowIdx];
    if (!row) return;

    let that = null;
    let colspan = 1;

    [...row.cells].forEach((cell) => {
        if (that && cell.textContent === that.textContent) {
            // 기존 셀 colspan 증가
            colspan = parseInt(that.getAttribute("colspan") || "1", 10) + 1;
            that.setAttribute("colspan", colspan);

            // 현재 셀 숨김 처리
            cell.style.display = "none";
        } else {
            // 새로운 그룹 시작
            that = cell;
            colspan = 1;
        }
    });
}

import vanillaSelectBox from "vanilla-select-box";
import "vanilla-select-box/dist/vanillaSelectBox.css";  // 기본 CSS

/**
 * 멀티 셀렉트 박스를 초기화합니다.
 *
 * @param {string} ctrlId - 셀렉트 박스 ID (ex: "mySelect")
 */
export function multiSelectBox(ctrlId) {
    new vanillaSelectBox("#" + ctrlId, {
        search: true,               // 검색 박스 표시
        placeHolder: "선택",        // placeholder
        maxHeight: 200,             // 옵션창 높이 제한
        translations: {             // 텍스트 다국어
            "all": "전체선택",
            "items": "항목 선택",
            "selectAll": "전체선택",
            "clearAll": "전체해제",
            "search": "검색"
        }
    });
}

/**
 * 휴대폰 번호 유효성 검증
 * 
 * - 형식: 010-XXXX-XXXX 또는 010XXXXXXXX
 * - 중간 하이픈(-)은 선택적으로 허용
 *
 * @param {string} phone - 검증할 휴대폰 번호 문자열
 * @returns {boolean} 유효한 번호이면 true, 아니면 false
 *
 * 사용 예시:
 * verifyPhon("010-1234-5678"); // true
 * verifyPhon("01012345678");   // true
 * verifyPhon("011-123-4567");  // false
 */
export function verifyPhon(phone) {
    const regExp = /^(010)-?[0-9]{3,4}-?[0-9]{4}$/;
    if (phone.test(regExp)) return true;

    alert("휴대폰 번호를 올바르게 적어주시기 바랍니다.");
    return false;
}

/**
 * Date 객체를 문자열 형식(YYYY-MM-DD)으로 변환합니다.
 *
 * @param {Date} source - 변환할 Date 객체
 * @param {string} [delimiter='-'] - 구분자 (기본값: '-')
 * @returns {string} 변환된 날짜 문자열 (예: "2025-08-26")
 *
 * 사용 예시:
 * dateToStringFormat(new Date(2025, 7, 26));       // "2025-08-26"
 * dateToStringFormat(new Date(2025, 7, 26), '/'); // "2025/08/26"
 */
export function dateToStringFormat(source, delimiter = '-') {
    function leftPad(value) {
        return value >= 10 ? value : `0${value}`;
    }

    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());
    
    return [year, month, day].join(delimiter);
}

/**
 * 테이블 내에서 특정 셀을 클릭했을 때,
 * 같은 행(row)과 같은 열(column)의 모든 셀에 "on" 클래스를 추가하여
 * 십자가 모양으로 하이라이트 효과를 주는 함수
 *
 * @param {string} table - 테이블의 ID
 */
export function fnDataFocus(table) {
    const cells =  document.querySelectorAll(`#${table} > tr > td`);
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!cell.classList.contains("dataFocus")) return;

            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;

            cells.forEach(td => {
                // 초기화
                td.classList.remove("on");

                // 같은 행 또는 같은 열인 경우 색상 추가
                if (
                    td.classList.contains("dataFocus") &&
                    (td.cellIndex === col || td.parentElement.rowIndex === row)
                ) {
                    td.classList.add("on");
                }
            });
        });
    });
}

/**
 * 테이블의 좌측 컬럼 일부를 고정(sticky) 처리합니다.
 * (jQuery 기반의 tableColFix 함수를 바닐라 JS로 리팩토링한 버전)
 *
 * @param {string} tableId - 고정 처리할 테이블의 id
 * @param {number} fixColNum - 왼쪽에서부터 고정할 컬럼 개수
 * @returns {void}
 *
 * 사용 예시:
 * tableColFix("myTable", 2);
 * // => id="myTable" 테이블의 좌측 2개 컬럼을 sticky 처리
 */
export function tableColFix(tableId, fixColNum) {
    let leftOffsetBody = 0;

    const table = document.getElementById(tableId);
    if (!table) return;

    const heads = table.querySelectorAll('thead tr');
    const bodys = table.querySelectorAll('tbody tr');
    if(!bodys.length) return;

    let tr2 = bodys[0];  // 바디 첫 행(열 너비 측정용)

    let colspan = 0;
    let rowspan = 0;
    let leftOffsetHead = 0;
    let befRowspanCnt = 0;
    let befColspanCnt = 0;

    const arrRowspanYn = [];
    const arrColspanYn = [];
    const arrCellWidth = [];

    // 기본값 세팅
    for (let a = 0; a < fixColNum; a++) {
        arrRowspanYn[a] = [];
        arrColspanYn[a] = [];
        heads.forEach((_, b) => {
            arrRowspanYn[a][b] = 'N';
            arrColspanYn[a][b] = 'N';
        });

        // 바디 첫 tr의 a번째 셀 너비(= 고정 폭) 측정
        const td2 = tr2.querySelectorAll('td')[a];
        if (!td2) {
            arrCellWidth[a] = 0;
        } else {
            // jQuery의 innerWidth/outerWidth 평균치 유사 계산: clientWidth(패딩포함)와 offsetWidth(보더포함) 평균
            arrCellWidth[a] = (td2.clientWidth + td2.offsetWidth) / 2;
        }
    }

    // 헤더 고정
    heads.forEach((_, i) => {
        const tr = heads[i];
        for (let j = 0; j < fixColNum; j++) {
            leftOffsetHead = 0;
            befRowspanCnt = 0;
            befColspanCnt = 0;

            // 현재 행이 rowspan 진행중이면 스킵
            if (arrRowspanYn[j][i] !== 'N') continue;

            // 이전 열들에 대해 rowspan 누적 수 계산(시작점 제외)
            for (let m = j - 1; m >= 0; m--) {
                if (arrRowspanYn[m][i] === 'Y') {
                    if (i !== 0 && arrRowspanYn[m][i - 1] === 'Y') {
                    befRowspanCnt++;
                    }
                }   
            }

            // 이전 열들에 대해 colspan 누적 수 계산
            for (let m = j - 1; m >= 0; m--) {
                if (arrColspanYn[m][i] === 'Y') {
                    befColspanCnt++;
                }      
            }
            if (befColspanCnt !== 0) befColspanCnt--; // 자기 자신 제외

            const thIndex = j - befRowspanCnt - befColspanCnt;
            const th = tr.querySelectorAll('th')[thIndex];
            if (!th) continue;

            // colspan/rowspan 값
            colspan = parseInt(th.getAttribute('colspan') || '1', 10);
            rowspan = parseInt(th.getAttribute('rowspan') || '1', 10);

            // 왼쪽 고정 오프셋
            for (let w = 0; w < j; w++) leftOffsetHead += arrCellWidth[w];

            // 스타일 적용
            th.style.left = `${leftOffsetHead}px`;
            th.style.position = 'sticky';
            th.style.zIndex = '1';

            // rowspan 표시
            if (rowspan >= 2) {
                for (let k = i; k < i + rowspan && k < heads.length; k++) {
                    arrRowspanYn[j][k] = 'Y';
                }
            }

            // colspan 표시
            if (colspan >= 2) {
                for (let k = j; k < j + colspan && k < fixColNum; k++) {
                    arrColspanYn[k][i] = 'Y';
                }
                j += (colspan - 1); // 건너뛰기
            }
        }
    });

    // 바디 고정
    for (let i = 0; i < fixColNum; i++) {
        for (let j = 0; j < bodys.length; j++) {
            const td = bodys[j].querySelectorAll('td')[i];
        if (!td) continue;
            td.style.left = `${leftOffsetBody}px`;
            td.style.position = 'sticky';
            td.style.zIndex = '1';
        }

        const td2 = tr2.querySelectorAll('td')[i];
        if (td2) {
            leftOffsetBody += (td2.clientWidth + td2.offsetWidth) / 2;
        }
    }

    // 테이블 분리(스티키 셀 겹침 방지)
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
}

/**
 * 주어진 헤더 정보(thName, thWidth)에 따라
 * 동적으로 테이블 구조(colgroup, thead, tbody, tfoot)를 생성합니다.
 * (jQuery 기반 tableSet 함수를 바닐라 JS로 리팩토링한 버전)
 *
 * - tbId 값의 6번째 문자부터 잘라 gridID를 자동 생성합니다.
 *   예: 테이블 id="tablegrid1" → tbody id="grid1", tfoot id="footer1"
 * - thName: 2차원 배열 구조의 헤더 라벨
 * - thWidth: 각 열의 너비 배열 (모두 % 단위 또는 모두 px 단위여야 함)
 * - 동일한 라벨이 가로/세로로 연속될 경우 colspan/rowspan을 자동 계산하여 병합 처리합니다.
 *
 * @param {string} tbId - 테이블의 id (예: "tablegrid1")
 * @param {string[][]} thName - 2차원 배열 형태의 헤더 텍스트
 *                              (예: [ ["대분류1","대분류1","대분류2"], ["소1","소2","소3"] ])
 * @param {string[]} thWidth - 각 열의 너비 배열
 *                             (예: ["100","200","150"] 또는 ["10%","40%","50%"])
 * @returns {string} JSON 문자열
 *                   └ NAME: 병합 적용된 헤더 배열
 *                   └ COLSPAN: colspan 값 배열
 *                   └ ROWSPAN: rowspan 값 배열
 *
 * 사용 예시:
 * tableSet("tablegrid1",
 *          [["대분류A","대분류A","대분류B"],
 *           ["소A1","소A2","소B1"]],
 *          ["100","100","150"]);
 * 
 * // => id="tablegrid1"에 동적으로 colgroup/thead/tbody/tfoot 생성
 * //    tbody id="grid1", tfoot id="footer1"
 */
export function tableSet(tbId, thName, thWidth){
    const table = document.getElementById(tbId);
    if(!table) return;

    const thNameLen = thName.length;
    const thWidthLen = thWidth.length;

    //변수 길이 체크
    for (let i = 0; i < thName.length; i++) {
        if (thWidth.length !== thName[i].length) {
            alert("테이블 생성 변수 길이가 다릅니다.");
            return;
        }
    }

    //%가 들어있는지 체크
    let perCnt = 0; //너비 퍼센트 갯수
    let perTotal = 0; //너비 100퍼센트 체크
    let isPercentWidth; //퍼센트 여부

    for (const w of thWidth) {
        if (String(w).includes('%')) {
            perCnt++;
            perTotal += Number(String(w).replace('%', ''));
        }
    }

    if (thWidthLen == perCnt) {  //전부 %인 경우
        isPercentWidth = true;
        if (perTotal !== 100) {
            if(perTotal === 0) alert("너비를 입력해주세요.");
            else alert("입력하신 너비의 합계가 100%가 아닙니다.");
            return;
        }
    } else if (perCnt === 0){ //전부 px인 경우
        isPercentWidth = false;
    } else { //혹은 %가 몇개만있는 경우
        alert("입력하신 너비의 단위가 혼재되어있습니다.('%' 혹은 숫자로만 입력)");
        return;
    }

    // 기존 내용 제거(중복 생성 방지
    while (table.firstChild) table.removeChild(table.firstChild);

    //선언부
    const gridID = tbId.substr(5); 
    const footerId = `footer${gridID.substr(4)}`; 
    
    //colgroup영역
    let totalWidth = 0; //테이블 width
    let colgroup = document.createElement('colgroup'); //테이블 데이터 : colgroup영역

    thWidth.forEach(el => {
        const col = document.createElement('col');
        if (isPercentWidth) {
            col.style.width = nvl(el);
        } else {
            col.style.width = `${nvl(el)}px`;
            totalWidth += Number(el);
        }
        colgroup.append(col);
    });
    table.append(colgroup);

    //colspan arr데이터 생성
    let arrColspanNum = []; //콜스판 배열
    const names = thName.map(row => row.slice()); // 헤더 텍스트(변형 버전)

    for (let i = 0; i < names.length; i++) {
        const row = names[i];
        const collapsed = [];
        const colspans  = [];
        for (let j = 0; j < row.length; ) {
            let cnt = 1;
            while (j + cnt < row.length && row[j] === row[j + cnt]) cnt++;
            collapsed.push(row[j]);
            colspans.push(cnt);
            j += cnt;
        }
        names[i] = collapsed;
        arrColspanNum.push(colspans);
    }

    //rowspan arr데이터 생성
    let arrRowspanNum = arrColspanNum.map(row => row.map(() => 1)); //로우스판 배열은 콜스판 배열을 깊은복사해서 사용

    // 행 i의 j번째 셀의 start slot 구하기
    const startSlot = (rowIdx, colIdx) => {
        return arrColspanNum[rowIdx].slice(0, colIdx).reduce((a, b) => a + b, 0);
    }

    // 다음 행에서 특정 start slot을 가진 셀의 인덱스 찾기
    const findIdxByStartSlot = (rowIdx, slot) => {
        let acc = 0;
        for (let m = 0; m < arrColspanNum[rowIdx].length; m++) {
            const start = acc;
            const end   = acc + arrColspanNum[rowIdx][m];
            if (start === slot) return m;
            acc = end;
        }
        return -1;
    };
    
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < names[i].length; j++) {
            if (arrRowspanNum[i][j] === 0) continue;  // 이미 윗행에 흡수됨
            const label = names[i][j];
            const slot  = startSlot(i, j);
            let span    = 1;

            for (let r = i + 1; r < names.length; r++) {
                const nextIdx = findIdxByStartSlot(r, slot);
                if (nextIdx === -1) break;
                if (arrRowspanNum[r][nextIdx] === 0) break;
                if (names[r][nextIdx] === label) {
                    span++;
                    arrRowspanNum[r][nextIdx] = 0; // 아래 셀은 흡수
                } else {
                    break;
                }
            }
            arrRowspanNum[i][j] = span;
        }
    }

    //thead영역
    const thead = document.createElement('thead'); 
    names.forEach((el, i) => {
        const tr = document.createElement('tr');
        el.forEach((el2, j) => {
            if (arrRowspanNum[i][j] !== 0) {
                const th = document.createElement('th');
                th.colSpan = arrColspanNum[i][j];
                th.rowSpan = arrRowspanNum[i][j];
                th.textContent = nvl(el2);
                tr.append(th);
            }
        });
        thead.append(tr);
    });
    table.append(thead);

    // tbody, tfoot 생성
    const tbody = document.createElement('tbody');
    tbody.id = gridID;
    table.append(tbody);

    const tfoot = document.createElement('tfoot');
    tfoot.id = footerId;
    table.append(tfoot);

    // 테이블 width 적용
    table.style.width = isPercentWidth ? '100%' : `${totalWidth}px`;

    // 결과(JSON 문자열) 반환
    const objs = [];
    const obj = {};

    obj.NAME = JSON.stringify(names);
    obj.COLSPAN = JSON.stringify(arrColspanNum);
    obj.ROWSPAN = JSON.stringify(arrRowspanNum);
    objs.push(obj);

    return JSON.stringify(objs);
}