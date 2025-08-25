import '../../assets/style/applications.css';

export function renderApplication() {
    return `
            <div class="application-input-div">
              <label>
                <span>ID : </span>
                <input id="NOTICE-ID" type="text" value="" readonly class="application-input">
              </label>
            </div>
            <div class="application-input-div">
              <label>
                <span>ROLE : </span>
                <input id="NOTICE-ROLE" type="text" value="" readonly class="application-input">
              </label>
            </div>
            <div class="application-input-div">
              <label>
                <span>DEL_YN : </span>
                <input id="NOTICE-DEL-YN" type="text" value="N" readonly class="application-input">
              </label>
            </div>
            <div class="application-input-div">
              <label>
                <span>REGI_DD : </span>
                <input id="NOTICE-REGI-DD" type="text"
                       value=""
                       readonly class="application-input">
              </label>
            </div>
            <div class="application-input-div">
              <label>
                <span>EXP_DD : </span>
                <input id="NOTICE-EXP-DD" type="datetime-local">
              </label>
            </div>
            <div class="application-input-div">
              <label>
                <span>NICK_NAME : </span>
                <input id="NOTICE-NICK-NAME" type="text" class="application-input">
              </label>
              <label>
                <span></span>
                <div class="application-input">
                  (본인 이전 사용 제외)
                  <button type="button" onclick="checkNickNameDupli()">닉네임 중복 확인</button>
                  <button type="button" onclick="changeNickName()">닉네임 변경</button>
                </div>
              </label>
            </div>
            <div class="application-input-div">
            <label>
              <span>공지사항 카테고리</span>
              <select id="NOTICE-CATEGORY" class="application-input">
                <option value="">-- 선택 --</option>
                <option value="일반 공지">일반 공지</option>
                <option value="전체 공지">전체 공지</option>
                <option value="필수 공지">필수 공지</option>
                <option value="기타">기타</option>
              </select>
            </label>
          </div>
            <div class="application-input-div">
            <label>
              <span>SHORT_NO(0: 가장 중요)</span>
              <select id="NOTICE-SHORT-NO" class="application-input">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
          </div>
          <div class="application-input-div">
              <label for="NOTICE-FILE"><span>FILE</span></label>
              <!-- 실제 파일 입력은 화면에서 숨겨두고 -->
              <input type="file" id="NOTICE-FILE" class="sr-only" multiple>
              <!-- 드래그&드롭 영역 -->
              <div id="application-dropzone" class="dropzone" tabindex="0" aria-label="여기에 파일을 끌어다 놓거나 클릭하여 선택">
                여기에 파일을 드래그하거나 클릭해 선택
              </div>
              <!-- 선택/드롭된 파일 목록 표시 -->
              <ul id="application-file-list" class="file-list"></ul>
            </div>
            <div class="application-input-div">
            <label>
              <span>TITLE</span>
              <input type="text" id="NOTICE-TITLE">
            </label>
          </div>
            <div class="application-input-div">
            <label>
              <span>CONTENTS</span>
              <textarea id="NOTICE-CONTENTS"></textarea>
            </label>
          </div>
            <div class="application-input-div">
              <button type="button" onclick="openNoticePreview()" class="application-input-btn">미리 보기</button>
              <button type="button" id="applicationSubmitBtn">등록하기</button>
          </div>
    `;
}