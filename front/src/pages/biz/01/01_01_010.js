export function render01_01_010_containerInner2() {
    return `<form id="formSearch" method="post" action="">
            <input type="hidden" id="P_VIEW_ID" name="P_VIEW_ID" value="">

            <div class="container_inner">
                <div class="container_inner2">
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
                                        <td><span class="serch_option">대상년도</span></td>
                                        <td><select class="tyt03st" id="P_ACHI_YEAR" name="P_ACHI_YEAR" ></select></td>
                                        <td><span class="serch_option">업체코드</span></td>
                                        <td><input type="text" id="P_ENTE_CODE" name="P_ENTE_CODE" maxlength="13"></td>
                                    </tr>
                                    <tr>
                                        <td><span class="serch_option">신청서 상태</span></td>
                                        <td><select class="tyt03st" id="P_MOVN_STAT" name="P_MOVN_STAT" ></select></td>
                                        <td><span class="serch_option">업체명</span></td>
                                        <td><input type="text" id="P_ENTE_TITE" name="P_ENTE_TITE" maxlength="50"></td>
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
                                <li>사업장 입력내용을 검색합니다.</li>
                                <li>대상년도를 클릭하시면 신청내용을 확인할 수 있습니다.</li>
                            </ul>
                        </div>

                        <div class="dual_wrap">
                            <div class="left">
                                <div class="title_left medium">배출량확인서 전체목록</div>
                            </div>
                        </div>

                        <div class="table_scroll">
                            <table class="table_style1" id="tablegrid1">
                            </table>
                        </div>
                        <section id="divPaging"></section>
                    </div>
                </div>
            </div>
        </form>`;
}
