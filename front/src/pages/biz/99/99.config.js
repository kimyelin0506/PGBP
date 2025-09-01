//페이지 조회건수 셋팅
export let pageSize = 10;

//DB조회 파라메터 셋팅
export let pData = new Object();
pData['P_PKG'] = 'BIZ_99';
pData['P_SP'] = 'SP_BIZ_99_01_010_L';
pData["COLUMN"] = '';
pData["ORD"] = 'DESC';

//테이블 요소 셋팅
/*
-사용방법 	
    -> arrName은 2차원 배열, 나머지 항목은 1차원 배열로 값을 넣어줘야 함
    -> 헤더 여러 로우를 그리는 경우 때문이고, 헤더가 1개여도 2차원배열로 넣어줘야 함	
    -> 셀 colspan과 rowspan은 행/열별 값이 같은 경우 자동 병합 됨
*/
export let arrName =	[
                    ['사번','이름','이메일','부서명','권한','등록일시','등록자','비고']
                ];
export let arrRef =	['USERID','USERNAME','USEREMAIL','DEPT_NAME','USER_ROLE_NM','REGI_MAN','REGI_DD','REMARK'];
export let arrWidth =	['100','150','200','200','100','150','150','300'];
export let arrType =	['','','','','','','',''];
export let tableHeadInfo;