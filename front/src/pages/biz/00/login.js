import ntoplogow3URL from "../../../img/ntoplogow3.png";

export function renderLogin() {
    return `
    <form id="loginForm" name="loginForm" method="POST" action=""  style="height:100%;">
			<div class="login_wrap">
				<div class="login_in_header">
					<img src='${ntoplogow3URL}' alt="한국에너지공단 로고" class="login_in_logo">
					<span class="login_in_title">중소기업 온실가스 인벤토리 구축지원사업</span>
				</div>

				<div class="login_in_form">
					<p class="login_in_form_title">관리자 로그인</p>

					<div class="login_in_form_contents">
						<label style="display:none" for="P_LOGIN_ID">아이디</label>
						<input id="P_LOGIN_ID" 	name="P_LOGIN_ID"	type="text" 	class="login_in_id" autocomplete="off" 	placeholder="아이디를 입력하세요"	aria-label="아이디">
						<label style="display:none" for="P_PWD">비밀번호</label>
						<input id="P_PWD" 	  	name="P_PWD"		type="password" class="login_in_pw" autocomplete="off" 	placeholder="비밀번호를 입력하세요"	aria-label="비밀번호">
						<button type="button" class="login_in_button" id="login_in_button">로그인</button>
					</div>
				</div>
			</div>
		</form>
    `;
}

