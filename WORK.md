### [2026-09-28 15:58] 교육연수동 간편 서류 제출 시스템 초기 구축

- **작업 목적:** 교육연수동 서류(입주신청서, 입주계, 연장신청서, 퇴거계)의 다국어(한/영) 간편 작성, 전자서명, 검토 및 PDF 변환·담당자 이메일 발송 웹 프로그램 초기 구축
- **수정/생성된 파일:**
  - `index.html`: 4단계 위저드(문서선택 → 작성/서명 → 검토 → 완료) UI 및 다국어 지원 구조 마크업
  - `style.css`: 공공/연수원 테마의 모던 반응형 스타일, 캔버스 서명 영역 및 A4 서식 레이아웃 스타일링
  - `app.js`: 한/영 다국어 사전, 4종 서류 필드 동적 생성, Canvas 터치/마우스 서명 로직, jsPDF+html2canvas 연동 PDF 생성 및 이메일 전송 핸들러 구현
- **주요 변경 사항:**
  - 한국어/영어 원클릭 전환 기능 (`switchLang`, `applyLanguage`)
  - 4대 서식(입주신청서, 입주계, 연장신청서, 퇴거계) 맞춤형 입력 필드 스키마 구축 (`docSchemas`)
  - HTML5 Canvas 기반 반응형 전자서명 패드 및 서명 유효성 검증 기능
  - 입력 데이터와 서명을 조합한 A4 용지 규격 실시간 미리보기 및 고화질 PDF 생성·다운로드 (`generateAndHandlePdf`)
  - 담당자 이메일 발송 처리 및 제출 완료 안내 화면 (`simulateEmailDispatch`, `renderCompleteSummary`)
- **테스트 및 검증 방법:**
  - 터미널에서 `python -m http.server 8085` 실행 상태 유지 중
  - 웹 브라우저에서 `http://localhost:8085` 접속
  - 우측 상단 [한국어/English] 버튼 클릭 시 실시간 다국어 전환 확인
  - 4개 서류 중 하나를 선택하여 필수 항목 및 서명 작성 후 [입력 내용 확인하기] 클릭
  - 최종 검토 화면에서 작성 내역 및 서명 이미지 확인 후 [PDF 다운로드] 및 [담당자 메일로 최종 제출] 동작 확인
---

### [2026-09-28 16:04] HWP/DOCX 원본 양식 정밀 분석 및 실물 서식 실시간 테스트 페이지(test.html) 구축

- **작업 목적:** `form` 폴더에 업로드된 한글(HWP 4종) 및 영문(DOCX 4종) 공식 양식의 표 구조, 조항, 조문을 정밀 분석하고, 실물 서식지 규격에 실시간으로 데이터가 채워지는 `test.html`을 개발하여 검증 환경 제공
- **수정/생성된 파일:**
  - `test.html`: 좌측 입력 폼 + 우측 실제 A4 규격 공식 서식지(HWP/DOCX 완벽 구현) 실시간 양방향 매핑 테스트 도구
  - `index.html`: 상단 내비게이션 바에 실물 서식 테스트 페이지(`test.html`) 바로가기 연결
- **주요 변경 사항:**
  - 한국해양과학기술원(KIOST) 공용숙소 관리지침 기준 4대 서식(입주신청서 별표1호, 입주계 별표3호, 연장신청서 별표2호, 퇴거계 별표5호) 필드 및 조항 완전 분해·매핑
  - 원본 HWP(한국어) 및 DOCX(영어) 원문 타이틀, 개정 연혁, 서약 조항 1~6항, 주의사항, 수신처 텍스트 1:1 일치 구현
  - 분할 화면(좌측: 입력 폼 & 전자서명 캔버스, 우측: 실제 A4 용지 규격 서식지) 구현으로 데이터 입력 시 실시간 반영
  - [샘플 데이터 자동입력], [공식 서식 규격 PDF 다운로드], [담당자 메일 발송 시뮬레이션] 원클릭 테스트 기능 탑재
- **테스트 및 검증 방법:**
  - 웹 브라우저에서 `http://localhost:8085/test.html` 접속
  - 상단 4개 서식 탭(입주신청서, 입주계, 연장신청서, 퇴거계) 및 언어 토글([한국어 (HWP)] / [English (DOCX)]) 전환 확인
  - [⚡ 샘플 데이터 자동입력] 클릭 후 우측 A4 서식 표에 실제 데이터와 서명이 정확한 칸에 채워지는지 확인
  - [📄 공식 서식 규격 PDF 다운로드] 클릭하여 실제 인쇄 가능한 A4 PDF 파일 생성 확인
---

### [2026-09-28 16:24] 공문서 서식 규격 1:1 일치화 및 요청 세부사항 정밀 반영

- **작업 목적:** 입주신청서 구분/숙소형태 상하 배치 및 고정, 입주기간 개월수 자동계산 및 총체류기간 입력칸 삭제, 입주계·퇴거계 환불계좌 분리 입력, 연장신청서 연장사유 삭제 및 연장회차 입력, 담당자 메일(`yoonbs@kiost.ac.kr`) 반영
- **수정/생성된 파일:**
  - `test.html`: 실시간 매핑 시뮬레이터에 사용자 요청 1~5번 항목 완벽 적용
  - `app.js`: 메인 포털 스키마 및 검토 화면 A4 공문서 테이블 렌더러 전면 개편
  - `index.html`: 담당자 수신 이메일 `yoonbs@kiost.ac.kr` 고정 반영 및 공문서 서식 뷰 구조 개선
  - `style.css`: 공문서 규격(`Nanum Myeongjo`, A4 인쇄 여백, 검정 실선 테두리) 스타일링 최적화
- **주요 변경 사항:**
  - **입주신청서:** 상단 표 구분(부산본원 고정) / 숙소형태(교육연수동 고정) 상·하 2행 배치, 시작일·종료일 선택 시 `calculateDuration` 함수로 개월/일수 자동계산하여 서식 표에 삽입(총 체류기간 입력란 삭제), 하단 안내 및 첨부서류 문구 원본 서식과 100% 일치
  - **입주계:** 사용숙소(교육연수동 고정), 환불계좌를 [은행명 및 계좌번호]와 [예금주]로 분리 입력받아 서식에 `은행명 계좌번호 (예금주: 누구)`로 자동 결합
  - **연장신청서:** 사용숙소(교육연수동 고정), 연장사유 입력칸 삭제, 공식 서식 규격대로 `(  ) 회차` 표기 반영
  - **퇴거계:** 사용숙소(교육연수동 고정), 환불계좌 [은행명 및 계좌번호]와 [예금주] 분리 입력받아 결합 표시
  - **공통:** 공문서 임의 서식 변경 전면 제거 및 HWP/DOCX 표 모양·글자 위치 1:1 철저 준수, 수신 담당자 이메일 `yoonbs@kiost.ac.kr` 지정
- **테스트 및 검증 방법:**
  - 브라우저에서 `http://localhost:8085/test.html` 또는 `http://localhost:8085/index.html` 접속
  - 입주신청서에서 입주 시작일과 종료일 변경 시 우측 서식지에서 `(X개월 Y일)`이 실시간 자동 계산되는지 확인
  - 입주계 및 퇴거계에서 은행계좌와 예금주를 각각 입력 시 우측 서식지에 하나로 합쳐져 표시되는지 확인
  - 연장신청서에서 연장사유 없이 연장회차가 `( 1 ) 회차`로 정확히 반영되는지 확인
  - [📄 공식 서식 규격 PDF 다운로드] 및 [📧 yoonbs@kiost.ac.kr 메일 발송] 버튼 동작 확인
---

### [2026-09-28 16:34] HWP/DOCX 원본 서식 100% 위치 일치화 및 사용호실 자동 서식화 적용

- **작업 목적:** 입주신청서 하단 텍스트(주석 → 서약문 → 첨부서류) 위치 순서를 원본과 100% 일치시키고, 입주계 표 행 순서를 원본 규격(소속/직급/성명/외국인/사용숙소/사용호실/입주기간/환불계좌)대로 1행씩 분리 배치하며, 모든 서식의 사용호실 입력 시 숫자만 입력해도 자동으로 `호`(`Room `)가 붙도록 개선
- **수정/생성된 파일:**
  - `test.html`: 실시간 매핑 시뮬레이터에 입주신청서 하단 순서, 입주계 8행 배치, `formatRoomNumber` 자동 '호' 변환 적용
  - `app.js`: 메인 포털 스키마 및 검토 화면 A4 공문서 렌더러에 동일 서식 규칙 적용
- **주요 변경 사항:**
  - **입주신청서:** 표 바로 아래에 `* 현거주지...`, `* 본거주지...` 주석 배치 → 그 아래에 `공용숙소관리지침에 의거...` 본문 서약문 배치 → 그 아래에 `첨부 ： 주민등록등본...` 배치로 원본 HWP 위치 순서 엄격 준수
  - **입주계:** 사용자 요청 및 원본 서식 규격에 맞춰 `소속 → 직급 → 성명 → 외국인(국적/여권) → 사용숙소(교육연수동) → 사용호실 → 입주기간 → 환불계좌` 순으로 각 행을 정확히 분리 배치
  - **사용호실 자동 '호' 추가:** 사용자가 `308` 숫자만 입력해도 `formatRoomNumber` 함수를 통해 한국어 양식은 `308호`, 영문 양식은 `Room 308`로 자동 서식화되어 표 칸에 매핑
  - **연장신청서 / 퇴거계:** 원본 HWP 및 영문 DOCX 테이블 칸 배치 및 호실 자동 변환 연동
- **테스트 및 검증 방법:**
  - 웹 브라우저에서 `http://localhost:8085/test.html` 접속
  - [① 입주신청서] 확인: 표 바로 아래에 주석 2줄(* 현거주지, * 본거주지), 그 아래 서약문, 그 아래 첨부서류가 차례대로 배치되었는지 확인
  - [② 입주계] 확인: 표 행이 소속, 직급, 성명, 외국인, 사용숙소, 사용호실, 입주기간, 환불계좌 순서로 단독 행 배치되었는지 확인
  - 사용호실 입력란에 `308`을 입력하고 포커스를 벗어났을 때 자동으로 `308호`로 포맷팅되어 표 칸에 들어가는지 확인
  - [📄 공식 서식 규격 PDF 다운로드] 실행 시 원본 규격 A4 PDF가 정확히 출력되는지 확인
---

### [2026-09-28 16:48] Google 생태계 연동 구축 (Google Apps Script 메일 전송 & Firebase Hosting 배포 준비)

- **작업 목적:** 사내망 제약 없이 스마트폰(LTE/5G) 및 외부 PC에서 신청자가 서류를 작성할 수 있도록, Google Apps Script를 활용한 실제 이메일(`yoonbs@kiost.ac.kr`) 무료 발송 API 구축 및 Firebase Hosting 배포 환경 설정
- **수정/생성된 파일:**
  - `google-apps-script.js`: 구글 서버에서 PDF를 디코딩하여 `yoonbs@kiost.ac.kr`로 발송하는 백엔드 스크립트 파일 신규 생성
  - `firebase.json`: 모바일/외부 PC에서 접속 가능한 Firebase Hosting 배포 설정 파일 신규 생성
  - `test.html` & `index.html`: Google Apps Script 웹앱 URL 입력 UI 및 `localStorage` 자동 보관 연동
  - `app.js`: PDF Blob을 Base64로 인코딩하여 Google Apps Script 웹앱으로 비동기 전송(`fetch`, `mode: no-cors`)하는 로직 구현
- **주요 변경 사항:**
  - **Google Apps Script 연동:** 제3자 서비스 없이 순수 구글 계정의 Gmail/MailApp을 활용하여 첨부파일(PDF)과 함께 정식 메일을 발송하는 `doPost` 엔드포인트 마련
  - **Firebase Hosting 설정:** `firebase.json`을 통해 불필요한 원본 문서/스크립트를 제외하고 정적 웹 애플리케이션을 원클릭 배포할 수 있는 환경 완비 (로그인 계정 `sayaki44@gmail.com` 확인 완료)
- **테스트 및 검증 방법:**
  - `google-apps-script.js`의 주석 가이드에 따라 Google Apps Script 웹 앱 배포 후 생성된 URL을 화면에 입력
  - [메일 발송] 버튼 클릭 시 구글 서버를 통해 `yoonbs@kiost.ac.kr` 담당자 메일함으로 전자서명된 PDF가 실제 전송되는지 확인
  - Firebase 배포: `firebase deploy --only hosting` 실행으로 외부 접속용 고유 도메인 생성 확인
---

### [2026-09-28 17:05] 사용자 Google Apps Script 웹앱 URL 직접 내장 및 Firebase 배포 준비 완료

- **작업 목적:** 사용자가 발급받은 Google Apps Script 웹앱 URL을 소스 코드에 직접 기본값으로 내장하여 수동 입력 절차를 없애고, Firebase Hosting 배포를 위한 프로젝트 설정 가이드 정립
- **수정/생성된 파일:**
  - `app.js`: `DEFAULT_GAS_URL` 상수로 사용자 배포 URL(`https://script.google.com/macros/s/AKfycbzUALMG5SCQ3AB1KBBpTvJdlBKc1EClsuP4lVgSBGMWocUO7XK42TcQqDTZIEcWdU5IxQ/exec`) 직접 내장 및 기본 전송 엔드포인트 연동
  - `test.html` & `index.html`: GAS URL 입력란에 해당 주소를 기본값으로 세팅하고 "발송 시스템 연동 완료" 상태로 UI 표시
- **주요 변경 사항:**
  - 사용자가 URL을 복사/붙여넣기 할 필요 없이, 서류 작성 후 제출 버튼만 누르면 구글 서버를 통해 `yoonbs@kiost.ac.kr`로 실시간 메일 및 PDF가 자동 전송되도록 원클릭화
  - Firebase Hosting 배포 시 프로젝트 연결 설정(새 프로젝트 생성 또는 기존 프로젝트 활용) 안내 체계화
- **테스트 및 검증 방법:**
  - `http://localhost:8085/index.html` 또는 `test.html`에서 샘플 데이터 작성 후 [메일 발송] 클릭 시 구글 서버로 직접 전송되는지 확인
  - `firebase deploy` 실행을 통한 외부 호스팅 주소 생성 확인
---

### [2026-09-28 17:28] 이메일/GAS 설정 UI 비노출, 버튼 텍스트 '메일 발송' 통일 및 GAS 전송 안정화 배포

- **작업 목적:** 각 양식 하단에 노출되던 담당자 수신 이메일 및 구글 앱 스크립트 설정 칸 숨김 처리, 메일 발송 버튼 텍스트를 '메일 발송'으로 통일, 메일 미수신 원인(Google Apps Script 권한 설정 및 CORS Content-Type) 해결 및 Firebase Hosting 재배포
- **수정/생성된 파일:**
  - `index.html`: 이메일/GAS 설정 박스 비노출(`display: none`), 제출 버튼 문구를 '메일 발송'으로 통일
  - `test.html`: 이메일/GAS 설정 박스 비노출(`display: none`), 버튼 문구를 '📧 메일 발송'으로 통일, fetch Content-Type을 `text/plain;charset=utf-8`로 수정
  - `app.js`: fetch 전송 Content-Type을 `text/plain;charset=utf-8`로 수정(CORS Preflight 우회)
- **주요 변경 사항:**
  - **설정 박스 비노출:** 사용자가 불필요한 이메일/URL 입력을 보지 않도록 UI에서 완전히 숨김(`display: none`) 처리하고, 내부적으로 `yoonbs@kiost.ac.kr` 및 배포된 GAS URL로 자동 전송되도록 유지
  - **버튼 텍스트 통일:** 버튼 텍스트에 포함되어 있던 이메일 주소를 삭제하고 '메일 발송'으로 직관적 통일
  - **메일 미수신 원인 규명 및 해결:**
    1. 브라우저 fetch 전송 시 `text/plain;charset=utf-8` 적용으로 CORS preflight 없이 GAS `doPost`로 직행하도록 개선
    2. Google Apps Script 배포 설정 상 '액세스 권한이 있는 사용자(Who has access)'가 '모든 사용자(Anyone)'로 되어있지 않아 구글 로그인 차단(액세스 권한 필요)이 발생하는 점을 확인하고 사용자 조치 안내 정립
  - **Firebase Hosting 배포:** `firebase deploy --only hosting`을 통해 라이브 웹사이트(`https://kiost-tcenter.web.app`)에 최신 코드 반영 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속 후 하단에 이메일/스크립트 설정 칸이 사라졌는지 확인
  - 메일 발송 버튼이 '메일 발송'으로 깔끔하게 표기되는지 확인
  - Google Apps Script 배포 관리에서 액세스 권한을 [모든 사용자(Anyone)]로 변경 후 [메일 발송] 테스트 진행
---

### [2026-09-28 17:42] 담당자 이메일 주소 전면 비노출 및 제출 완료 화면 즉각 상단 포커스/스크롤 개선

- **작업 목적:** 화면 전역(검토 안내문, 완료 요약 화면, 알림창 등)에 노출되던 담당자 이메일 주소 삭제, 메일 발송 완료 후 화면이 하단에 머무르지 않고 '서류 제출이 완료되었습니다' 완료 카드로 즉시 최상단 포커스 이동 처리
- **수정/생성된 파일:**
  - `app.js`: 한/영 i18n 문구 및 `renderCompleteSummary`에서 담당자 이메일 노출 제거(`수신처: 교육연수동 공용숙소 관리부서`), `setStep` 개선(4단계 진입 시 스텝 인디케이터 숨김 및 뷰포트 최상단 강제 스크롤 안착)
  - `test.html`: 메일 발송 완료 alert 창에서 수신 이메일 주소 제거
  - `index.html`: `view-review` 내 불필요한 닫는 div 태그 제거로 정상 DOM 트리 복원
  - `style.css`: `.complete-card` 상단 여백(`margin: 16px auto 32px`) 축소로 화면 상단에 즉각 시인성 확보
- **주요 변경 사항:**
  - **이메일 주소 완전 숨김:** 검토 화면 안내문구, 메일 발송 버튼, 발송 완료 요약 화면(`complete-details`), 알림 팝업 등 사용자가 보는 모든 UI에서 이메일 텍스트를 제거하고 관리부서 명칭으로 정돈 (내부 백그라운드 발송 기능은 100% 정상 유지)
  - **제출 완료 시 자동 최상단 이동:** 메일 발송 완료 후 긴 검토 화면 높이(1100px) 때문에 사용자가 스크롤을 내려야 했던 문제를 해결하기 위해, `window.scrollTo(0, 0)` 즉각 호출 및 `views.complete.scrollIntoView()`를 연동하여 완료 카드('서류 제출이 완료되었습니다!')가 즉시 화면 상단 한가운데 보이도록 개선
  - **Firebase Hosting 재배포:** 최신 빌드를 프로덕션(`https://kiost-tcenter.web.app`)에 즉시 배포
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속
  - 서류 작성 및 서명 후 3단계 검토 화면 진입
  - 하단 [🚀 메일 발송] 버튼 클릭 시, 발송 완료와 동시에 화면이 상단으로 자동 전환되어 '서류 제출이 완료되었습니다!' 카드가 스크롤 없이 즉시 표시되는지 확인
  - 완료 카드 내에 담당자 개인 이메일 노출 없이 '수신처: 교육연수동 공용숙소 관리부서'로 깔끔하게 정리되었는지 확인
---

### [2026-09-28 17:51] HWP/DOCX 원본 공문서 양식 전수 검증 및 불일치 항목(호실/연락처 등) 외과수술적 수정

- **작업 목적:** `form` 디렉터리에 보관된 한글(HWP 4종) 및 영문(DOCX 4종) 공식 공문서 원본과 웹 서식지 간의 불일치 항목 전수 검증, 입주신청서의 불필요한 호실 입력란 및 퇴거계의 연락처 입력란 제거, 원본 서식 테이블 레이아웃과 100% 일치화
- **수정/생성된 파일:**
  - `app.js`: 입주신청서(`moveInApp`) 스키마에서 `room_no` 필드 제거, 퇴거계(`moveOutNotice`) 스키마에서 `contact` 필드 제거, 미리보기 테이블 생성기(`generateAuthenticTableHtml`)에서 입주신청서 희망호실 텍스트 제거 및 퇴거계 테이블 구조(성명 단독행, 사용숙소/호실 1행 배치) 수정
  - `test.html`: 실시간 테스트 도구 내 입력 필드 스키마 및 테이블 생성기(`generateFormTableHtml`)에서 동일하게 입주신청서 호실 제거 및 퇴거계 연락처 제거·테이블 레이아웃 HWP 원본과 1:1 동기화
- **주요 변경 사항:**
  - **입주신청서 (별표 제1호):** 입주 신청 시점에는 호실이 미배정 상태이므로 원본 HWP/DOCX에 호실 기재란이 전혀 없음을 확인. 이에 따라 입력 폼의 `room_no` 필드 및 미리보기 표 하단의 `[희망호실: ...]` 문구를 완전 삭제
  - **퇴거계 (별표 제5호):** 원본 HWP/DOCX에 연락처 칸이 없음을 확인. 입력 폼의 `contact` 필드를 삭제하고, 미리보기 표에서 `소속/직급` → `성명(단독 행, colspan 3)` → `사용숙소/사용호실(1행)` 구조로 원본과 완벽 일치하도록 재배치
  - **입주계 (별표 제3호) & 연장신청서 (별표 제2호):** 원본 양식의 항목 및 셀 구조(소속, 직급, 성명, 외국인, 숙소, 호실, 기간, 환불계좌, 연장회차 등) 전수 검증 완료
  - **Firebase Hosting 배포:** 수정 사항을 프로덕션(`https://kiost-tcenter.web.app`)에 즉시 배포 반영
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속
  - [입주신청서] 선택 시 입력 폼에 '사용호실' 입력란이 없으며, 검토 화면의 표에도 호실 관련 내용 없이 원본 그대로 표시되는지 확인
  - [퇴거계] 선택 시 입력 폼에 '연락처' 입력란이 없으며, 검토 화면의 표에서 성명이 단독 행으로 넓게 표시되고 사용숙소와 사용호실이 한 줄에 나란히 배치되는지 확인
  - [입주계] 및 [연장신청서]의 입력 항목과 표 모양이 HWP/DOCX 원본과 동일함을 확인
---

### [2026-09-28 18:07] PDF 다운로드 버튼 제출 완료 후로 이동 및 HWP 원본 정렬(좌·우·중앙) 100% 일치화

- **작업 목적:** 검토 단계에 있던 '공식 PDF 다운로드' 버튼을 사용자의 서류 제출(메일 발송) 완료 화면으로 이동하여 '작성한 PDF 다운로드'로 제공하고, HWP 원본 양식의 문단 및 표 셀 정렬(좌측, 중앙, 우측) 상태를 전수 분석하여 1:1로 일치화
- **수정/생성된 파일:**
  - `index.html`: 검토 화면(`review-action-btns`)에서 PDF 다운로드 버튼 제거, 제출 완료 화면(`complete-actions`)에 [📄 작성한 PDF 다운로드] 버튼 신설
  - `app.js`: 다국어 사전에 `btn_download_submitted_pdf` 추가, 제출 완료 화면의 [📄 작성한 PDF 다운로드] 클릭 이벤트 연동, HWP 원본 문단 속성 분석 결과에 따라 테이블 셀 및 서명 영역 정렬(th 중앙, 일반 td 중앙, 주소/퇴거사유 등 긴 텍스트 좌측, 날짜 우측, 서명란 우측, 수신처 좌측) 정밀 반영
  - `test.html`: 실시간 미리보기 도구의 테이블 셀 정렬(`text-center`, `text-left`), 날짜 우측 정렬 반영
  - `style.css`: `.complete-actions` 플렉스 정렬 스타일 추가
- **주요 변경 사항:**
  - **버튼 이동 및 명칭 변경:** 서류를 검토하는 3단계 하단에는 `[← 수정하기]`와 `[🚀 메일 발송]`만 배치하고, 메일 발송이 성공한 후 나타나는 4단계 완료 화면에 `[📄 작성한 PDF 다운로드]` 버튼을 추가하여 제출자가 서명된 본인 제출본을 바로 저장할 수 있도록 개선
  - **HWP/DOCX 원본 정렬 전수 반영:**
    1. 헤더: 서식명(중앙), 별표/관리지침/개정연혁(좌측)
    2. 표(Table): 모든 헤더(th) 중앙 정렬, 성명/소속/직급/연락처/호실/기간/환불계좌 등 핵심 데이터 중앙 정렬, 현거주지/본거주지/외국인 기재/퇴거사유 등 긴 서술형 데이터 좌측 정렬
    3. 하단 서약문: 주석(좌측), 첨부서류(좌측), 서약문(중앙/양쪽)
    4. 제출 서명 영역: **날짜 우측 정렬**, **신청인/입주자 서명란 우측 정렬**, **수신처(한국해양과학기술원장 귀하) 좌측 정렬** 완벽 적용
  - **Firebase Hosting 배포:** 프로덕션(`https://kiost-tcenter.web.app`)에 배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속
  - 서류 작성 및 서명 후 3단계 검토 화면 진입 시 하단에 '공식 PDF 다운로드'가 사라지고 `[← 수정하기]`, `[🚀 메일 발송]`만 표시되는지 확인
  - 표 내부의 성명, 소속, 직급 등은 가운데 정렬, 주소는 왼쪽 정렬, 하단 날짜와 서명란은 오른쪽 정렬, 수신처는 왼쪽 정렬로 원본 HWP와 완벽히 일치하는지 확인
  - [🚀 메일 발송] 클릭 후 나타나는 제출 완료 카드에서 `[📄 작성한 PDF 다운로드]` 버튼이 정상 노출되며, 클릭 시 서명된 PDF가 즉시 다운로드되는지 확인
---

### [2026-09-29 09:12] KIOST 등 회사명 완전 제거 및 Dribbble 모바일 UI 기반 반응형 화면 틀어짐 해결

- **작업 목적:** 특정 기관명(KIOST, 한국해양과학기술원 등)을 모두 삭제하고 '교육연수동 간편 서류 제출 시스템' 테마로 명칭을 표준화하며, 모바일 기기 접속 시 글자 수와 화면 너비 한계로 인해 레이아웃이 찌그러지거나 깨지는 현상을 Dribbble 모바일 UI(Todo List 패턴)를 벤치마킹하여 완벽하게 개선
- **수정/생성된 파일:**
  - `index.html`: 헤더 인라인 스타일 제거 및 반응형 액션바 클래스(`top-nav-actions`, `btn-test-link`) 적용, 검토 화면에 모바일 전용 스크롤 컨테이너(`review-sheet-scroll-container`) 및 안내 힌트 칩 신설
  - `style.css`: Dribbble Todo List 감성의 세련된 카드/폼 디자인 시스템 전면 적용, 모바일(320px~768px) 환경에서 글자 수나 화면 폭 때문에 틀어지는 모든 영역(헤더 줄바꿈, 단계 인디케이터, 서류 선택 카드, 입력 폼 패딩, 서명 패드 터치 간섭, 검토 서식지 테이블 규격 보존, 액션 버튼 풀위드) 반응형 최적화
  - `app.js`: 다국어(한국어/영어) 사전 및 4대 서식 스키마(입주신청서, 입주계, 연장신청서, 퇴거계)에서 KIOST 및 한국해양과학기술원 명칭 전수 제거 후 '교육연수동' / 'Training Center'로 통일, 수신처를 '교육연수동장 귀하' / 'To Director of Training Center'로 변경, 테이블 헤더 구분 셀 교체, 모바일 PDF 캡처 시 스크롤 위치 간섭 방지 옵션(`scrollX: 0, scrollY: 0`) 추가
  - `test.html`: 테스트 도구 내 title, 배지, 스키마, 테이블 생성기 등에서 KIOST 및 회사 관련 단어 일괄 정돈
- **주요 변경 사항:**
  - **1. 교육연수동 단독 테마 확립:** 사용자에게 노출되는 모든 화면 텍스트(헤더 배지, 서비스명, 설명문, 서식지 명칭, 서약 문구, 최종 수신처, 바닥글 카피라이트 등)에서 KIOST와 한국해양과학기술원을 완전 제거하고 '교육연수동 간편 서류 제출 시스템'으로 일원화
  - **2. 모바일 헤더 & 스텝 인디케이터 찌그러짐 방지:** 좁은 화면에서 로고, 언어 버튼, 서식 링크가 겹쳐서 헤더가 터지던 문제를 모바일 플렉스 컬럼 스택 및 반응형 액션바로 정돈하고, 단계 인디케이터의 긴 글자수 때문에 레이아웃이 깨지지 않도록 최소 너비와 폰트 크기 조절 및 소형 기기(400px 이하) 활성 스텝 중심 스마트 축약 적용
  - **3. Dribbble Todo List 스타일 서류 선택 카드:** 모바일에서 1열 리스트 카드로 자연스럽게 전환되며, 둥근 모서리(18px), 부드러운 그림자(Soft Shadow), 파스텔 아이콘 배지, 터치 친화적 액션 버튼을 통해 모바일 앱과 같은 프리미엄 UX 제공
  - **4. 입력 폼 & 서명 패드 모바일 최적화:** 모바일 여백 낭비를 없애기 위해 폼 패딩을 스마트하게 압축(16px~20px)하고, 날짜(Date) 인풋의 브라우저 기본 너비 넘침 방지 및 서명 시 모바일 화면이 스크롤되지 않도록 `touch-action: none;` 터치 제어 적용
  - **5. 검토 서식지(Table) 글자 1글자 세로 쪼개짐 원천 차단:** 4개 열을 가진 공문서 테이블이 360px 모바일 폭에 억지로 찌그러지면서 글자가 1글자씩 세로로 부서지던 문제를 해결하기 위해, 원본 HWP 서식지 폭(최소 660px 이상)을 온전히 보존하면서 부드럽게 터치 스와이프로 확인할 수 있는 `review-sheet-scroll-container` 래퍼 및 모바일 가이드 힌트 칩 적용 (PDF 다운로드 시에는 A4 고해상도 인쇄 품질 완벽 유지)
  - **6. 텍스트 줄바꿈 방어:** 전체 스타일에 `word-break: keep-all; overflow-wrap: break-word;`를 적용하여 한글 단어가 어색하게 잘리지 않도록 정밀 마감
- **테스트 및 검증 방법:**
  - 스마트폰(모바일 브라우저) 또는 개발자 도구 모바일 모드(iPhone/Galaxy 등 폭 360px~414px)로 `index.html` 접속
  - 상단 헤더, 스텝 인디케이터, 서류 선택 카드가 화면 폭을 벗어나거나 틀어짐 없이 정갈하게 정렬되는지 확인
  - 서류 선택 후 입력 폼 작성 및 모바일 터치 서명이 부드럽게 작동하는지 확인
  - 3단계 검토 화면 진입 시 안내 칩("👈 좌우로 스크롤하여 공식 서식지 전체를 확인하세요 👉")과 함께 테이블 내 글자가 세로로 꺾이지 않고 규격대로 깔끔하게 유지되는지 확인
  - 메일 발송 및 작성한 PDF 다운로드 후 PDF에 회사명 없이 '교육연수동' 테마로 정확히 인쇄되는지 확인
---

### [2026-09-29 09:20] 공식 공문서 원본 양식(HWP/DOCX 규격 및 회사명) 100% 원상 복구 및 메인 화면 테마 유지

- **작업 목적:** 메인 화면(헤더, 서류 선택 화면 등)은 '교육연수동 간편 서류 제출 시스템' 테마를 유지하되, 검토 화면 및 최종 생성되는 공식 공문서(HWP/DOCX 원본) 내의 회사명(한국해양과학기술원, Korea Institute of Ocean Science & Technology, KIOST, 한국해양과학기술원장 귀하, 부산본원 등)과 법정 서식 번호·개정연혁을 100% 원본 규격으로 복구
- **수정/생성된 파일:**
  - `app.js`: 4대 서식 스키마(`docSchemas`)의 서식명, 별표 번호, 관리지침 명칭, 개정연혁, 수신처('한국해양과학기술원장 귀하' / 'To President of the Korea Institute of Ocean Science & Technology (KIOST)'), 서약 문구, 미리보기 테이블 구분 셀('부산본원' / 'KIOST (Busan HQ)') 전수 원본 규격으로 복구 완료 (메인 화면 테마는 교육연수동으로 유지)
  - `test.html`: 실시간 서식 시뮬레이터 내의 4대 서식 스키마 및 미리보기 테이블 데이터를 HWP/DOCX 원본 규격으로 완벽 복구
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 메인 포털 UI와 공식 공문서 서식지의 명확한 분리:** 사용자가 보는 웹 포털의 헤더, 네비게이션, 서류 선택 화면은 특정 회사명 없이 '교육연수동 간편 서류 제출 시스템' 테마를 온전히 유지하고, 검토 단계에서 생성되는 공문서 종이 서식지 및 PDF 문서는 실제 원본 공문서 법정 규격(한국해양과학기술원장 귀하 / 부산본원 / 별표 제1·2·3·5호)을 100% 원상태로 일치화
  - **2. Firebase Hosting 배포:** `firebase deploy --only hosting`을 통해 프로덕션 라이브 사이트(`https://kiost-tcenter.web.app`)에 즉시 배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속
  - 메인 화면(1단계): 헤더 및 서류 선택 화면에 회사명 없이 '교육연수동 간편 서류 제출 시스템'으로 표시되는지 확인
  - 내용 작성 후 3단계 검토 화면: 상단 헤더의 관리지침/개정연혁, 테이블의 '부산본원', 서약 문구, 하단 최종 수신처가 원본 그대로 **'한국해양과학기술원장 귀하'** / **'To President of the Korea Institute of Ocean Science & Technology (KIOST)'** 로 정확히 복구되었는지 확인
---

### [2026-09-29 09:41] 원본 서식 양식 전수 복구 및 test.html 동기화 완료

- **작업 목적:** 메인 포털 UI는 '교육연수동 간편 서류 제출 시스템' 테마를 유지하되, `test.html`과 `app.js` 내의 모든 원본 공문서 서식지(입주신청서, 입주계, 연장신청서, 퇴거계)의 회사명, 서식 번호, 구분(부산본원), 수신처(한국해양과학기술원장 귀하)를 100% 원본 규격으로 전수 복구 및 배포
- **수정/생성된 파일:**
  - `test.html`: 스크립트 시작부 `let currentLanguage = 'ko';` 변수 복원, 입주신청서 테이블의 구분 필드를 원본 규격(`구분: 부산본원` / `Region: KIOST Premise`)으로 완벽 복구
  - `app.js`: 4종 공식 공문서 스키마 및 검토 테이블 내 원본 명칭(부산본원, 한국해양과학기술원장 귀하 등) 전수 일치 확인
- **주요 변경 사항:**
  - **1. 메인 포털 UI와 서식지의 명확한 분리:** 사용자가 보는 메인 화면(헤더, 서류 선택 카드 등)만 교육연수동 테마로 유지하고, 공식 서식지(검토 화면, PDF, test.html)는 원본 HWP/DOCX 규격(한국해양과학기술원, 부산본원, 한국해양과학기술원장 귀하)을 철저히 보존
  - **2. Firebase Hosting 배포:** `https://kiost-tcenter.web.app` 프로덕션 재배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 및 `https://kiost-tcenter.web.app/test.html` 접속
  - 메인 포털은 교육연수동 테마로 유지되고, 서식지 내부의 구분(부산본원), 수신처(한국해양과학기술원장 귀하)가 원본 그대로 표시되는지 확인
---

### [2026-09-29 10:02] HWP/DOCX 공식 공문서 원본 양식(회사명/수신처/조항 배치) 100% 완전 복구 및 배포

- **작업 목적:** 메인 화면(문서 선택, 입력 폼, 완료 화면 등)은 '교육연수동 간편 서류 제출 시스템' 테마를 온전히 유지하고, 실제 출력/검토되는 모든 공식 공문서 서식지(HWP/DOCX 원본 규격)에는 기관/회사명(`한국해양과학기술원장 귀하`, `한국해양과학기술원 원장 귀하`, `To President of the Korea Institute of Ocean Science & Technology (KIOST)`, `KIOST`, `부산본원` 등) 및 서약 조항을 100% 원본 그대로 완벽 복구
- **수정/생성된 파일:**
  - `app.js`: 국문(HWP) 및 영문(DOCX) 원본 구조에 맞춘 렌더링 로직 정밀 개편. 영문 DOCX 원본대로 제목 직하단에 수신처(`To President of the Korea Institute of Ocean Science & Technology (KIOST),`) 및 신청 문구(`Please accept my application...`)를 배치하고, 국문 HWP 원본대로 하단에 날짜/서명(우측) 및 수신처(`한국해양과학기술원장 귀하` / `한국해양과학기술원 원장 귀하`)(좌측) 1:1 일치 배치
  - `test.html`: 공식 서식 테스트 도구 헤더 배지 및 타이틀을 'KIOST 공식 서식 규격 / 공용숙소 공식 서식 실시간 매핑 시뮬레이터'로 복구, 우측 A4 서식지에 영문 DOCX 상단 수신처 래퍼 신설 및 국/영문 전환 시 원본 서식지 100% 동기화 렌더링 반영
  - `index.html`: 검토 화면(3단계) 정적 마크업의 임의 placeholder 문구를 제거하고 동적 공문서 서식지 컨테이너로 완전 정돈
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 메인 포털 UI와 공식 공문서 서식지의 명확한 분리 원칙 확립:** 사용자가 이용하는 메인 웹 화면(헤더, 단계 표시, 1단계 서류 선택 카드, 2단계 폼, 4단계 완료 화면)은 특정 회사명 없이 '교육연수동 간편 서류 제출 시스템' 테마를 유지하되, 서류를 검토하는 3단계 A4 서식지, PDF 다운로드 문서, 서식 테스트 도구(`test.html`)의 서식지는 HWP 4종 및 DOCX 4종 공식 공문서 원본의 모든 문구와 회사명을 철저하게 보존·복구
  - **2. 국문 HWP & 영문 DOCX 1:1 정밀 배치:** 영문 DOCX 원본의 핵심 특징인 제목 직하단 수신처(`To President of the Korea Institute of Ocean Science & Technology (KIOST)`) 배치를 구현하고, 국문 HWP의 하단 좌측 수신처 배치를 완벽하게 분리 반영
  - **3. Firebase Hosting 배포 완료:** `https://kiost-tcenter.web.app` 최신 버전 배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속: 메인 화면은 교육연수동 테마로 표시되는지 확인
  - 서류 작성 후 3단계 검토 화면 진입: A4 서식지에 `한국해양과학기술원장 귀하` / `한국해양과학기술원 원장 귀하` 및 영문 `To President of the Korea Institute of Ocean Science & Technology (KIOST)`가 원본 규격대로 완벽하게 표시되는지 확인
  - `https://kiost-tcenter.web.app/test.html` 접속: 한국어(HWP) 및 English(DOCX) 전환 시 4종 서류 모두 공식 원본 양식 그대로 100% 매핑되는지 확인
---

### [2026-09-29 10:10] 상단 서식테스트 메뉴 삭제 및 서식 작성 폼 상단 고정 안내 박스 삭제

- **작업 목적:** 메인 화면 상단 네비게이션에서 [서식 테스트] 메뉴 링크 삭제, 4대 서식(입주신청서, 입주계, 연장신청서, 퇴거계) 작성 폼 상단에 노출되던 고정값 안내 박스(부산본원, 숙소형태 교육연수동 등)를 제거하여 입력 폼을 간결하게 정돈
- **수정/생성된 파일:**
  - `index.html`: 상단 네비게이션 액션 영역에서 [서식 테스트] 링크(`btn-test-link`) 완전 삭제
  - `app.js`: 2단계 폼 렌더링 함수(`renderFormFields`)에서 상단 고정 안내 박스(`noticeBox`) 생성 및 삽입 로직 제거
  - `test.html`: 좌측 테스트 입력 폼에서 고정 안내 뱃지(`fixed-info-badge`) 영역 및 스크립트 세팅 코드 제거
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 상단 네비게이션 정돈:** 사용자 포털 화면 상단에 노출되던 [서식 테스트] 버튼을 제거하여 언어 전환 버튼만 깔끔하게 유지
  - **2. 작성 화면 안내 박스 비노출:** 입주신청서, 입주계, 연장신청서, 퇴거계 등 모든 서류 작성 진입 시 폼 상단에 뜨던 초록색 고정 안내 박스("✓ [고정] 구분: 부산본원 | 숙소형태: 교육연수동" 등)를 완전히 삭제하여 사용자가 본인 입력 필드에 곧바로 집중할 수 있도록 개선 (공문서 서식지 및 PDF에는 규격대로 정상 반영 유지)
  - **3. Firebase Hosting 배포 완료:** `https://kiost-tcenter.web.app` 최신 버전 배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속
  - 상단 헤더 우측에 [서식 테스트] 버튼이 사라지고 언어 선택 버튼만 남아있는지 확인
  - 4개 서류 중 하나(예: 입주신청서)를 클릭하여 2단계 작성 화면으로 진입했을 때, 폼 상단에 고정 안내 박스 없이 바로 첫 번째 입력 필드(성명, 소속 등)가 시작되는지 확인
---

### [2026-09-29 10:19] 영문 DOCX 공식 공문서 원본 4종 표 구조 및 서식 100% 1:1 전용 분리 구현

- **작업 목적:** 국문(HWP) 서식과 행/열 구조, 항목, 조항이 완전히 다른 영문 공식 원본 4종(DOCX 파일)을 정밀 분석하여, 영문 전용 테이블 렌더러(`generateEnglishDocxTableHtml`, `generateEnglishDocxTableHtmlTest`)를 구축하고 실제 DOCX 서식과 100% 일치화
- **수정/생성된 파일:**
  - `app.js`: `generateAuthenticTableHtml`에서 영문(`lang === 'en'`)일 때 신설된 `generateEnglishDocxTableHtml` 함수를 호출하도록 분기하고, DOCX 4종(입주신청서, 입주계, 연장신청서, 퇴거계)의 행·열 구조 및 영문 텍스트를 원본 그대로 생성
  - `test.html`: 테스트 도구 내 `generateFormTableHtml`에서도 동일하게 영문 전용 함수(`generateEnglishDocxTableHtmlTest`)를 구축하여 국문과 완벽 분리
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 입주신청서 (Residence Application - DOCX Appendix 1):** 상단에 KIOST 및 각 연구소별(South Sea, East Sea, Ulleungdo, Jeju) 숙소 선택 표(Staff residence, Dormitory, Type of residence, Executive Residence, Education and Training Center(Dormitory) ☑) 완벽 구현, 하단에 신청자 인적사항(Applicant's full name, Name of company/institute, Title/Position, Phone no., Current address, Home address, Foreigner info, Desired period of stay) 원본 배치 적용
  - **2. 입주계 (Residence Move-In Form - DOCX Appendix 3):** HWP와 달리 환불계좌 행이 없는 영문 원본 그대로 Name of company/institute, Title/Position, Applicant's full name, Foreigner information(Nationality, Alien Registration No.), Name of residence, Room no., Period of stay 총 7행 구조로 일치화
  - **3. 연장신청서 (Application for Extension of Period of Stay - DOCX Appendix 2):** 소속/직급, 성명/연락처, 숙소명, 호실, 최초입주일, 체류기간(Until now, Desired extension period), 연장회차의 8행 원본 구조 1:1 구현
  - **4. 퇴거계 (Residence Move-Out Form - DOCX Appendix 4):** HWP와 달리 환불금액/환불계좌/숙소확인 행이 없는 영문 원본 규격대로 소속/직급, 성명, 숙소명, 호실, 외국인정보, 퇴거일, 퇴거사유 7행 구조로 정밀 구현
  - **5. Firebase Hosting 배포 완료:** `https://kiost-tcenter.web.app` 최신 버전 배포 완료
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속 후 우측 상단 [English] 선택
  - 4개 서류 중 하나(예: Residence Application, Residence Move-In Form 등) 작성 후 3단계 검토 화면 진입
  - 우측에 출력되는 A4 용지가 영문 DOCX 공식 양식의 고유 표 구조(입주신청서의 상단 본원/연구소 숙소표, 입주계/퇴거계의 환불계좌 미포함 7행 구조 등)와 100% 동일하게 렌더링되는지 확인
---

### [2026-09-29 11:15] test.html 서식 실시간 미리보기/테스트 환경 점검 및 로컬 검증 대기

- **작업 목적:** 국문(HWP) 및 영문(DOCX) 4대 공식 서식을 사용자가 실시간으로 확인하고 테스트할 수 있도록 `test.html`의 2열 스플릿 레이아웃, 샘플 데이터 자동입력, 서명 패드, A4 양식 정밀 매핑 기능을 점검하고 로컬 테스트 서버(`http://localhost:8085/test.html`) 가동 (사용자 최종 승인 전까지 깃허브 푸시 및 파이어베이스 배포 일체 보류)
- **수정/생성된 파일:**
  - `test.html`: 국문 HWP 4종 및 영문 DOCX 4종 공식 공문서 규격 1:1 매핑, 좌측 입력 폼 & 우측 A4 실시간 반영 점검 완료
  - `index.html`: 상단 네비게이션에 `[📋 서식 미리보기/테스트]` 링크(`test.html`) 연결 확인
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. test.html 실시간 테스트 준비 완료:**
    - 한국어 (HWP) 4종 서식: 입주신청서(별표 제1호), 입주계(별표 제3호), 입주기간 연장신청서(별표 제2호), 퇴거계(별표 제5호)
    - English (DOCX) 4종 서식: Residence Application (Appx. 1), Residence Move-In Form (Appx. 3), Residence Extension Form (Appx. 2), Residence Move-Out Form (Appx. 4)
    - 상단 언어 전환 탭(`[한국어 (HWP)]`, `[English (DOCX)]`) 및 서식 전환 탭 작동
    - 좌측 입력 폼(`⚡ 샘플 데이터 자동입력` 지원) 및 서명 패드 실시간 반영
    - 원본 양식 수신처(한국해양과학기술원장 귀하 / To President of KIOST) 100% 보존
  - **2. 로컬 테스트 서버 가동:**
    - 로컬 포트 8085(`http://localhost:8085/test.html`)에서 실시간 서식 테스트 가능
  - **3. 배포 보류 준수:**
    - 사용자의 명시적 "업로드" 요청 전까지 GitHub 푸시 및 Firebase 배포 진행하지 않음
- **테스트 및 검증 방법:**
  - 브라우저에서 `http://localhost:8085/test.html` 접속
  - 상단 4개 서식 탭 및 한국어/영어 전환 버튼을 클릭하여 서식 원본이 정확히 나오는지 확인
  - `[⚡ 샘플 데이터 자동입력]` 클릭 후 우측 A4 용지에 값이 정상 매핑되는지 확인
  - `[📄 공식 서식 규격 PDF 다운로드]`를 눌러 다운로드된 PDF 서식 확인
---

### [2026-09-29 11:42] 영문 DOCX 공식 서식 4종 요청사항 반영 (company 고정, 간격 조절, 원본 문구 100% 일치화)

- **작업 목적:** 영문 양식 4종(입주신청서, 입주계, 연장신청서, 퇴거계)의 company 란을 'KIOST'로 고정 입력하고, 퇴거계 Name of residence를 'KIOST Trading Center'로 고정하며, 원본 DOCX 규격에 맞춘 표 간격(colgroup 및 패딩)과 표 하단 문구(각주, 첨부서류, 서약 조항, 서명/일자 표기)를 100% 일치화
- **수정/생성된 파일:**
  - `test.html`: 영문 4종 서식의 company 입력 및 렌더링을 'KIOST'로 고정, 퇴거계 숙소명을 'KIOST Trading Center'로 고정, DOCX XML 기반 colgroup 너비 및 셀 간격 조정, 하단 각주/첨부서류/서약 조항 및 `(MM/DD/YY)` 표기 원본 일치화
  - `app.js`: 사용자 포털 검토 화면 및 PDF 생성용 영문 테이블(`generateEnglishDocxTableHtml`) 4종에 company 'KIOST' 고정, 퇴거계 숙소명 'KIOST Trading Center' 고정, Times New Roman 폰트 및 원본 colgroup 너비/간격 적용, 입주계 서약서 전문 문구(`pledgeIntro`) 및 영문 날짜/서명란 규격 업데이트, 영문 입력 필드 렌더링 시 소속 란 'KIOST' 고정(readonly)
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 입주신청서 (Residence Application):**
    - `Name of company/institute` 표 셀에 `KIOST` 고정 출력 및 입력 필드 잠금
    - 표 열 너비(20%, 24%, 10%, 18%, 14%, 14%) 및 셀 간격(`padding: 6px 8px;`, Times New Roman) 원본 DOCX와 1:1 매칭
    - 표 하단 각주 2종(* The current address..., * The home address...) 및 첨부서류 2종(Attachments: one copy of a family relation certificate..., A copy of a passport for foreigners.) 원본 문구 그대로 100% 일치화
  - **2. 입주계 (Residence Move-In Form):**
    - `Name of company/institute` 표 셀에 `KIOST` 고정
    - 표 열 너비(18%, 13%, 29%, 20%, 20%) 및 행 간격(`padding: 8px 10px;`) 조정
    - 표 하단 서약 전문("I acknowledge that I agree to abide by the Residence Regulation and accept the following terms and conditions:") 및 6개 서약 조항 100% 원본 반영
  - **3. 연장신청서 (Application for Extension of Period of Stay):**
    - `Name of company/institute` 표 셀에 `KIOST` 고정
    - 표 열 너비(9%, 10%, 32%, 18%, 31%) 및 행 간격(`padding: 7px 10px;`) 조정
    - 표 하단 불필요한 서약문 없이 원본대로 일자 및 서명란만 깔끔하게 배치
  - **4. 퇴거계 (Residence Move-Out Form):**
    - `Name of company/institute` 표 셀에 `KIOST` 고정
    - `Name of residence` 표 셀에 `KIOST Trading Center` 고정 입력 (사용자 요청사항 엄격 준수)
    - 표 열 너비(18%, 36%, 18%, 28%) 및 행 간격(`padding: 8px 10px;`) 조정
    - 영문 원본에 없는 불필요한 환불/점검 행 없이 7행 원본 규격 유지
  - **5. 공통 수정:**
    - 모든 영문 서식 일자 표기 하단에 `(MM/DD/YY)` 서식 안내 추가
    - 모든 영문 서식 서명자 라벨("Signature of Applicant :", "Signature of Resident :") 원본 일치화
    - 사용자 "업로드" 승인 전까지 GitHub 푸시 및 Firebase 배포 철저히 보류
- **테스트 및 검증 방법:**
  - 브라우저에서 `http://localhost:8085/test.html` 접속
  - 우측 상단 언어 선택에서 `[English (DOCX)]` 선택
  - 상단 4개 서식 탭을 순서대로 클릭하여 아래 내용 확인:
    1. **Move-in Application:** company 란이 'KIOST'로 고정되었는지, 표 하단 2개 각주와 2개 첨부서류 문구가 원본과 완벽히 일치하는지 확인
    2. **Move-in Form:** company 란이 'KIOST'로 고정되었는지, 표 하단 서약 문구 및 6개 항목이 원본과 동일한지 확인
    3. **Extension Form:** company 란이 'KIOST'로 고정되었는지, 체류기간 및 연장회차 표 간격이 균형 있게 배치되었는지 확인
    4. **Move-out Form:** company 란이 'KIOST'로 고정되고, Name of residence 가 'KIOST Trading Center'로 고정되었는지 확인
---

### [2026-09-29 11:55] GitHub 및 Firebase Hosting 배포 완료

- **작업 목적:** 사용자의 배포 요청에 따라 영문 서식 4종 정밀 수정본을 포함한 전체 프로젝트를 GitHub 신규 리포지토리에 푸시하고 Firebase Hosting에 프로덕션 배포 완료
- **수정/생성된 파일:**
  - `.gitignore`: git 관리 제외 항목 지정 (.firebase, .firebaserc, node_modules 등)
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. GitHub 리포지토리 생성 및 푸시 완료:**
    - GitHub 리포지토리 생성: `https://github.com/sayaki4444/T-Center`
    - `main` 브랜치로 전체 소스 코드(국/영문 공식 서식, 서식 테스트 도구 등) 푸시 완료
  - **2. Firebase Hosting 배포 완료:**
    - 프로젝트: `kiost-tcenter`
    - 배포 URL: `https://kiost-tcenter.web.app`
    - 정적 호스팅 파일 업로드 및 새 버전 릴리스 완료
- **테스트 및 검증 방법:**
  - **배포 라이브 사이트 검증:**
    - `https://kiost-tcenter.web.app` 접속
    - 상단 언어 선택(한국어 / English) 및 서식 선택(입주신청서, 입주계, 연장신청서, 퇴거계) 동작 확인
    - 서식 테스트 도구(`https://kiost-tcenter.web.app/test.html`) 정상 동작 확인
  - **GitHub 리포지토리 검증:**
    - `https://github.com/sayaki4444/T-Center` 접속하여 커밋 내역 확인
---

### [2026-09-29 13:25] Icon 폴더 기반 PWA 홈 화면 바로가기 / 앱 설치 규격 구축 및 배포

- **작업 목적:** `Icon/icon.png` 이미지를 기반으로 모바일 및 데스크톱 브라우저에서 '홈 화면에 추가' / '바로가기 만들기' / 'PWA 앱 설치'가 가능하도록 웹 앱 매니페스트(`manifest.json`), 규격별 아이콘 세트, 서비스 워커(`sw.js`), 바로가기 숏컷을 구축하고 배포
- **수정/생성된 파일:**
  - `Icon/`:
    - `icon-192.png`: 192x192 표준 PWA 아이콘
    - `icon-512.png`: 512x512 고해상도 스플래시/설치 아이콘
    - `icon-maskable.png`: 512x512 안드로이드 적응형 마스커블(Maskable) 아이콘
    - `apple-touch-icon.png`: 180x180 iOS Safari 홈 화면 아이콘
    - `favicon-32.png`: 32x32 브라우저 탭 파비콘
  - `manifest.json`: 앱 이름("KIOST 교육연수동 공용숙소 포털"), 짧은 이름("KIOST 숙소"), 테마 색상(`#1e3a8a`), 독립 실행 모드(`standalone`), 4대 서식 바로가기 숏컷 정의
  - `sw.js`: 오프라인 캐싱 및 PWA 설치 요건을 충족하는 서비스 워커 생성
  - `index.html`: PWA 매니페스트, 테마 컬러, iOS 메타 태그, 파비콘 및 앱 아이콘 연결
  - `test.html`: 파비콘 및 아이콘 링크 연결
  - `app.js`: 서비스 워커 등록 로직 및 URL 파라미터(`?doc=...`) 기반 숏컷 진입 라우팅 추가
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. 멀티 플랫폼 아이콘 세트 생성:**
    - 원본 `Icon/icon.png`의 비율을 유지하면서 192x192, 512x512, 180x180, 32x32 및 마스커블 규격으로 자동 최적화 변환
  - **2. PWA 바로가기 및 설치 지원:**
    - 모바일(안드로이드 Chrome, iOS Safari) 및 PC(Chrome, Edge)에서 브라우저 메뉴의 [홈 화면에 추가] 또는 주소창의 [앱 설치] 버튼 활성화
    - 바로가기 숏컷 지원: 홈 화면 아이콘을 길게 누르면 입주신청서, 입주계, 연장신청서, 퇴거계로 바로 진입 가능
  - **3. 서비스 워커 등록:**
    - 네트워크 연결 상태와 무관하게 빠른 초기 로딩 및 정적 에셋 오프라인 캐시 지원
  - **4. Firebase 및 GitHub 배포 완료:**
    - `https://kiost-tcenter.web.app` 프로덕션 릴리스 완료
    - `https://github.com/sayaki4444/T-Center` 푸시 완료
- **테스트 및 검증 방법:**
  - **모바일/PC 브라우저 바로가기 추가 테스트:**
    - `https://kiost-tcenter.web.app` 접속
    - Chrome/Edge: 주소창 우측의 [설치] 아이콘 클릭 또는 메뉴에서 [홈 화면에 추가] / [앱으로 설치] 선택
---

### [2026-09-29 13:41] PWA 홈 화면 바로가기 명칭 변경 ('교육연수동 서류제출') 및 배포

- **작업 목적:** PWA 홈 화면 바로가기 및 설치 시 표시되는 명칭을 'KIOST 숙소'에서 사용자가 요청한 **'교육연수동 서류제출'** 로 변경 및 최신 버전 배포
- **수정/생성된 파일:**
  - `manifest.json`: `name` 및 `short_name`을 '교육연수동 서류제출'로 수정
  - `index.html`: iOS Safari 홈 화면 바로가기 메타 태그(`apple-mobile-web-app-title`)를 '교육연수동 서류제출'로 수정
  - `sw.js`: 캐시 버전을 `kiost-tcenter-v2`로 업데이트하여 브라우저 매니페스트 즉시 갱신
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - 홈 화면 바로가기 및 앱 설치 시 앱 이름이 **'교육연수동 서류제출'** 로 표시되도록 매니페스트 및 메타 태그 통일
  - Firebase Hosting 및 GitHub 최신 배포 완료
- **테스트 및 검증 방법:**
  - 모바일 브라우저(Safari/Chrome)에서 `https://kiost-tcenter.web.app` 접속
---

### [2026-09-29 14:24] 시스템 5대 보안 취약점 전면 보강 및 배포 완료

- **작업 목적:** XSS 인젝션 방지, HTTP 보안 헤더 적용, 이메일 오픈 릴레이 악용 차단, 클라이언트 담당자 메일 고정 및 입력 데이터 길이 제한 등 전면적인 보안 강화 조치 적용
- **수정/생성된 파일:**
  - `firebase.json`: `headers` 설정을 통해 5대 표준 HTTP 보안 헤더(X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS) 적용
  - `app.js`: XSS 방지 엔티티 이스케이프 함수(`escapeHtml`, `getSanitizedData`) 적용, 폼 필드별 최대 길이(`maxLength`) 제한 적용
  - `test.html`: XSS 방지 엔티티 이스케이프 함수(`escapeHtml`, `getSanitizedData`) 적용
  - `google-apps-script.js`: 수신자 이메일 도메인 검증(`@kiost.ac.kr` 한정), 이메일 헤더 CRLF 인젝션 방지 정제 및 15MB 페이로드 제한 적용
  - `WORK.md`: 작업 내역 누적 기록
- **주요 변경 사항:**
  - **1. DOM 기반 XSS 원천 차단:**
    - 사용자가 입력한 모든 필드 데이터가 서식 테이블 및 미리보기 HTML에 렌더링될 때 `&`, `<`, `>`, `"`, `'` 특수문자를 HTML 엔티티로 안전하게 변환
  - **2. HTTP 보안 헤더 활성화:**
    - `X-Frame-Options: SAMEORIGIN` (타 사이트 iframe 삽입을 통한 클릭재킹 차단)
    - `X-Content-Type-Options: nosniff` (MIME 스니핑 공격 차단)
    - `Referrer-Policy: strict-origin-when-cross-origin` (내부 경로 유출 방지)
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (불필요한 디바이스 권한 원천 비활성화)
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS 보안 연결 강제)
  - **3. 이메일 스팸 릴레이 악용 방지:**
    - 비인가 외부 메일 주소로의 임의 전송을 방지하기 위해 오직 KIOST 공식 도메인(`@kiost.ac.kr`)만 수신 가능하도록 서버사이드 검증 강화
  - **4. 입력 필드 글자 수 제한:**
    - textarea 500자, 일반 텍스트 100자, 전화번호 25자, 호실 10자로 제한하여 DoS 및 레이아웃 파손 방지
- **테스트 및 검증 방법:**
  - **보안 헤더 검증:** 터미널에서 `curl -I https://kiost-tcenter.web.app` 또는 파이썬 스크립트로 `x-frame-options`, `x-content-type-options`, `permissions-policy`가 정상 반환되는지 확인
  - **XSS 테스트:** 성명 란에 `<script>alert(1)</script>` 또는 `<img src=x onerror=alert(1)>` 입력 시 스크립트 실행 없이 안전하게 텍스트 그대로 표시되는지 확인
---

### [2026-09-29 16:32] 추가 보안 강화 (CSP 헤더 적용, 공용 PC 세션/메모리 자동 파기, 중복 제출 락 적용)

- **작업 목적:** Content Security Policy(CSP) 적용을 통한 비인가 외부 스크립트 실행 차단, 연수동 공용 PC 환경을 위한 60초 자동 세션 종료 및 메모리 소멸 체계 구축, 네트워크 지연 시 중복 메일 발송(Double-Submit) 방지 락 적용
- **수정/생성된 파일:**
  - `firebase.json`: `Content-Security-Policy` 헤더 추가 (허용된 리소스 외 비인가 스크립트/외부 유출 차단)
  - `index.html`: 제출 완료 화면(Step 4)에 공용 PC 개인정보 보호를 위한 60초 세션 파기 카운트다운 알림 배너 추가
  - `app.js`: 
    - 세션 및 메모리 완전 파기 함수(`resetAllSessionData`) 구현
    - 60초 자동 카운트다운 타이머(`startAutoResetTimer`) 연동
    - 브라우저 뒤로가기(`popstate`) 발생 시 민감 데이터 즉시 파기
    - 최종 메일 발송 버튼 클릭 시 중복 전송 방지 락(`isSubmitting`) 적용
- **주요 변경 사항:**
  - **1. Content Security Policy(CSP) 헤더 추가:**
    - `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://script.google.com https://script.googleusercontent.com; frame-ancestors 'self';`
  - **2. 공용 PC 환경 개인정보 메모리 완전 파기 및 자동 세션 종료:**
    - 제출 완료 시 60초 카운트다운이 시작되며, 60초 경과 시 작성 정보와 서명 데이터가 메모리에서 완전히 소멸되고 초기 화면으로 자동 복귀
    - '처음 화면으로' 버튼 클릭 및 브라우저 뒤로가기 시에도 `currentFormData`, 서명 캔버스, 폼 필드 입력값이 즉시 클리어되어 다음 사용자에게 노출되지 않음
  - **3. 중복 제출 락(Double-Submit Protection):**
    - 메일 발송 버튼 클릭 시 `isSubmitting` 플래그 및 버튼 클릭/포인터 차단(`pointer-events: none; opacity: 0.6;`)을 적용하여 다중 발송 및 서버 부하를 방어
- **테스트 및 검증 방법:**
  - `https://kiost-tcenter.web.app` 접속 후 서류 작성 및 제출 진행
  - 제출 완료 단계 진입 시 60초 카운트다운 배너가 표시되는지 확인
  - '처음 화면으로' 클릭 또는 60초 경과 후 재작성 화면 진입 시 이전 작성 데이터가 깔끔하게 초기화되어 있는지 확인
  - 메일 발송 버튼 클릭 시 중복 클릭이 차단되는지 확인
---

### [2026-09-29 16:52] 공용 PC 세션 자동 파기 시 얼럿(Alert) 팝업 제거 및 자연스러운 무음 화면 전환 적용

- **작업 목적:** 모바일 및 PC 브라우저에서 60초 세션 만료 시 브라우저 시스템 `alert()` 창이 강제로 뜨는 불편함을 제거하고, 팝업 없이 조용하고 자연스럽게 첫 화면으로 복귀하도록 UX 개선
- **수정/생성된 파일:**
  - `app.js`: `startAutoResetTimer` 내 `alert(...)` 코드 제거, 타이머 종료 시 조용히 메모리 파기(`resetAllSessionData`) 및 1단계 메인 뷰 전환 실행
- **주요 변경 사항:**
  - 60초 카운트다운 종료 시 팝업을 띄우지 않고 자연스럽게 초기 화면으로 이동하여 모바일 사용자 경험(UX) 최적화
- **테스트 및 검증 방법:**
  - 서류 제출 후 4단계 화면에서 60초 대기 시 팝업 차단/경고창 없이 부드럽게 첫 화면으로 복귀하는지 확인
---
