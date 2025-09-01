

export function render99_01_010Container_Inner2() {
    return `
    <form id="formSearch" method="post" action="">
        <div class="section">
            <div class="search_wrap">
                <div class="search_left">
                    <table class="table_style3">
                        <colgroup>
                            <col style="width: 12%">
                            <col style="width: 15%">
                            <col style="width: 12%">
                            <col style="width: 15%">
                            <col style="width: 46%">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td><span class="serch_option">사번</span></td>
                                <td><input type="text" id="P_USERID" name="P_USERID" data-param></td>
                                <td><span class="serch_option">이름</span></td>
                                <td><input type="text" id="P_USERNAME" name="P_USERNAME" data-param></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="search_right">
                    <a href="#" class="btn bg_color3" onclick="fn_Search()">검색</a>
                    <a href="#" class="btn bg_color2" onclick="excelDown()">엑셀</a>
                </div>
            </div>
            <div class="info_wrap">
                <ul class="info_list2">
                    <li><span style="color: blue; font-weight: bold;">[공단 사용자]</span> 목록을 표시합니다.</li>
                    <li><span style="color: blue; font-weight: bold;">[공단 사용자ID]</span>를 클릭하면 조사업체 사용자 정보를 수정할 수 있는 화면이 표시됩니다.</li>
                </ul>
            </div>
            <div class="dual_wrap">
                <div class="left">
                    <div class="title_left medium">공단 사용자 목록</div>
                </div>
            </div>
            <div class="table_scroll">
                <table class="table_style1" id="tablegrid1"></table>
            </div>
            <section id="divPaging"></section>
        </div>
    </form>`
}