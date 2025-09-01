import "../../../assets/biz/02/02_01_020.css";

export function render02_01_020(userId, userRole, regi_dd) {
    return `
    <form id="notice-insert-data">
        <input type="hidden" id="NOTICE-NO" name="NO" value="">
        <div class="notice-input-div">
                <label>
                    <span>ID : </span>
  <input id="NOTICE-ID"   name="ID"        type="text" value="${userId}"   readonly class="notice-input">
                </label>
                </div>
                <div class="notice-input-div">
                <label>
                    <span>ROLE : </span>
  <input id="NOTICE-ROLE" name="ROLE"      type="text" value="${userRole}" readonly class="notice-input">
                </label>
                </div>
                <div class="notice-input-div">
                <label>
                    <span>DEL_YN : </span>
  <input id="NOTICE-DEL-YN" name="DEL_YN"  type="text" value="N"           readonly class="notice-input">
                </label>
                </div>
                <div class="notice-input-div">
                <label>
                    <span>REGI_DD : </span>
                      <input id="NOTICE-REGI-DD" name="REGI_DD" type="text" value="${regi_dd}" readonly class="notice-input">

                </label>
                </div>
                <div class="notice-input-div">
                <label>
                    <span>EXP_DD : </span>
                      <input id="NOTICE-EXP-DD"  name="EXP_DD"  type="datetime-local">

                </label>
                </div>
                <div class="notice-input-div">
                <label>
                    <span>NICK_NAME : </span>
                      <input id="NOTICE-NICK-NAME" name="NICK_NAME" type="text" class="notice-input">

                </label>
                <label>
                    <span></span>
                    <div class="notice-input">
                    (본인 이전 사용 제외)
                    <button type="button" id="btnCheckNickNameDupl">닉네임 중복 확인</button>
                    <button type="button" id="btnChangeNickName">닉네임 변경</button>
                    </div>
                </label>
                </div>
                <div class="notice-input-div">
                <label>
                <span>공지사항 카테고리</span>
  <select id="NOTICE-CATEGORY" name="CATEGORY" class="notice-input">
                    <option value="">-- 선택 --</option>
                    <option value="일반 공지">일반 공지</option>
                    <option value="전체 공지">전체 공지</option>
                    <option value="필수 공지">필수 공지</option>
                    <option value="기타">기타</option>
                </select>
                </label>
            </div>
                <div class="notice-input-div">
                <label>
                <span>SHORT_NO(0: 가장 중요)</span>
             <select id="NOTICE-SHORT-NO" name="SHORT_NO" class="notice-input"> 
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                </label>
            </div>
                <div class="notice-input-div">
                <label>
                    <span>FILE</span>
                   <input type="file" id="NOTICE-FILE" name="FILE">
                </label>
                </div>
                <div class="notice-input-div">
                <label>
                <span>TITLE</span>
                <input  type="text"     id="NOTICE-TITLE"    name="TITLE">
                </label>
            </div>
                <div class="notice-input-div">
                <label>
                <span>CONTENTS</span>
                 <textarea               id="NOTICE-CONTENTS" name="CONTENTS"></textarea>
                </label>
            </div>
                <div class="notice-input-div">
                <button type="button" class="notice-input-btn">미리 보기</button>
                <button type="button" id="noticeSubmitBtn">등록하기</button>
            </div>
             <input type="hidden" id="NOTICE-MODF-DD" name="MODF_DD" value="">
    </form>`;
    // return `
    // // <form id="notice-insert-data">
    // //     <input type="hidden" id="NOTICE-NO" name="NO" value="">
    // //     <div class="notice-input-div">
    // //             <label>
    // //                 <span>ID : </span>
    // //                 <input id="NOTICE-ID" type="text" value="${userId}" readonly class="notice-input">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>ROLE : </span>
    // //                 <input id="NOTICE-ROLE" type="text" value="${userRole}" readonly class="notice-input">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>DEL_YN : </span>
    // //                 <input id="NOTICE-DEL-YN" type="text" value="N" readonly class="notice-input">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>REGI_DD : </span>
    // //                 <input id="NOTICE-REGI-DD" type="text"
    // //                     value="${regi_dd}"
    // //                     readonly class="notice-input">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>EXP_DD : </span>
    // //                 <input id="NOTICE-EXP-DD" type="datetime-local">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>NICK_NAME : </span>
    // //                 <input id="NOTICE-NICK-NAME" type="text" class="notice-input">
    // //             </label>
    // //             <label>
    // //                 <span></span>
    // //                 <div class="notice-input">
    // //                 (본인 이전 사용 제외)
    // //                 <button type="button" id="btnCheckNickNameDupl">닉네임 중복 확인</button>
    // //                 <button type="button" id="btnChangeNickName">닉네임 변경</button>
    // //                 </div>
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //             <span>공지사항 카테고리</span>
    // //             <select id="NOTICE-CATEGORY" class="notice-input">
    // //                 <option value="">-- 선택 --</option>
    // //                 <option value="일반 공지">일반 공지</option>
    // //                 <option value="전체 공지">전체 공지</option>
    // //                 <option value="필수 공지">필수 공지</option>
    // //                 <option value="기타">기타</option>
    // //             </select>
    // //             </label>
    // //         </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //             <span>SHORT_NO(0: 가장 중요)</span>
    // //             <select id="NOTICE-SHORT-NO" class="notice-input">
    // //                 <option value="0">0</option>
    // //                 <option value="1">1</option>
    // //                 <option value="2">2</option>
    // //             </select>
    // //             </label>
    // //         </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //                 <span>FILE</span>
    // //                 <input type="file" id="NOTICE-FILE" name="FILE">
    // //             </label>
    // //             </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //             <span>TITLE</span>
    // //             <input type="text" id="NOTICE-TITLE">
    // //             </label>
    // //         </div>
    // //             <div class="notice-input-div">
    // //             <label>
    // //             <span>CONTENTS</span>
    // //             <textarea id="NOTICE-CONTENTS"></textarea>
    // //             </label>
    // //         </div>
    // //             <div class="notice-input-div">
    // //             <button type="button" class="notice-input-btn">미리 보기</button>
    // //             <button type="button" id="noticeSubmitBtn">등록하기</button>
    // //         </div>
    // //         <input type="hidden" id="NOTICE-MODF-DD" value="">
    // // </form>`;
}