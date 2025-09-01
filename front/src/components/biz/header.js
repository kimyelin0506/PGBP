import "../../assets/style/common_in.css";
import logoUrl from "../../img/tlogo.png";

export function renderBizTopMenuHeader(user) {
    return `
    <header class="header">
        <div class="logomenu">
            <div class="system_title">
                <div class="system_logo">
                    <img src="${logoUrl}" alt="상단 로고">
                    <span>중소기업 온실가스 인벤토리 구축지원사업</span>
                </div>
            </div>

            <div class="mastermenu">
                <ul class="mastermenu_list" id="topMenu">
                </ul>

                <div class="user_wrap">
                    <ul class="user_list">
                        <li class="welcome">
                            <span id="userNm">${user.USER_NM}</span>
                        </li>
                        <li class="timer">
                            <span id="counter">0:20:00</span><span>후 로그아웃</span>
                            <a href="#" class="timer_button"><b>연장</b></a>
                        </li>
                        <li>
                            <a href="#" class="password_button" title="비밀번호 변경"><i class="blind">비밀번호변경</i></a>
                        </li>
                        <li id="sysMenu">
                            <a href="#" class="setting_button" title="시스템 관리">
                                <i class="blind">환경설정</i>
                            </a>
                        </li>

                        <li>
                            <a href="#" class="logout_button" title="로그아웃"><i class="blind">로그아웃</i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>`;
}

export function renderBizLeftMenuHeader() {
    return `
    <div class="menu_zone">
        <div class="inner">
            <!-- <p class="high_rank_menu_title">대메뉴</p> -->
            <ul class="depth1_list" id="menu">

            </ul>

            <div class="fold_wrap">
                <a href="#" class="fold_button on" onclick="$(this).toggleClass('on'); $('#idbody').toggleClass('close');"></a>
            </div>
        </div>
    </div>`;
}