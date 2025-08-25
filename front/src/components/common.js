//테이블 내부 자동 생성 함수
//tbId 값의 6번째부터는 그리드 ID로 자동 설정됨 -> ex)테이블(table)ID:tablegrid1, 그리드영역(tbody)ID:grid1
//param info : 테이블ID, th항목명칭, th항목너비
export function tableSet(tbId, thName, thWidth){

    //변수 길이 체크
    for(let i=0; i<thName.length; i++){
        if(thWidth.length != thName[i].length){
            alert("테이블 생성 변수 길이가 다릅니다.");
            return;
        }
    }

    //%가 들어있는지 체크
    let per_cnt = 0; //너비 퍼센트 갯수
    let per_width_chk = 0; //너비 100퍼센트 체크
    let per_yn; //퍼센트 여부
    for(let i=0; i<thWidth.length; i++){ //퍼센트 확인
        if(thWidth[i].includes('%')){
            per_cnt += 1;
            per_width_chk += Number(thWidth[i].replace('%',''));
        }
    }
    if(thWidth.length == per_cnt){ //전부%인경우
        per_yn = 'Y';
        if(per_width_chk != 100){
            if(per_width_chk == 0){
                alert("너비를 입력해주세요.");
            }else{
                alert("입력하신 너비의 합계가 100%가 아닙니다.");
            }
            return;
        }
    } else {
        if(per_cnt == 0){ //전부 px인 경우
            per_yn = 'N';
        }else{ //혹은 %가 몇개만있는 경우
            alert("입력하신 너비의 단위가 혼재되어있습니다.('%' 혹은 숫자로만 입력)");
            return;
        }
    }

    //선언부
    let gridID = tbId.substr(5); //그리드ID는 tbName변수 앞5자리 자른 값으로 자동생성 -> ex)테이블(table)ID:tablegrid1, 그리드영역(tbody)ID:grid1
    let footerId = "footer"+gridID.substr(4); //푸터ID는 "footer" + 그리드 숫자
    let totalWidth = 0; //테이블 width
    let tableData = ''; //테이블 데이터 : colgroup영역
    let tableData2 = ''; //테이블 데이터 : thead 영역 (colgroup을 먼저 그린 후, thead를 그려야 width가 알맞게 들어감)

    //colgroup영역
    tableData = '<colgroup>';
    for(let i=0; i<thWidth.length; i++){
        if(per_yn == 'Y'){
            tableData += '<col style="width: ' + nvl(thWidth[i]) + '">';
            totalWidth = '100%';
        } else {
            tableData += '<col style="width: ' + nvl(thWidth[i]) + 'px">';
            totalWidth += Number(thWidth[i]);
        }
    }
    tableData += '</colgroup>'

    //colspan arr데이터 생성
    let thColspanNum; //콜스판 number
    let arrColspanNum = []; //콜스판 배열
    let arrTmpColspanNum = []; //콜스판 임시배열

    for(let i=0; i<thName.length; i++){
        arrTmpColspanNum = []; //초기화
        for (let j=0; j<thName[i].length; j++) {
            thColspanNum = 1; //초기화
            for(let k = j; k<thName[i].length; k++){ //같은값이 어디까지 있는지 for문돌면서 체크
                if(thName[i][j] == thName[i][j+1]){ //현재셀과 다음셀 값이 같으면(같은 값이면 배열 내 값을 삭제하므로 k가 아닌 j로 비교함)
                    thColspanNum++; //colspan 카운트 증가
                    thName[i].splice(j,1); //배열 내 같은 값 삭제
                    k--; //배열값 삭제되서 for문 도는 변수 감소
                }
                else{
                    k = thName[i].length;
                }
            }
            arrTmpColspanNum.push(thColspanNum); //콜스판 임시배열에 값 넣기
        }
        arrColspanNum.push(arrTmpColspanNum); //콜스판 배열 값 넣기
    }

    //rowspan arr데이터 생성
    let trRowspanNum; //로우스판 number
    let arrRowspanNum = JSON.parse(JSON.stringify(arrColspanNum)); //로우스판 배열은 콜스판 배열을 깊은복사해서 사용
    let colspanNum; //로우값 비교할때 콜스판 한 만큼 건너뛰기 위한 변수(현재 값)
    let colspanNum2; //로우값 비교할때 콜스판 한 만큼 건너뛰기 위한 변수(다음 로우 값)
    let colspanNum3; //로우값 비교 결과값

    for(let i=0; i<thName.length; i++){
        for (let j=0; j<thName[i].length; j++) {
            trRowspanNum = 1; //초기화
            for(let k=i; k<thName.length-1; k++){ //현재셀과 아래셀 비교는 최대 로우 -1까지만 수행
                colspanNum = 0; //초기화
                colspanNum2 = 0; //초기화
                colspanNum3 = 0; //초기화
                if(j != 0){ //0 이후부터 colspan 정보 가져옴
                    for(let l=0; l<j; l++){
                        colspanNum += arrColspanNum[i][l]; //비교하는 로우의 콜스판 값
                    }
                    for(let m=0; m<thName[k+1].length; m++){
                        colspanNum2 += arrColspanNum[k+1][m]; //비교당할 로우의 콜스판 값
                        if(colspanNum == colspanNum2){ //비교하는 로우의 콜스판 정보와 비교당할 로우의 콜스판 값이 같으면
                            colspanNum3 = m+1; //현재배열위치 + 1이 비교당할 로우의 위치 값
                            m = thName[k+1].length; //m값 최대로 증가시켜서 for문 빠져나감
                        }
                    }
                }
                if(thName[i][j] == thName[k+1][colspanNum3] && arrRowspanNum[i][j] != 0){ //현재셀과 아래셀 값이 같으면서 rowspan배열의 값이 0이 아니면
                    trRowspanNum++; //rowspan 카운트 증가
                    arrRowspanNum[k+1][colspanNum3] = 0; //배열 내 같은 값 0으로 입력(0인것은 이미 rowspan에 해당된 데이터라 체크 안함)
                }
                else{ //다르면
                    k = thName.length; //k값 최대로 증가시켜서 for문 빠져나감
                }
            }
            if(arrRowspanNum[i][j] != 0){ //0이 아닌경우만(0이면 이미 로우스판 영역에 속하는 데이터)
                arrRowspanNum[i][j] = trRowspanNum; //로우스판 값 입력
            }
        }
    }

    //thead영역
    tableData2 = '<thead><tr>';
    for(let i=0; i<thName.length; i++){
        for (let j=0; j<thName[i].length; j++) {
            if(arrRowspanNum[i][j] != 0){ //헤더 그릴때 rowspan 배열을 확인해서 0이면 안그림
                tableData2 += `<th colspan="${arrColspanNum[i][j]}" rowspan="${arrRowspanNum[i][j]}">${nvl(thName[i][j])}</th>`;
            }
        }
        tableData2 += '</tr>';
    }
    tableData2 += `</thead><tbody id="${gridID}"></tbody><tfoot id ="${footerId}"></tfoot>`;

    //테이블 생성
    $('#' + tbId).append(tableData);
    $('#' + tbId).append(tableData2);
    $('#' + tbId).css('width', totalWidth);

    //테이블 헤더값 리턴
    let objNAME = Object.assign({}, thName);
    let objCOLSPAN = Object.assign({}, arrColspanNum);
    let objROWSPAN = Object.assign({}, arrRowspanNum);

    let objs = new Array();
    let obj = new Object();
    obj.NAME = JSON.stringify(thName);
    obj.COLSPAN = JSON.stringify(arrColspanNum);
    obj.ROWSPAN = JSON.stringify(arrRowspanNum);
    objs.push(obj);
    return JSON.stringify(objs);
}