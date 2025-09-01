import "../../../assets/biz/02/02_01_010.css";

export function render02_01_010_containerInner1() {
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
            <button type="button" id="notice-filtering">필터링하기</button>
        </div>`;
}

export function render02_01_010_containerInner2() {
    return `
    <div class="table_scroll">
        <table class="table_style1" id="tablegrid2"></table>
    </div>
        <section id="divPaging"></section>`;
}

export function render01_01_010_hiddenForm() {
    return `
    <form id="modfForm" method="post" action="/biz/02/02_01_020_2.do">
        <input type="hidden" name="NO" id="modfNo">
        <input type="hidden" name="P_PKG" id="pkg">
        <input type="hidden" name="P_SP" id="sp">
    </form>`;
}