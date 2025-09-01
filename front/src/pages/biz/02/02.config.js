import { userStore } from "../../../lib/user";

// DB에서 파라미터로 조회되는 상수들을 모아서 관리
export const DBParamPKG = {
    KYL_P_PKG: "TEST_KYL"
}
export const DBParamSP = {
    SELECT_LIST_NOTICE: "SP_TEST_02_01_010_L",
    SELECT_NICKNAME_DUPLI: "SP_TEST_02_01_020_S",
    INSERT_NOTICE: "SP_TEST_02_01_020_M",
    SELECT_ONE_NOTICE: "SP_TEST_02_01_010_S",
    UPDATE_DEL_YN: "SP_TEST_02_01_020_DEL_U",
    SELECT_ONE_NOTICE_CONTENTS: "SP_TEST_02_01_010_CONTENTS_S",
    UPDATE_NOTICE: "SP_TEST_02_01_020_U",
}

// API 상수로 모아서 관리
export const API = {
    PREFIX: "/biz/02",  // prefix
    NOTICE_LIST: "/02_01_010.do",  // 목록 조회
    NOTICE_REGI: "/02_01_020.do",  // 등록
    NOTICE_MODF: "",  // 수정
    NOTICE_DEL: ""  // 삭제
}

// 공지사항 객체 정의/초기화
export let notice = {
    P_PKG: DBParamPKG.KYL_P_PKG,
    P_SP: DBParamSP.SELECT_LIST_NOTICE,
    NO: null,
    CATEGORY: null,   // 카테고리 별 조회시 사용
    ORD_COL: null,    // 정렬 기준 컬럼
    ORD: null,         // 정렬 방향
    USER_ID: userStore.getUser()?.USER_ID,
    DEL_YN: null,
    FILE_NO: null,
    PAGE_SIZE: 10,  // 현재 화면에서 보여주는 데이터 개수
    PAGE_IDX: 1,  // 현재 페이징 UI 번호
    PAGE_COUNT: 5,  // 페이징 UI 보여줄 개수 정의
}

// 입력 객체 생성
export let NOTICE_INSERT = {
    P_PKG: DBParamPKG.KYL_P_PKG,
    P_SP: DBParamSP.INSERT_NOTICE,
    NO: null,
    USER_ID: userStore.getUser()?.USER_ID,
    NICK_NAME: null,
    TITLE: null,
    REGI_DD: null,
    MODF_DD: null,
    CATEGORY: null,
    DEL_YN: "N",
    SHORT_NO: null,
    CONTENTS: null,
    EXP_DD: null,
}

 // 현재 화면에서 보여줄 테이블 정보의 속성 이름
export const arrName = [
    ['NO', 'ID', 'NICK_NAME', 'ROLE', 'TITLE', 'REGI_DD', 'MODF_DD', 'EXP_DD', 'CATEGORY', 'DEL_YN','SHORT_NO', 'IP', 'FILE_NO','수정하기', '삭제하기', '상세 페이지']
];
export const arrWidth =	['70', '100','100','100','200','100','100', '100', '100', '100', '80', '100', '100','120', '120', '120'];
export let tableHeadInfo;