import '../../assets/style/approvals.css';
import { tableSet } from '../../components/common.js';

export function renderApprovals() {
      // 현재 화면에서 보여줄 테이블 정보의 속성 이름
    const arrName = [
        ['NO', 'ID', 'NICK_NAME', 'ROLE', 'TITLE', 'REGI_DD', 'MODF_DD', 'EXP_DD', 'CATEGORY', 'DEL_YN','SHORT_NO', 'IP', 'FILE_NO','수정하기', '삭제하기', '상세 페이지']
    ];
    const arrWidth =	['70', '100','100','100','200','100','100', '100', '100', '100', '80', '100', '100','120', '120', '120'];
    let tableHeadInfo;

     // 브라우저 렌더링 시 보여줄 기본 정보
    $(function() {
        // top 메뉴 정보 받아오기
        // topMenuSet('02_01_010');

        // 기존 존재하는 메서드 이용 : 테이블 속성 그리기
        noticeTableSet();

        // 저장되어 있는 게시글 불러오기(10건씩)
        getNoticeList(notice.PAGE_IDX, notice);
    })

    // 공지사항 필터링 옵션 + 테이블 영역 그리기
    let container_inner = document.getElementById('container_inner');
    let container_inner2 = document.getElementById('container_inner2');
    let container_inner_contents = '';
    let container_inner2_contents = '';
    return ``;
}

// 테이블 속성 그리기
function noticeTableSet() {
    // 기존 존재하는 메서드 이용 : 테이블 속성 그리기
    tableHeadInfo = tableSet("tablegrid2", arrName, arrWidth);
}

// 공지사항 리스트 불러오기
// 매개변수: notice 객체, 이동하려는 페이지 번호
function getNoticeList(pageIdx, n = notice) {
    // pageNo가 default값인 1이 아닌 경우 => 페이징 UI를 통해 이동 => notice 객체(n)에 변경된 PAGE_NO 적용
    if(pageIdx !== notice.PAGE_IDX) n.PAGE_IDX = pageIdx;

    // 데이터 세팅 확인하기
    console.log(JSON.stringify(n));

    $.ajax({
        type: "POST",
        url:  "",// '<c:url value='/common/SP_L.do'/>',
        data: n,   // 객체를 JSON 문자열로 변환
        dataType: "json", // JSON으로 보냄
        success: function (res) {
            console.log(res);
            // 테이블 안의 데이터 그리기
            drawNoticeListTable(res.list, n, res.rtnVal);
        },
        error: function (request,status,error) {
            $.alert("javaScript error : "+ error + "request :" + request + "status : " + status);
        }
    });
}

// container_inner 영역에 테이블 데이터 그리기
export function drawApprovalsFilterList() {
    return `
                    <div class="notice-options">
                    <label for="notice-category">
                        공지사항 카테고리
                    </label>
                    <select id="notice-category">
                        <option value="">-- 선택 --</option>
                        <option value="일반 공지">일반 공지</option>
                        <option value="전체 공지">전체 공지</option>
                        <option value="필수 공지">필수 공지</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div class="notice-options">
                    <label for="notice-ord-col">
                        정렬 컬럼
                    </label>
                    <select id="notice-ord-col">
                        <option value="">-- 선택 --</option>
                        <option value="NO">작성 일자</option>
                        <option value="MODF_DD">수정 일자</option>
                        <option value="SHORT_NO">중요 우선 순위</option>
                    </select>
                </div>
                <div class="notice-options">
                    <label for="notice-ord">
                        정렬 순서
                    </label>
                    <select id="notice-ord">
                        <option value="">-- 기본(내림차순) --</option>
                        <option value="ASC">오름 차순</option>
                    </select>
                </div>
                <div class="notice-options">
                    <label>
                        제목/본문 검색:
                        <input type="text" id="notice-search-txt">
                    </label>
                </div>
                <div class="notice-options">
                    <button type="button" onclick="filterNotice()">필터링하기</button>
                </div>
    `;
}

export function drawApprovalsTable() {
    return `
                <div class="table_scroll">
                    <table class="table_style1" id="tablegrid2"></table>
                </div>
                    <section id="divPaging"></section>
    `;
}