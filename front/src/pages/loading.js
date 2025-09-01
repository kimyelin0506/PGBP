import loading2URL from "../img/loading2.gif";

export function renderLoading() {
    return `
    <div id="myModal3" class="modalcss">
        <div class="modal-contentcss">
            <img src='${loading2URL}' style="float:left;" alt="로딩중입니다">
        </div>
    </div>`;
}