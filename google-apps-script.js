/**
 * [Google Apps Script 코드]
 * 
 * 1. https://script.google.com/ 에 접속하여 로그인합니다.
 * 2. 좌측 상단 [+ 새 프로젝트]를 클릭합니다.
 * 3. 기존의 Code.gs 내용을 모두 지우고, 아래 코드를 그대로 붙여넣습니다.
 * 4. 상단 [배포] -> [새 배포] 클릭
 *    - 톱니바퀴 아이콘 -> [웹 앱] 선택
 *    - 설명: 교육연수동 메일 발송
 *    - 다음 사용자 권한으로 실행: 나(내 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자(Anyone)] 필수 선택!
 * 5. [배포] 버튼 클릭 후 권한 승인(고급 -> 안전하지 않은 페이지로 이동 클릭)
 * 6. 생성된 '웹 앱 URL'(https://script.google.com/macros/s/.../exec)을 복사하여
 *    신청 시스템(test.html 또는 index.html)의 구글 스크립트 URL 설정에 넣으면 완료됩니다.
 */

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);

    // [보안 1] 페이로드 용량 제한 (최대 15MB Base64, DoS 방지)
    if (!data.pdfBase64 || typeof data.pdfBase64 !== 'string' || data.pdfBase64.length > 15 * 1024 * 1024) {
      throw new Error("유효하지 않거나 허용 용량을 초과한 파일 데이터입니다.");
    }

    // [보안 2] 이메일 헤더 인젝션 방지 및 수신자 도메인 검증 (외부 스팸 릴레이 악용 원천 차단)
    var targetEmail = (data.adminEmail || "").trim().toLowerCase();
    var ALLOWED_DOMAIN = "@kiost.ac.kr";
    if (!targetEmail || !targetEmail.endsWith(ALLOWED_DOMAIN)) {
      targetEmail = "yoonbs@kiost.ac.kr"; // 비인가 메일 유입 시 공식 담당자 메일로 강제 안전 격리
    }

    // [보안 3] 텍스트 헤더 정제 (CRLF 인젝션 방지)
    var applicantName = (data.applicantName || "신청자").replace(/[\r\n]/g, " ").trim().substring(0, 50);
    var docTitle = (data.docTitle || "공용숙소 신청서류").replace(/[\r\n]/g, " ").trim().substring(0, 100);
    var fileName = (data.fileName || "document.pdf").replace(/[\r\n]/g, "_").trim().substring(0, 100);
    var now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    // PDF Base64 디코딩
    var decodedPdf = Utilities.base64Decode(data.pdfBase64);
    var pdfBlob = Utilities.newBlob(decodedPdf, 'application/pdf', fileName);

    // 담당자에게 정식 이메일 발송
    MailApp.sendEmail({
      to: targetEmail,
      subject: "[교육연수동 서류제출] " + docTitle + " - " + applicantName,
      body: "안녕하세요, 교육연수동 담당자님.\n\n"
          + "공용숙소 간편 서류 제출 시스템을 통해 신규 서류가 접수되었습니다.\n\n"
          + "■ 제출 서류: " + docTitle + "\n"
          + "■ 신 청 인: " + applicantName + "\n"
          + "■ 접수 일시: " + now + "\n\n"
          + "작성 및 전자서명이 완료된 공문서 PDF 파일을 첨부하오니 확인 후 처리하여 주시기 바랍니다.\n\n"
          + "감사합니다.\n교육연수동 운영지원 포털",
      attachments: [pdfBlob]
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "이메일이 성공적으로 발송되었습니다."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("교육연수동 서류 전송 Google Apps Script 웹앱이 정상 작동 중입니다.");
}
