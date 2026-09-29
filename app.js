/**
 * 교육연수동 간편 서류 제출 시스템
 * 공식 서식 규격 정밀 매핑, 개월수 자동계산, 호실 자동 '호' 변환, 환불계좌 분리, 연장회차 처리, PDF 변환 및 담당자 메일 발송
 */

// 기본 연동 Google Apps Script 웹 앱 URL (배포 완료)
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbzUALMG5SCQ3AB1KBBpTvJdlBKc1EClsuP4lVgSBGMWocUO7XK42TcQqDTZIEcWdU5IxQ/exec";

// 다국어 사전 (i18n)
const i18n = {
  ko: {
    badge_title: "교육연수동",
    brand_main: "간편 서류 제출 시스템",
    step1_title: "서류 선택",
    step2_title: "내용 작성 & 서명",
    step3_title: "공문서 검토 & 제출",
    select_heading: "제출하실 서류를 선택해주세요",
    select_desc: "교육연수동 공용숙소 관리지침에 따른 4대 서식 중 제출할 문서를 선택해 주시기 바랍니다.",
    doc_moveInApp_title: "입주신청서",
    doc_moveInApp_desc: "교육연수동 신규 입주 배정을 신청하는 정식 서류입니다.",
    doc_moveInPledge_title: "입주계 (서약서)",
    doc_moveInPledge_desc: "입주자 수칙 및 준수사항 서약서를 제출하는 서류입니다.",
    doc_extensionApp_title: "입주기간 연장신청서",
    doc_extensionApp_desc: "연수 일정에 따른 입주기간 연장을 신청하는 서류입니다.",
    doc_moveOutNotice_title: "퇴거계",
    doc_moveOutNotice_desc: "연수 종료 또는 퇴거 시 호실 반납 및 보증금 환불을 신청하는 서류입니다.",
    notice_template_title: "교육연수동 표준 양식 1:1 정밀 매핑 완료",
    notice_template_desc: "입력하신 모든 정보는 교육연수동 공식 서식 규격의 정확한 칸에 실시간 반영되어 정식 A4 PDF로 생성됩니다.",
    btn_start_write: "서류 작성하기 →",
    btn_back_list: "← 서류 선택으로",
    signature_title: "신청인 / 입주자 서명 (Signature)",
    signature_guide: "정자 또는 서명을 마우스/터치로 명확하게 작성해 주세요.",
    btn_clear_sig: "지우기",
    sig_warning: "※ 서명을 완료해야 제출 단계로 이동할 수 있습니다.",
    btn_cancel: "취소",
    btn_proceed_review: "공문서 검토하기 →",
    review_heading: "공식 서식 실시간 검토",
    review_desc: "발송될 정식 서류 양식을 확인해 주세요. 이상이 없으면 담당자에게 제출합니다.",
    admin_email_label: "담당자 수신 이메일:",
    admin_email_note: "※ 제출 시 담당자 메일함으로 전자서명된 PDF가 즉시 발송됩니다.",
    btn_edit_again: "← 수정하기",
    btn_download_pdf: "📄 공식 PDF 다운로드",
    btn_download_submitted_pdf: "📄 작성한 PDF 다운로드",
    btn_final_submit: "🚀 메일 발송",
    complete_title: "서류 제출이 완료되었습니다!",
    complete_desc: "작성하신 서류가 PDF로 변환되어 담당자에게 안전하게 전송되었습니다.",
    btn_go_home: "처음 화면으로",
    footer_copy: "교육연수동 관리부서 © 2026. All rights reserved.",
    applicant_name_label: "신청인(서명자):",
    security_reset_text: "공용 PC 개인정보 보호를 위해 <strong><span id=\"auto-reset-seconds\">60</span>초</strong> 후 세션 및 입력 데이터가 자동 파기됩니다."
  },
  en: {
    badge_title: "Training Center",
    brand_main: "Document Submission System",
    step1_title: "Select Document",
    step2_title: "Fill & Sign",
    step3_title: "Review & Submit",
    select_heading: "Please select a document",
    select_desc: "Select a document to prepare in accordance with Training Center Residence Regulation.",
    doc_moveInApp_title: "Residence Application",
    doc_moveInApp_desc: "Official application form for dormitory accommodation.",
    doc_moveInPledge_title: "Move-in Confirmation / Pledge",
    doc_moveInPledge_desc: "Official pledge form to comply with all residence terms.",
    doc_extensionApp_title: "Extension of Period of Stay",
    doc_extensionApp_desc: "Application for extending the accommodation period.",
    doc_moveOutNotice_title: "Residence Move-out Notice",
    doc_moveOutNotice_desc: "Notice to vacate the room and request refund settlement.",
    notice_template_title: "Official Layout 1:1 Matched",
    notice_template_desc: "All entered information is accurately bound to the exact cells of the official Training Center regulation template.",
    btn_start_write: "Start Form →",
    btn_back_list: "← Back to Document Selection",
    signature_title: "Signature of Applicant / Resident",
    signature_guide: "Please sign clearly in the box below using your mouse or touch screen.",
    btn_clear_sig: "Clear",
    sig_warning: "※ Please complete your signature before proceeding.",
    btn_cancel: "Cancel",
    btn_proceed_review: "Review Official Document →",
    review_heading: "Review Official Document",
    review_desc: "Please review the official document before final dispatch to the administrator.",
    admin_email_label: "Recipient Administrator Email:",
    admin_email_note: "※ The signed official PDF will be transmitted directly to the administrator upon submission.",
    btn_edit_again: "← Edit Form",
    btn_download_pdf: "📄 Download Official PDF",
    btn_download_submitted_pdf: "📄 Download Submitted PDF",
    btn_final_submit: "🚀 Send Email",
    complete_title: "Submission Completed!",
    complete_desc: "Your official document has been converted to PDF and sent to the administrator.",
    btn_go_home: "Return to Home",
    footer_copy: "Training Center Residence Management Office © 2026. All rights reserved.",
    applicant_name_label: "Applicant / Signer:",
    security_reset_text: "For public PC privacy, session and form data will be purged in <strong><span id=\"auto-reset-seconds\">60</span>s</strong>."
  }
};

// 사용호실 숫자 입력 시 자동으로 '호' 또는 'Room ' 붙여주는 헬퍼
function formatRoomNumber(val, lang = 'ko') {
  if (!val) return '';
  const clean = String(val).trim();
  const numOnly = clean.replace(/[^0-9]/g, '');
  if (!numOnly) return clean;
  return lang === 'ko' ? `${numOnly}호` : `Room ${numOnly}`;
}

// [보안] XSS 방지 HTML 엔티티 이스케이프
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSanitizedData(data) {
  if (!data || typeof data !== 'object') return {};
  const sanitized = {};
  for (const key of Object.keys(data)) {
    sanitized[key] = escapeHtml(data[key]);
  }
  return sanitized;
}

// 날짜 간 개월/일수 정밀 자동계산
function calculateDuration(startDateStr, endDateStr, lang = 'ko') {
  if (!startDateStr || !endDateStr) return '';
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return '';

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate() + 1;

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonths = (years * 12) + months;
  return lang === 'ko' ? `${totalMonths}개월 ${days}일` : `${totalMonths} months ${days} days`;
}

function formatDateDisplay(dateStr, lang) {
  if (!dateStr) return lang === 'ko' ? '년    월    일' : 'MM/DD/YYYY';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  if (lang === 'ko') {
    return `${d.getFullYear()}년 ${String(d.getMonth()+1).padStart(2,'0')}월 ${String(d.getDate()).padStart(2,'0')}일`;
  } else {
    return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
  }
}

// 4종 서류 스키마 및 원본 텍스트 정의
const docSchemas = {
  moveInApp: {
    ko: {
      title: "공용숙소 입주신청서",
      appendix: "[별표 제1호] 공용숙소 입주신청서",
      guideline: "(05-15) 공용숙소 관리지침",
      revision: "(개정 ‘13. 12. 30, ‘15. 03. 10, ‘16. 04. 15, ‘17. 10. 20, ‘18. 07. 01, ‘22. 7. 15 개정 2025. 2. 1.)",
      fixedNotice: "✓ [고정] 구분: <strong>부산본원</strong> | 숙소형태: <strong>교육연수동</strong>",
      footnotes: `* 현거주지 : 본인의 주민등록상 주소지<br>* 본거주지 : 미혼인 경우 부모, 기혼인 경우 배우자, 독신인 경우 본인의 주민등록상 주소지(공고일 이전)`,
      leadText: "공용숙소관리지침에 의거 위와 같이 공용숙소 입주를 신청하오니 허가하여 주시기 바랍니다.",
      attachments: `첨부 ： 주민등록등본 1부, 본인 및 부양가족 재산세 미과세 증명원 각1부<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;외국인등록증(외국인 경우) 또는 여권사본 1부`,
      signerLabel: "신청인 ：",
      recipient: "한국해양과학기술원장 귀하"
    },
    en: {
      title: "Residence Application",
      appendix: "Appendix 1 (Amended on Dec. 30, 2013; Mar. 10, 2015; April 15, 2016; October 20, 2017; Amended on July 1, 2018)",
      guideline: "Residence Regulation (05-15)",
      revision: "Korea Institute of Ocean Science & Technology",
      fixedNotice: "✓ [Fixed] Region: <strong>KIOST Premise</strong> | Type: <strong>Education and Training Center</strong>",
      footnotes: `* The current address means the address as shown in the resident registration certificate of an applicant.<br>* The home address means the address as shown in the resident registration certificate of an applicant’s parents (if an applicant is single), the address as shown in the resident registration certificate of an applicant’s spouse (if an applicant is married), or the address as shown in the resident registration certificate of an applicant (if an applicant is single and has a home separate from a family), pertaining to an applicant’s status prior to the date of notification.`,
      leadText: "Please accept my application for KIOST residence as below in accordance with the Residence Regulation:",
      attachments: `Attachments: one copy of a family relation certificate, one copy of a resident registration certificate (of an applicant including the history of change of address), one copy of a resident registration certificate (of an applicant’s spouse or parents including the history of change of address) or one copy of an alien registration card (if an applicant is a foreigner)<br>A copy of a passport for foreigners.`,
      signerLabel: "Signature of Applicant :",
      recipient: "To President of the Korea Institute of Ocean Science & Technology (KIOST)"
    },
    fields: [
      { id: "applicant_name", label: { ko: "성명", en: "Applicant Full Name" }, type: "text", required: true, fullWidth: false },
      { id: "affiliation", label: { ko: "소속", en: "Company / Institute" }, type: "text", required: true, fullWidth: false },
      { id: "position", label: { ko: "직급", en: "Title / Position" }, type: "text", required: true, fullWidth: false },
      { id: "contact", label: { ko: "연락처", en: "Phone Number" }, type: "tel", placeholder: "010-0000-0000", required: true, fullWidth: false },
      { id: "nationality", label: { ko: "외국인 국적", en: "Nationality (Foreigner)" }, type: "text", required: false, fullWidth: false },
      { id: "alien_no", label: { ko: "외국인 등록번호 / 여권번호", en: "Alien Reg. No / Passport" }, type: "text", required: false, fullWidth: false },
      { id: "current_addr", label: { ko: "현거주지 (주민등록상)", en: "Current Address" }, type: "text", required: true, fullWidth: true },
      { id: "home_addr", label: { ko: "본거주지 (부모/배우자 주소지)", en: "Home Address" }, type: "text", required: true, fullWidth: true },
      { id: "start_date", label: { ko: "입주 희망 시작일", en: "Desired Move-in Start Date" }, type: "date", required: true, fullWidth: false },
      { id: "end_date", label: { ko: "입주 희망 종료일", en: "Desired Move-in End Date" }, type: "date", required: true, fullWidth: false }
    ]
  },
  moveInPledge: {
    ko: {
      title: "공용숙소 입주계",
      appendix: "[별표 제3호] 공용숙소 입주계 (개정 ‘15. 03. 10, 2025. 2. 1.)",
      guideline: "(05-15) 공용숙소 관리지침",
      revision: "",
      fixedNotice: "✓ [고정] 사용숙소: <strong>교육연수동</strong>",
      leadText: "본인은 공용숙소 입주에 있어 관리지침에 의한 제사항을 준수할 것을 서약하며 이에 입주계를 제출합니다.",
      pledgeItems: [
        "1. 입주 공용숙소는 사용목적 이외에는 사용하지 아니한다.",
        "2. 입주후 전거 및 퇴거의 사유가 발생하였을 때에는 규정된 기일내에 공용숙소를 깨끗한 상태로 인계한다.",
        "3. 선량한 사용자로서의 의무를 다하여 공용숙소의 보호유지, 화재의 예방, 전기 · 수도 등의 절약, 공용숙소 내의 질서유지에 최선을 다한다.",
        "4. 공용숙소 사용료 및 고의 또는 과실로 인한 공용숙소 시설 파손 등에 따른 수리비용을 부담한다.",
        "5. 공용숙소 시설의 무단 원상 변경행위를 하지 아니한다.",
        "6. 기타 공용숙소 관리지침에 규정된 제사항을 준수한다."
      ],
      signerLabel: "입주자 ：",
      recipient: "한국해양과학기술원 원장 귀하"
    },
    en: {
      title: "Residence Move-In Form",
      appendix: "Appendix 3 (Amended on Mar. 10, 2015)",
      guideline: "Residence Regulation (05-15)",
      revision: "Korea Institute of Ocean Science & Technology",
      fixedNotice: "✓ [Fixed] Name of Residence: <strong>Education and Training Center</strong>",
      leadText: "I would like to move in to KIOST residence and therefore am submitting this move-in form as follows:",
      pledgeIntro: "I acknowledge that I agree to abide by the Residence Regulation and accept the following terms and conditions:",
      pledgeItems: [
        "1. I will not use my residence for purposes other than its original purpose.",
        "2. I will return the keys within the specified period should there be any reasons for transfer or move-out.",
        "3. I will do my best to preserve and maintain the condition of my residence, prevent fire, reduce the consumption of utilities including electricity and water and keep an order inside residence, thereby fulfilling my duty of care and responsibilities as a resident.",
        "4. I will be responsible for residence fees and cost of repairing any damages caused, intentionally or negligently, to residential facilities",
        "5. I will not make any alterations or modifications to the exterior or interior of my residence without permission.",
        "6. I will comply with any other provisions of the Residence Regulation."
      ],
      signerLabel: "Signature of Resident :",
      recipient: "To President of the Korea Institute of Ocean Science & Technology (KIOST)"
    },
    fields: [
      { id: "affiliation", label: { ko: "소속", en: "Company / Institute" }, type: "text", required: true, fullWidth: false },
      { id: "position", label: { ko: "직급", en: "Title / Position" }, type: "text", required: true, fullWidth: false },
      { id: "applicant_name", label: { ko: "성명", en: "Applicant Full Name" }, type: "text", required: true, fullWidth: false },
      { id: "room_no", label: { ko: "배정 호실 (숫자만 입력)", en: "Assigned Room No. (digits only)" }, type: "text", isRoom: true, placeholder: "예: 308", required: true, fullWidth: false },
      { id: "nationality", label: { ko: "외국인 국적", en: "Nationality (Foreigner)" }, type: "text", required: false, fullWidth: false },
      { id: "passport_no", label: { ko: "여권번호 / 외국인등록번호", en: "Passport / Alien Reg. No." }, type: "text", required: false, fullWidth: false },
      { id: "start_date", label: { ko: "입주 시작일", en: "Stay Start Date" }, type: "date", required: true, fullWidth: false },
      { id: "end_date", label: { ko: "입주 종료일", en: "Stay End Date" }, type: "date", required: true, fullWidth: false },
      { id: "refund_account_num", label: { ko: "환불계좌 (은행명 및 계좌번호)", en: "Refund Bank & Account No." }, type: "text", placeholder: "예: 국민은행 123-456-7890", required: true, fullWidth: false },
      { id: "refund_account_holder", label: { ko: "환불계좌 예금주", en: "Account Holder Name" }, type: "text", placeholder: "예: 홍길동", required: true, fullWidth: false }
    ]
  },
  extensionApp: {
    ko: {
      title: "공용숙소 입주기간 연장신청서",
      appendix: "[별표 제2호] 공용숙소 입주기간 연장신청서 (개정 ‘13. 12. 30, 개정 ‘15. 03. 10)",
      guideline: "(05-15) 공용숙소 관리지침",
      revision: "",
      fixedNotice: "✓ [고정] 사용숙소: <strong>교육연수동</strong>",
      leadText: "공용숙소 관리지침에 의거 공용숙소 입주기간을 위와 같이 연장코자 하오니 허가하여 주시기 바랍니다.",
      signerLabel: "신청인 ：",
      recipient: "한국해양과학기술원 원장 귀하"
    },
    en: {
      title: "Application for Extension of Period of Stay",
      appendix: "Appendix 2 (Amended on Dec. 30, 2013; Amended on Mar. 10, 2015)",
      guideline: "Residence Regulation (05-15)",
      revision: "Korea Institute of Ocean Science & Technology",
      fixedNotice: "✓ [Fixed] Name of Residence: <strong>Education and Training Center</strong>",
      leadText: "Please accept my application for the extension of the period of stay in KIOST residence as below in accordance with the Residence Regulation:",
      signerLabel: "Signature of Applicant :",
      recipient: "To President of the Korea Institute of Ocean Science & Technology (KIOST)"
    },
    fields: [
      { id: "affiliation", label: { ko: "소속", en: "Company / Institute" }, type: "text", required: true, fullWidth: false },
      { id: "position", label: { ko: "직급", en: "Title / Position" }, type: "text", required: true, fullWidth: false },
      { id: "applicant_name", label: { ko: "성명", en: "Applicant Full Name" }, type: "text", required: true, fullWidth: false },
      { id: "contact", label: { ko: "연락처", en: "Phone Number" }, type: "tel", required: true, fullWidth: false },
      { id: "room_no", label: { ko: "사용호실 (숫자만 입력)", en: "Room No. (digits only)" }, type: "text", isRoom: true, placeholder: "예: 308", required: true, fullWidth: false },
      { id: "initial_move_in", label: { ko: "최초입주일", en: "First Move-in Date" }, type: "date", required: true, fullWidth: false },
      { id: "cur_start_date", label: { ko: "현재 입주 시작일", en: "Current Stay Start Date" }, type: "date", required: true, fullWidth: false },
      { id: "cur_end_date", label: { ko: "현재 입주 종료일", en: "Current Stay End Date" }, type: "date", required: true, fullWidth: false },
      { id: "ext_start_date", label: { ko: "연장 희망 시작일", en: "Desired Extension Start Date" }, type: "date", required: true, fullWidth: false },
      { id: "ext_end_date", label: { ko: "연장 희망 종료일", en: "Desired Extension End Date" }, type: "date", required: true, fullWidth: false },
      { id: "extend_count", label: { ko: "연장회차 (예: 1)", en: "No. of extensions applied" }, type: "text", placeholder: "예: 1", required: true, fullWidth: true }
    ]
  },
  moveOutNotice: {
    ko: {
      title: "공용숙소 퇴거계",
      appendix: "[별표 제5호] 공용숙소 퇴거계 (개정 ‘13. 12. 30, 개정 ‘15. 03. 10, 2025. 2. 1.)",
      guideline: "(05-15) 공용숙소 관리지침",
      revision: "",
      fixedNotice: "✓ [고정] 사용숙소: <strong>교육연수동</strong>",
      leadText: "상기인은 위와 같은 사유로 공용숙소를 퇴거하고자 퇴거계를 제출합니다.",
      guidance: "숙소 확인: (확인일자)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(확인부서명)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(확인자)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(인)",
      signerLabel: "퇴거자 ：",
      recipient: "한국해양과학기술원 원장 귀하"
    },
    en: {
      title: "Residence Move-Out Form",
      appendix: "Appendix 4 (Amended on Dec. 30, 2013; Amended on Mar. 10, 2015)",
      guideline: "Residence Regulation (05-15)",
      revision: "Korea Institute of Ocean Science & Technology",
      fixedNotice: "✓ [Fixed] Name of Residence: <strong>KIOST Trading Center</strong>",
      leadText: "I would like to move out of KIOST residence due to the reasons stated below and therefore am submitting this move-out form as follows:",
      guidance: "",
      signerLabel: "Signature of Resident :",
      recipient: "To President of the Korea Institute of Ocean Science & Technology (KIOST)"
    },
    fields: [
      { id: "affiliation", label: { ko: "소속", en: "Company / Institute" }, type: "text", required: true, fullWidth: false },
      { id: "position", label: { ko: "직급", en: "Title / Position" }, type: "text", required: true, fullWidth: false },
      { id: "applicant_name", label: { ko: "성명", en: "Applicant Full Name" }, type: "text", required: true, fullWidth: true },
      { id: "room_no", label: { ko: "사용호실 (숫자만 입력)", en: "Room No. (digits only)" }, type: "text", isRoom: true, placeholder: "예: 308", required: true, fullWidth: false },
      { id: "move_out_date", label: { ko: "퇴거 예정일", en: "Date of Move-out" }, type: "date", required: true, fullWidth: false },
      { id: "nationality", label: { ko: "외국인 국적", en: "Nationality (Foreigner)" }, type: "text", required: false, fullWidth: false },
      { id: "passport_no", label: { ko: "외국인등록번호 / 여권번호", en: "Passport / Alien Reg. No." }, type: "text", required: false, fullWidth: false },
      { id: "move_out_reason", label: { ko: "퇴거 사유", en: "Reasons for Move-out" }, type: "textarea", placeholder: "구체적인 퇴거 사유를 입력하세요.", required: true, fullWidth: true },
      { id: "refund_amount", label: { ko: "환불금액 (해당 시)", en: "Refund Amount (if any)" }, type: "text", placeholder: "정산 후 확정 시 기재", required: false, fullWidth: false },
      { id: "refund_account_num", label: { ko: "환불계좌 (은행명 및 계좌번호)", en: "Refund Bank & Account No." }, type: "text", placeholder: "예: 국민은행 123-456-7890", required: true, fullWidth: false },
      { id: "refund_account_holder", label: { ko: "환불계좌 예금주", en: "Account Holder Name" }, type: "text", placeholder: "예: 홍길동", required: true, fullWidth: true }
    ]
  }
};

let currentLang = 'ko';
let selectedDocType = null;
let currentFormData = {};
let signatureDataUrl = null;
let isDrawing = false;
let sigCanvas, sigCtx;

const views = {
  select: document.getElementById('view-select-doc'),
  form: document.getElementById('view-form'),
  review: document.getElementById('view-review'),
  complete: document.getElementById('view-complete')
};
const stepItems = document.querySelectorAll('.step-item');

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initDocSelection();
  initSignaturePad();
  initFormEvents();
  initReviewEvents();
  applyLanguage(currentLang);

  // PWA shortcut / URL parameter navigation
  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doc');
  if (docParam && docSchemas[docParam]) {
    selectDocType(docParam);
  }

  const emailInput = document.getElementById('admin-email-input');
  if (emailInput) emailInput.value = "yoonbs@kiost.ac.kr";

  const gasInput = document.getElementById('gas-url-input');
  if (gasInput) {
    const saved = localStorage.getItem('kiost_gas_url') || DEFAULT_GAS_URL;
    gasInput.value = saved;
    gasInput.addEventListener('change', (e) => {
      localStorage.setItem('kiost_gas_url', e.target.value.trim());
    });
  }
});

function initLanguageSwitcher() {
  const btnKo = document.getElementById('btn-lang-ko');
  const btnEn = document.getElementById('btn-lang-en');

  btnKo.addEventListener('click', () => switchLang('ko'));
  btnEn.addEventListener('click', () => switchLang('en'));
}

function switchLang(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-lang-${lang}`).classList.add('active');
  applyLanguage(lang);
  if (selectedDocType) {
    renderFormFields(selectedDocType);
  }
}

function applyLanguage(lang) {
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  const badge = document.getElementById('badge-title');
  const brand = document.getElementById('brand-main');
  if (badge) badge.textContent = dict.badge_title;
  if (brand) brand.textContent = dict.brand_main;

  const resetText = document.getElementById('security-reset-text');
  if (resetText && dict.security_reset_text) {
    resetText.innerHTML = dict.security_reset_text;
  }
}

let autoResetTimerId = null;
let isSubmitting = false;

function resetAllSessionData() {
  if (autoResetTimerId) {
    clearInterval(autoResetTimerId);
    autoResetTimerId = null;
  }
  currentFormData = {};
  clearSignature();

  // Reset dynamic form inputs
  const dynamicForm = document.getElementById('dynamic-form');
  if (dynamicForm) {
    dynamicForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.value = '';
    });
  }

  // Clear preview & cached sensitive DOM
  const paperElement = document.getElementById('printable-document');
  if (paperElement) paperElement.innerHTML = '';

  const summaryBox = document.getElementById('complete-summary');
  if (summaryBox) summaryBox.innerHTML = '';

  console.log('[Security] All sensitive personal data and signatures successfully wiped from memory.');
}

function startAutoResetTimer(durationSeconds = 60) {
  if (autoResetTimerId) {
    clearInterval(autoResetTimerId);
    autoResetTimerId = null;
  }
  let remaining = durationSeconds;
  const secSpan = document.getElementById('auto-reset-seconds');
  if (secSpan) secSpan.textContent = remaining;

  autoResetTimerId = setInterval(() => {
    remaining--;
    const currentSpan = document.getElementById('auto-reset-seconds');
    if (currentSpan) currentSpan.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(autoResetTimerId);
      autoResetTimerId = null;
      resetAllSessionData();
      setStep(1);
      alert(currentLang === 'ko' ? '🔒 공용 PC 개인정보 보호를 위해 작성된 데이터가 모두 안전하게 파기되었으며 첫 화면으로 이동했습니다.' : '🔒 Session and form data have been securely wiped for public PC privacy.');
    }
  }, 1000);
}

function setStep(stepNumber) {
  const stepProgress = document.querySelector('.step-progress');
  if (stepProgress) {
    stepProgress.style.display = (stepNumber === 4) ? 'none' : 'flex';
  }

  stepItems.forEach(item => {
    const s = parseInt(item.getAttribute('data-step'), 10);
    if (s === stepNumber) item.classList.add('active');
    else item.classList.remove('active');
  });

  Object.values(views).forEach(v => v.classList.remove('active'));
  if (stepNumber === 1) views.select.classList.add('active');
  if (stepNumber === 2) views.form.classList.add('active');
  if (stepNumber === 3) views.review.classList.add('active');
  if (stepNumber === 4) {
    views.complete.classList.add('active');
    startAutoResetTimer(60);
  } else {
    if (autoResetTimerId) {
      clearInterval(autoResetTimerId);
      autoResetTimerId = null;
    }
  }

  // 즉시 최상단으로 강제 스크롤
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // DOM 렌더링 리플로우 후 완료 화면으로 즉시 스크롤 안착
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (stepNumber === 4 && views.complete) {
      views.complete.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, 40);
}

function initDocSelection() {
  const cards = document.querySelectorAll('.doc-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const docType = card.getAttribute('data-doc-type');
      selectDocument(docType);
    });
  });

  document.getElementById('btn-back-to-select').addEventListener('click', () => setStep(1));
  document.getElementById('btn-cancel-form').addEventListener('click', () => setStep(1));
}

function selectDocument(docType) {
  selectedDocType = docType;
  renderFormFields(docType);
  clearSignature();
  setStep(2);
}

function renderFormFields(docType) {
  const schema = docSchemas[docType];
  const langSchema = schema[currentLang];
  
  document.getElementById('current-form-title').textContent = langSchema.title;
  document.getElementById('current-form-lang-tag').textContent = currentLang === 'ko' ? '한국어 양식' : 'English Form';

  const container = document.getElementById('dynamic-form-fields');
  container.innerHTML = '';

  schema.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = `form-group ${field.fullWidth ? 'col-full' : ''}`;

    const label = document.createElement('label');
    label.className = 'form-label';
    label.setAttribute('for', field.id);
    label.textContent = field.label[currentLang];
    if (field.required) {
      const star = document.createElement('span');
      star.className = 'required-badge';
      star.textContent = ' *';
      label.appendChild(star);
    }
    group.appendChild(label);

    let inputEl;
    if (field.type === 'textarea') {
      inputEl = document.createElement('textarea');
      inputEl.className = 'form-control';
      inputEl.id = field.id;
      inputEl.name = field.id;
      inputEl.rows = 2;
      inputEl.maxLength = 500;
      if (field.placeholder) inputEl.placeholder = field.placeholder;
      if (field.required) inputEl.required = true;
      if (currentFormData[field.id]) inputEl.value = currentFormData[field.id];
    } else {
      inputEl = document.createElement('input');
      inputEl.type = field.type;
      inputEl.className = 'form-control';
      inputEl.id = field.id;
      inputEl.name = field.id;
      if (field.type === 'tel') {
        inputEl.maxLength = 25;
      } else if (field.isRoom) {
        inputEl.maxLength = 10;
      } else {
        inputEl.maxLength = 100;
      }
      if (field.placeholder) inputEl.placeholder = field.placeholder;
      if (field.required) inputEl.required = true;
      if (currentFormData[field.id]) inputEl.value = currentFormData[field.id];
    }

    if (field.id === 'affiliation' && currentLang === 'en') {
      inputEl.value = 'KIOST';
      inputEl.readOnly = true;
      inputEl.style.backgroundColor = '#f1f5f9';
      inputEl.style.color = '#334155';
      inputEl.style.fontWeight = '600';
      currentFormData[field.id] = 'KIOST';
    }

    // Auto format room number on blur
    if (field.isRoom) {
      inputEl.addEventListener('blur', (e) => {
        const formatted = formatRoomNumber(e.target.value, currentLang);
        e.target.value = formatted;
        currentFormData[field.id] = formatted;
      });
    }

    group.appendChild(inputEl);
    container.appendChild(group);
  });
}

function initSignaturePad() {
  sigCanvas = document.getElementById('signature-pad');
  sigCtx = sigCanvas.getContext('2d');
  
  sigCanvas.width = 600;
  sigCanvas.height = 180;
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.strokeStyle = '#000000';

  function getPos(e) {
    const cRect = sigCanvas.getBoundingClientRect();
    const scaleX = sigCanvas.width / cRect.width;
    const scaleY = sigCanvas.height / cRect.height;
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - cRect.left) * scaleX,
        y: (e.touches[0].clientY - cRect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - cRect.left) * scaleX,
      y: (e.clientY - cRect.top) * scaleY
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    document.getElementById('sig-warning').classList.remove('show');
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  }

  function stopDraw() {
    if (isDrawing) {
      isDrawing = false;
      signatureDataUrl = sigCanvas.toDataURL('image/png');
    }
  }

  sigCanvas.addEventListener('mousedown', startDraw);
  sigCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
  sigCanvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw);

  document.getElementById('btn-clear-sig').addEventListener('click', clearSignature);
}

function clearSignature() {
  if (!sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  signatureDataUrl = null;
}

function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');
  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
  return !pixelBuffer.some(color => color !== 0);
}

function initFormEvents() {
  const form = document.getElementById('doc-submission-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!signatureDataUrl || isCanvasBlank(sigCanvas)) {
      const sigWarn = document.getElementById('sig-warning');
      sigWarn.classList.add('show');
      sigCanvas.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const schema = docSchemas[selectedDocType];
    currentFormData = {};
    schema.fields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        let val = el.value.trim();
        if (field.isRoom) val = formatRoomNumber(val, currentLang);
        currentFormData[field.id] = val;
      }
    });

    renderReviewPage();
    setStep(3);
  });
}

// 7. Render Review Table - EXACT 1:1 WITH HWP / DOCX
function renderReviewPage() {
  const schema = docSchemas[selectedDocType];
  const langSchema = schema[currentLang];
  const isKo = (currentLang === 'ko');

  const paperSheet = document.getElementById('printable-document');
  paperSheet.style.fontFamily = isKo ? "'Nanum Myeongjo', 'Batang', serif" : "'Times New Roman', 'Pretendard', serif";

  // Document Top Header
  let headerHtml = `
    <div style="font-size:0.88rem; font-weight:700; color:#111; margin-bottom:2px;">${langSchema.appendix}</div>
    <div style="font-size:0.8rem; color:#333; margin-bottom:6px;">${langSchema.guideline}</div>
    ${langSchema.revision ? `<div style="font-size:0.75rem; color:#555; margin-bottom:16px;">${langSchema.revision}</div>` : ''}
    <h2 style="font-size:1.85rem; font-weight:900; letter-spacing:6px; text-align:center; border-bottom:2px solid #000; padding-bottom:12px; margin: 12px 0 24px;">${langSchema.title}</h2>
  `;

  // 영문 DOCX 원본 규격: 제목 바로 아래에 수신처 및 신청 문구 배치
  if (!isKo) {
    headerHtml += `
      <div style="font-size:0.95rem; font-weight:700; color:#000; margin-bottom:8px; text-align:left;">${langSchema.recipient},</div>
      <div style="font-size:0.9rem; line-height:1.6; color:#222; margin-bottom:18px; text-align:left;">${langSchema.leadText}</div>
    `;
  }
  document.querySelector('.paper-header').innerHTML = headerHtml;

  // Table Generation
  const tableContainer = document.getElementById('review-table-container');
  tableContainer.innerHTML = generateAuthenticTableHtml(selectedDocType, currentLang, getSanitizedData(currentFormData));

  // Subtext / Clauses / Attachments - STRICT ORDER
  const pledgeBox = document.getElementById('review-pledge-text');
  let clausesHtml = '';

  if (selectedDocType === 'moveInApp') {
    if (isKo) {
      // [입주신청서 HWP 원본 위치 순서]
      // 1. 표 하단 주석 (* 현거주지, * 본거주지)
      clausesHtml += `<div style="font-size:0.82rem; line-height:1.8; color:#000; margin-bottom:20px; text-align:left;">${langSchema.footnotes}</div>`;
      // 2. 공용숙소관리지침에 의거...
      clausesHtml += `<div style="text-align:center; font-size:0.95rem; font-weight:700; margin:22px 0; letter-spacing:0.5px;">${langSchema.leadText}</div>`;
      // 3. 첨부서류
      clausesHtml += `<div style="font-size:0.82rem; line-height:1.8; color:#000; margin-bottom:20px; text-align:left;">${langSchema.attachments}</div>`;
    } else {
      // [입주신청서 DOCX 원본 위치 순서]
      clausesHtml += `<div style="font-size:0.82rem; line-height:1.8; color:#000; margin-bottom:16px; text-align:left;">${langSchema.footnotes}</div>`;
      clausesHtml += `<div style="font-size:0.82rem; line-height:1.8; color:#000; margin-bottom:20px; text-align:left;">${langSchema.attachments}</div>`;
    }
  } else if (selectedDocType === 'moveInPledge') {
    if (isKo) {
      clausesHtml += `<div style="text-align:center; font-size:0.95rem; font-weight:700; margin:20px 0 16px;">${langSchema.leadText}</div>`;
    } else if (langSchema.pledgeIntro) {
      clausesHtml += `<div style="font-size:0.83rem; line-height:1.65; color:#000; margin-top:10px; margin-bottom:8px; text-align:left; font-weight:600; font-family:'Times New Roman', serif;">${langSchema.pledgeIntro}</div>`;
    }
    clausesHtml += `<ul style="list-style:none; padding:0; line-height:1.75; font-size:0.83rem; text-align:left; font-family:${isKo ? 'inherit' : '\'Times New Roman\', serif'};">`;
    langSchema.pledgeItems.forEach(it => {
      clausesHtml += `<li style="margin-bottom:4px;">${it}</li>`;
    });
    clausesHtml += `</ul>`;
  } else {
    if (isKo) {
      clausesHtml += `<div style="text-align:center; font-size:0.95rem; font-weight:700; margin:22px 0;">${langSchema.leadText}</div>`;
    }
    if (langSchema.guidance) {
      clausesHtml += `<div style="font-size:0.83rem; line-height:1.8; color:#000; margin-top:16px; text-align:center;">${langSchema.guidance}</div>`;
    }
  }
  pledgeBox.innerHTML = clausesHtml;

  // Date (HWP/DOCX 원본: 우측 정렬)
  const now = new Date();
  const dateStr = isKo 
    ? `${now.getFullYear()}년 ${String(now.getMonth()+1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`
    : `Date: ${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}<br><span style="font-size:0.75rem; font-weight:normal; color:#555;">(MM/DD/YY)</span>`;

  // Footer: Date(우측) + Signature(우측) + Recipient(국문: 좌측 하단 / 영문: 상단 배치 완료)
  const applicantName = escapeHtml(currentFormData['applicant_name'] || '-');
  const footerEl = document.querySelector('.paper-footer');
  
  if (isKo) {
    footerEl.innerHTML = `
      <div style="width:100%; display:flex; flex-direction:column; gap:16px;">
        <div style="text-align:right; font-size:1.05rem; font-weight:700; letter-spacing:2px; padding-right:12px;">${dateStr}</div>
        <div style="display:flex; justify-content:flex-end; align-items:center; gap:16px; font-weight:700; padding-right:12px;">
          <span>${langSchema.signerLabel} <strong style="display:inline-block; min-width:60px; text-align:center;">${applicantName}</strong></span>
          <div style="width:140px; height:55px; border:1px dashed #999; display:flex; align-items:center; justify-content:center; background:#fafafa;">
            <img src="${signatureDataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="Signature" />
          </div>
        </div>
        <div style="font-size:1.35rem; font-weight:900; letter-spacing:4px; margin-top:14px; text-align:left;">${langSchema.recipient}</div>
      </div>
    `;
  } else {
    footerEl.innerHTML = `
      <div style="width:100%; display:flex; flex-direction:column; gap:16px; font-family:'Times New Roman', serif;">
        <div style="text-align:right; font-size:0.95rem; font-weight:600; padding-right:12px;">${dateStr}</div>
        <div style="display:flex; justify-content:flex-end; align-items:center; gap:16px; font-weight:600; padding-right:12px;">
          <span>${langSchema.signerLabel} <strong style="display:inline-block; min-width:60px; text-align:center;">${applicantName}</strong></span>
          <div style="width:140px; height:55px; border:1px dashed #999; display:flex; align-items:center; justify-content:center; background:#fafafa;">
            <img src="${signatureDataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="Signature" />
          </div>
        </div>
      </div>
    `;
  }
}

// Generate Authentic Table HTML matching HWP/DOCX Alignment (Center/Left/Right)
function generateAuthenticTableHtml(formType, lang, data) {
  if (lang === 'en') {
    return generateEnglishDocxTableHtml(formType, data);
  }

  const isKo = true;
  const roomFormatted = formatRoomNumber(data.room_no, 'ko');

  // 1. 입주신청서 - HWP [별표 제1호] 100% 원본 정렬
  if (formType === 'moveInApp') {
    const duration = calculateDuration(data.start_date, data.end_date, 'ko');
    const startDisp = formatDateDisplay(data.start_date, 'ko');
    const endDisp = formatDateDisplay(data.end_date, 'ko');

    return `
      <table style="width:100%; border-collapse:collapse; border:2px solid #000; font-size:0.88rem; margin-bottom:16px;">
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '구   분' : 'Region'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${isKo ? '부산본원' : 'KIOST (Busan HQ)'}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '숙소형태' : 'Type of Residence'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${isKo ? '교육연수동' : 'Education and Training Center (Dormitory)'}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '성    명' : 'Applicant Full Name'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '소   속' : 'Company / Institute'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.affiliation || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '직    급' : 'Title / Position'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '연 락 처' : 'Phone No.'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.contact || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '현거주지' : 'Current Address'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.current_addr || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '본거주지' : 'Home Address'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.home_addr || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '외 국 인' : 'Foreigner Info'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; text-align:left; vertical-align:middle;">
            ${isKo ? '국적(' : 'Nationality('} <span style="font-weight:600;">${data.nationality || '          '}</span> ),&nbsp;&nbsp;&nbsp; 
            ${isKo ? '외국인 등록번호(' : 'Alien Reg. / Passport('} <span style="font-weight:600;">${data.alien_no || '                        '}</span> )
          </td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '입주 희망기간' : 'Desired Period of Stay'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            ${startDisp} ～ ${endDisp} ${duration ? `&nbsp;&nbsp;(${duration})` : (isKo ? '&nbsp;&nbsp;(    개월    일)' : '&nbsp;&nbsp;(     months    days)')}
          </td>
        </tr>
      </table>
    `;
  } 
  // 2. 입주계: HWP [별표 제3호] 100% 원본 정렬
  else if (formType === 'moveInPledge') {
    const startDisp = formatDateDisplay(data.start_date, lang);
    const endDisp = formatDateDisplay(data.end_date, lang);
    let refundCombined = '-';
    if (data.refund_account_num || data.refund_account_holder) {
      refundCombined = `${data.refund_account_num || ''} ${data.refund_account_holder ? `(${isKo ? '예금주: ' : 'Holder: '}${data.refund_account_holder})` : ''}`.trim();
    }

    return `
      <table style="width:100%; border-collapse:collapse; border:2px solid #000; font-size:0.88rem; margin-bottom:16px;">
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '소    속' : 'Company / Institute'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.affiliation || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '직    급' : 'Title / Position'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '성    명' : 'Applicant Full Name'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
        </tr>
        <tr>
          <th rowspan="2" style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '외 국 인' : 'Foreigner Info'}</th>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:20%; text-align:center; vertical-align:middle;">${isKo ? '국  적' : 'Nationality'}</th>
          <td colspan="2" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.nationality || '-'}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '여권번호' : 'Passport / Alien Reg.'}</th>
          <td colspan="2" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.passport_no || '-'}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '사용숙소' : 'Name of Residence'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${isKo ? '교육연수동' : 'Education and Training Center'}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '사용호실' : 'Room No.'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '입주기간' : 'Period of Stay'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${startDisp} ～ ${endDisp}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '환불계좌' : 'Refund Account'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${refundCombined}</td>
        </tr>
      </table>
    `;
  } 
  // 3. 연장신청서 - HWP [별표 제2호] 100% 원본 정렬
  else if (formType === 'extensionApp') {
    const curDuration = calculateDuration(data.cur_start_date, data.cur_end_date, lang);
    const extDuration = calculateDuration(data.ext_start_date, data.ext_end_date, lang);
    const curStartDisp = formatDateDisplay(data.cur_start_date, lang);
    const curEndDisp = formatDateDisplay(data.cur_end_date, lang);
    const extStartDisp = formatDateDisplay(data.ext_start_date, lang);
    const extEndDisp = formatDateDisplay(data.ext_end_date, lang);
    const initDisp = formatDateDisplay(data.initial_move_in, lang);

    return `
      <table style="width:100%; border-collapse:collapse; border:2px solid #000; font-size:0.88rem; margin-bottom:16px;">
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '소    속' : 'Company / Institute'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.affiliation || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '직    급' : 'Title / Position'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '성     명' : 'Applicant Full Name'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '연 락 처' : 'Phone No.'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.contact || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '사용숙소' : 'Name of Residence'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${isKo ? '교육연수동' : 'Education and Training Center'}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '사용호실' : 'Room No.'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '최초입주일' : 'First Move-in Date'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${initDisp}</td>
        </tr>
        <tr>
          <th rowspan="2" style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '입주기간' : 'Period of Stay'}</th>
          <th style="background:#f8fafc; border:1px solid #333; padding:8px 10px; font-size:0.83rem; text-align:center; vertical-align:middle;">${isKo ? '현재' : 'Until Now'}</th>
          <td colspan="2" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            ${curStartDisp} ～ ${curEndDisp} ${curDuration ? `&nbsp;&nbsp;(${curDuration})` : (isKo ? '&nbsp;&nbsp;(    개월    일)' : '&nbsp;&nbsp;(     months    days)')}
          </td>
        </tr>
        <tr>
          <th style="background:#f8fafc; border:1px solid #333; padding:8px 10px; font-size:0.83rem; text-align:center; vertical-align:middle;">${isKo ? '연장희망' : 'Desired Extension'}</th>
          <td colspan="2" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            ${extStartDisp} ～ ${extEndDisp} ${extDuration ? `&nbsp;&nbsp;(${extDuration})` : (isKo ? '&nbsp;&nbsp;(    개월    일)' : '&nbsp;&nbsp;(     months    days)')}
          </td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '연장회차' : 'No. of extensions'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            ${isKo ? `( <span style="display:inline-block; min-width:30px; text-align:center;">${data.extend_count || '   '}</span> ) 회차` : `No. of extensions applied for this time: ( ${data.extend_count || '   '} )`}
          </td>
        </tr>
      </table>
    `;
  } 
  // 4. 퇴거계 - HWP [별표 제5호] 100% 원본 정렬
  else if (formType === 'moveOutNotice') {
    const moveOutDisp = formatDateDisplay(data.move_out_date, lang);
    let refundCombined = '-';
    if (data.refund_account_num || data.refund_account_holder) {
      refundCombined = `${data.refund_account_num || ''} ${data.refund_account_holder ? `(${isKo ? '예금주: ' : 'Holder: '}${data.refund_account_holder})` : ''}`.trim();
    }

    return `
      <table style="width:100%; border-collapse:collapse; border:2px solid #000; font-size:0.88rem; margin-bottom:16px;">
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '소    속' : 'Company / Institute'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.affiliation || ''}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '직   급' : 'Title / Position'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '성    명' : 'Applicant Full Name'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '사용숙소' : 'Name of Residence'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${isKo ? '교육연수동' : 'Education and Training Center'}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '사용호실' : 'Room No.'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '외 국 인' : 'Foreigner Info'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; text-align:left; vertical-align:middle;">
            ${isKo ? '국적(' : 'Nationality('} <span style="font-weight:600;">${data.nationality || '          '}</span> ),&nbsp;&nbsp;&nbsp; 
            ${isKo ? '여권번호(' : 'Alien Reg./Passport('} <span style="font-weight:600;">${data.passport_no || '                        '}</span> )
          </td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '퇴거예정일' : 'Date of Move-out'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${moveOutDisp}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '퇴거사유' : 'Reasons for Move-out'}</th>
          <td colspan="3" style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.move_out_reason || ''}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '환불금액' : 'Refund Amount'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.refund_amount || '-'}</td>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; width:22%; text-align:center; vertical-align:middle;">${isKo ? '환불계좌' : 'Refund Account'}</th>
          <td style="border:1px solid #333; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${refundCombined}</td>
        </tr>
        <tr>
          <th style="background:#f3f4f6; border:1px solid #333; padding:8px 10px; text-align:center; vertical-align:middle;">${isKo ? '숙소 확인' : 'Inspection'}</th>
          <td colspan="3" style="font-size:0.8rem; color:#444; text-align:center; vertical-align:middle;">
            ${isKo ? '(확인일자)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(확인부서명)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(확인자)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(인)' : '(Date) ____________  (Dept) ____________  (Inspector) ____________ (Sign)'}
          </td>
        </tr>
      </table>
    `;
  }
}

// Generate Official English Table HTML - 100% EXACT TO DOCX TEMPLATES
function generateEnglishDocxTableHtml(formType, data) {
  const roomFormatted = formatRoomNumber(data.room_no, 'en');

  // 1. Residence Application (DOCX Appendix 1)
  if (formType === 'moveInApp') {
    const duration = calculateDuration(data.start_date, data.end_date, 'en');
    const startDisp = formatDateDisplay(data.start_date, 'en');
    const endDisp = formatDateDisplay(data.end_date, 'en');

    return `
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; font-size:0.8rem; margin-bottom:14px; font-family:'Times New Roman', serif;">
        <colgroup>
          <col style="width: 20%;">
          <col style="width: 24%;">
          <col style="width: 10%;">
          <col style="width: 18%;">
          <col style="width: 14%;">
          <col style="width: 14%;">
        </colgroup>
        <!-- Row 0 & 1: KIOST Top Premises and Type of Residence -->
        <tr>
          <td rowspan="2" style="border:1px solid #000; padding:6px 6px; font-weight:700; text-align:center; vertical-align:middle; background:#f9fafb;">KIOST</td>
          <td colspan="3" style="border:1px solid #000; padding:6px 8px; font-size:0.75rem; vertical-align:middle; line-height:1.5;">
            Staff residence: on-KIOST premise &#9675;&nbsp;&nbsp;off-KIOST premise &#9675;<br>
            Dormitory:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on-KIOST premise &#9675;&nbsp;&nbsp;off-KIOST premise &#9675;
          </td>
          <td rowspan="2" style="border:1px solid #000; padding:6px 6px; font-weight:700; text-align:center; vertical-align:middle; background:#f9fafb;">Type of residence</td>
          <td rowspan="2" style="border:1px solid #000; padding:6px 6px; text-align:center; vertical-align:middle;">-</td>
        </tr>
        <tr>
          <td style="border:1px solid #000; padding:5px 6px; font-size:0.75rem; text-align:center; vertical-align:middle;">Executive Residence &#9675;</td>
          <td colspan="2" style="border:1px solid #000; padding:5px 6px; font-size:0.75rem; font-weight:700; text-align:center; vertical-align:middle; background:#f0fdf4;">Education and Training Center (Dormitory) &#9745;</td>
        </tr>
        <!-- Row 2: South Sea Research Institute -->
        <tr>
          <td style="border:1px solid #000; padding:4px 6px; font-weight:600; text-align:center; vertical-align:middle; background:#f9fafb; font-size:0.73rem;">South Sea Research Institute</td>
          <td colspan="3" style="border:1px solid #000; padding:4px 6px; font-size:0.72rem; vertical-align:middle;">
            Staff residence: on-KIOST premise &#9675; off-KIOST premise &#9675; &nbsp;|&nbsp; Dormitory: on-KIOST premise &#9675; off-KIOST premise &#9675;
          </td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; font-size:0.73rem;">Type of residence</td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle;">-</td>
        </tr>
        <!-- Row 3: East Sea Research Institute -->
        <tr>
          <td style="border:1px solid #000; padding:4px 6px; font-weight:600; text-align:center; vertical-align:middle; background:#f9fafb; font-size:0.73rem;">East Sea Research Institute</td>
          <td colspan="3" style="border:1px solid #000; padding:4px 6px; font-size:0.72rem; vertical-align:middle;">
            Staff residence: on-KIOST premise &#9675; off-KIOST premise &#9675; &nbsp;|&nbsp; Dormitory: on-KIOST premise &#9675; off-KIOST premise &#9675;
          </td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; font-size:0.73rem;">Type of residence</td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle;">-</td>
        </tr>
        <!-- Row 4: Ulleungdo·Dokdo Ocean Science Station -->
        <tr>
          <td style="border:1px solid #000; padding:4px 6px; font-weight:600; text-align:center; vertical-align:middle; background:#f9fafb; font-size:0.73rem;">Ulleungdo·Dokdo Ocean Science Station</td>
          <td colspan="3" style="border:1px solid #000; padding:4px 6px; font-size:0.72rem; vertical-align:middle;">
            Staff residence: on-KIOST premise &#9675; off-KIOST premise &#9675; &nbsp;|&nbsp; Dormitory: on-KIOST premise &#9675; off-KIOST premise &#9675;
          </td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; font-size:0.73rem;">Type of residence</td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle;">-</td>
        </tr>
        <!-- Row 5: Jeju Research Institute -->
        <tr>
          <td style="border:1px solid #000; padding:4px 6px; font-weight:600; text-align:center; vertical-align:middle; background:#f9fafb; font-size:0.73rem;">Jeju Research Institute</td>
          <td colspan="3" style="border:1px solid #000; padding:4px 6px; font-size:0.72rem; vertical-align:middle;">
            Staff residence: on-KIOST premise &#9675; off-KIOST premise &#9675; &nbsp;|&nbsp; Dormitory: on-KIOST premise &#9675; off-KIOST premise &#9675;
          </td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle; font-size:0.73rem;">Type of residence</td>
          <td style="border:1px solid #000; padding:4px 6px; text-align:center; vertical-align:middle;">-</td>
        </tr>
        <!-- Row 6: Applicant’s full name & Name of company/institute -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Applicant’s full name</th>
          <td colspan="2" style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
          <th colspan="2" style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Name of company/institute</th>
          <td style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:center; vertical-align:middle;">KIOST</td>
        </tr>
        <!-- Row 7: Title/Position & Phone no. -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Title/Position</th>
          <td colspan="2" style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
          <th colspan="2" style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Phone no.</th>
          <td style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:center; vertical-align:middle;">${data.contact || ''}</td>
        </tr>
        <!-- Row 8: Current address -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Current address</th>
          <td colspan="5" style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:left; vertical-align:middle;">${data.current_addr || ''}</td>
        </tr>
        <!-- Row 9: Home address -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Home address</th>
          <td colspan="5" style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:left; vertical-align:middle;">${data.home_addr || ''}</td>
        </tr>
        <!-- Row 10: Foreigner information -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Foreigner information</th>
          <td colspan="5" style="border:1px solid #000; padding:6px 8px; text-align:left; vertical-align:middle;">
            Nationality: <strong style="display:inline-block; min-width:120px; border-bottom:1px solid #555; padding:0 4px; text-align:center;">${data.nationality || '          '}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Alien Registration No.: <strong style="display:inline-block; min-width:160px; border-bottom:1px solid #555; padding:0 4px; text-align:center;">${data.alien_no || '                    '}</strong>
          </td>
        </tr>
        <!-- Row 11: Desired period of stay -->
        <tr>
          <th style="border:1px solid #000; padding:6px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Desired period of stay</th>
          <td colspan="5" style="border:1px solid #000; padding:6px 8px; font-weight:600; text-align:center; vertical-align:middle;">
            From <u>&nbsp;${startDisp}&nbsp;</u> to <u>&nbsp;${endDisp}&nbsp;</u> &nbsp;&nbsp;(${duration ? duration : '_____ months _____ days'})<br>
            <span style="font-size:0.75rem; font-weight:normal; color:#555;">(MM/DD/YY)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(MM/DD/YY)</span>
          </td>
        </tr>
      </table>
    `;
  }
  // 2. Residence Move-In Form (DOCX Appendix 3)
  else if (formType === 'moveInPledge') {
    const startDisp = formatDateDisplay(data.start_date, 'en');
    const endDisp = formatDateDisplay(data.end_date, 'en');

    return `
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; font-size:0.85rem; margin-bottom:14px; font-family:'Times New Roman', serif;">
        <colgroup>
          <col style="width: 18%;">
          <col style="width: 13%;">
          <col style="width: 29%;">
          <col style="width: 20%;">
          <col style="width: 20%;">
        </colgroup>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of company/institute</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">KIOST</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Title/Position</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Applicant’s full name</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.applicant_name || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Foreigner information</th>
          <th style="border:1px solid #000; padding:8px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Nationality</th>
          <td style="border:1px solid #000; padding:8px 8px; font-weight:600; text-align:center; vertical-align:middle;">${data.nationality || '-'}</td>
          <th style="border:1px solid #000; padding:8px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Alien Registration No.</th>
          <td style="border:1px solid #000; padding:8px 8px; font-weight:600; text-align:center; vertical-align:middle;">${data.passport_no || '-'}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of residence</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">Education and Training Center</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Room no.</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Period of stay</th>
          <td colspan="4" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">From ${startDisp} to ${endDisp}</td>
        </tr>
      </table>
    `;
  }
  // 3. Application for Extension of Period of Stay (DOCX Appendix 2)
  else if (formType === 'extensionApp') {
    const curDuration = calculateDuration(data.cur_start_date, data.cur_end_date, 'en');
    const extDuration = calculateDuration(data.ext_start_date, data.ext_end_date, 'en');
    const curStartDisp = formatDateDisplay(data.cur_start_date, 'en');
    const curEndDisp = formatDateDisplay(data.cur_end_date, 'en');
    const extStartDisp = formatDateDisplay(data.ext_start_date, 'en');
    const extEndDisp = formatDateDisplay(data.ext_end_date, 'en');
    const initDisp = formatDateDisplay(data.initial_move_in, 'en');

    return `
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; font-size:0.85rem; margin-bottom:14px; font-family:'Times New Roman', serif;">
        <colgroup>
          <col style="width: 9%;">
          <col style="width: 10%;">
          <col style="width: 32%;">
          <col style="width: 18%;">
          <col style="width: 31%;">
        </colgroup>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of company/institute</th>
          <td style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">KIOST</td>
          <th style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Title/Position</th>
          <td style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Applicant’s full name</th>
          <td style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.applicant_name || ''}</td>
          <th style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Phone no.</th>
          <td style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.contact || ''}</td>
        </tr>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of residence Center</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:left; vertical-align:middle;">Education and Training Center</td>
        </tr>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Room no.</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:left; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">First move-in date</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:left; vertical-align:middle;">${initDisp}</td>
        </tr>
        <tr>
          <th rowspan="2" style="border:1px solid #000; padding:7px 8px; background:#f9fafb; text-align:center; vertical-align:middle;">Period of stay</th>
          <th style="border:1px solid #000; padding:7px 8px; background:#f9fafb; text-align:center; vertical-align:middle; font-size:0.8rem;">Until now</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            From <u>&nbsp;${curStartDisp}&nbsp;</u> to <u>&nbsp;${curEndDisp}&nbsp;</u> &nbsp;&nbsp;(${curDuration || '_____ months _____ days'})<br>
            <span style="font-size:0.75rem; font-weight:normal; color:#555;">(MM/DD/YY)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(MM/DD/YY)</span>
          </td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:7px 8px; background:#f9fafb; text-align:center; vertical-align:middle; font-size:0.8rem;">Desired extension period</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            From <u>&nbsp;${extStartDisp}&nbsp;</u> to <u>&nbsp;${extEndDisp}&nbsp;</u> &nbsp;&nbsp;(${extDuration || '_____ months _____ days'})<br>
            <span style="font-size:0.75rem; font-weight:normal; color:#555;">(MM/DD/YY)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(MM/DD/YY)</span>
          </td>
        </tr>
        <tr>
          <th colspan="2" style="border:1px solid #000; padding:7px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">No. of extensions applied for this time</th>
          <td colspan="3" style="border:1px solid #000; padding:7px 10px; font-weight:600; text-align:center; vertical-align:middle;">
            ( <span style="display:inline-block; min-width:30px; text-align:center;">${data.extend_count || '   '}</span> )
          </td>
        </tr>
      </table>
    `;
  }
  // 4. Residence Move-Out Form (DOCX Appendix 4)
  else if (formType === 'moveOutNotice') {
    const moveOutDisp = formatDateDisplay(data.move_out_date, 'en');

    return `
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; font-size:0.85rem; margin-bottom:14px; font-family:'Times New Roman', serif;">
        <colgroup>
          <col style="width: 18%;">
          <col style="width: 36%;">
          <col style="width: 18%;">
          <col style="width: 28%;">
        </colgroup>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of company/institute</th>
          <td style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">KIOST</td>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Title/Position</th>
          <td style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:center; vertical-align:middle;">${data.position || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Applicant’s full name</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${data.applicant_name || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Name of residence</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">KIOST Trading Center</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Room no.</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">${roomFormatted || ''}</td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Foreigner information</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; text-align:left; vertical-align:middle;">
            Nationality: <strong style="display:inline-block; min-width:110px; border-bottom:1px solid #555; padding:0 4px; text-align:center;">${data.nationality || '          '}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Alien Registration No.: <strong style="display:inline-block; min-width:150px; border-bottom:1px solid #555; padding:0 4px; text-align:center;">${data.passport_no || '                    '}</strong>
          </td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Date of move-out</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle;">
            <u style="display:inline-block; min-width:110px; text-align:center;">${moveOutDisp}</u> &nbsp;&nbsp;<span style="font-size:0.75rem; color:#555; font-weight:normal;">(MM/DD/YY)</span>
          </td>
        </tr>
        <tr>
          <th style="border:1px solid #000; padding:8px 10px; background:#f9fafb; text-align:left; vertical-align:middle;">Reasons for move-out</th>
          <td colspan="3" style="border:1px solid #000; padding:8px 10px; font-weight:600; text-align:left; vertical-align:middle; min-height:48px;">${data.move_out_reason || ''}</td>
        </tr>
      </table>
    `;
  }
}

// 8. PDF Generation & Dispatch
function initReviewEvents() {
  document.getElementById('btn-back-to-edit').addEventListener('click', () => setStep(2));

  // Review step PDF download button (if present)
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', async () => {
      await generateAndHandlePdf('download');
    });
  }

  // Submitted complete step PDF download button
  const btnDownloadSubmitted = document.getElementById('btn-download-submitted-pdf');
  if (btnDownloadSubmitted) {
    btnDownloadSubmitted.addEventListener('click', async () => {
      await generateAndHandlePdf('download');
    });
  }

  document.getElementById('btn-final-submit').addEventListener('click', async () => {
    if (isSubmitting) return; // [보안 4번] 중복 전송 락
    isSubmitting = true;

    const adminEmail = document.getElementById('admin-email-input').value.trim() || 'yoonbs@kiost.ac.kr';
    const btn = document.getElementById('btn-final-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.6';
    btn.textContent = currentLang === 'ko' ? 'PDF 생성 및 메일 발송 중...' : 'Generating PDF & Dispatching...';

    try {
      const pdfBlob = await generateAndHandlePdf('blob');
      await simulateEmailDispatch(adminEmail, pdfBlob);

      renderCompleteSummary(adminEmail);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert(currentLang === 'ko' ? '처리 중 오류가 발생했습니다: ' + err.message : 'Error occurred: ' + err.message);
    } finally {
      isSubmitting = false;
      btn.disabled = false;
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
      btn.textContent = originalText;
    }
  });

  document.getElementById('btn-go-home').addEventListener('click', () => {
    // [보안 3번] 세션 및 서명 메모리 즉시 완전 파기
    resetAllSessionData();
    setStep(1);
  });

  // [보안 3번] 브라우저 뒤로가기 발생 시 완료 단계 잔여 정보 보호
  window.addEventListener('popstate', () => {
    if (views.complete && views.complete.classList.contains('active')) {
      resetAllSessionData();
    }
  });
}

async function generateAndHandlePdf(mode = 'download') {
  const paperElement = document.getElementById('printable-document');
  const schema = docSchemas[selectedDocType];
  const docTitle = schema[currentLang].title;
  const fileName = `${docTitle}_${currentFormData['applicant_name'] || '신청'}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const canvas = await html2canvas(paperElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

  if (mode === 'download') {
    pdf.save(fileName);
    return null;
  } else if (mode === 'blob') {
    return pdf.output('blob');
  }
}

// Helper: Convert Blob to Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Real Google Apps Script Email Dispatch or Fallback Simulation
async function simulateEmailDispatch(targetEmail, pdfBlob) {
  const gasUrlInput = document.getElementById('gas-url-input');
  const gasUrl = (gasUrlInput && gasUrlInput.value.trim()) || localStorage.getItem('kiost_gas_url') || DEFAULT_GAS_URL;
  const schema = docSchemas[selectedDocType];
  const docTitle = schema[currentLang].title;
  const applicantName = currentFormData['applicant_name'] || '신청자';
  const fileName = `${docTitle}_${applicantName}.pdf`;

  if (gasUrl) {
    // Send to Google Apps Script Web App
    const pdfBase64 = await blobToBase64(pdfBlob);
    const payload = {
      adminEmail: targetEmail,
      applicantName: applicantName,
      docTitle: docTitle,
      fileName: fileName,
      pdfBase64: pdfBase64
    };

    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    console.log(`[Google Apps Script Dispatched] Target: ${targetEmail}`);
    return true;
  } else {
    // Fallback simulation when no GAS URL is set
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[Simulation Dispatched] Target: ${targetEmail}, Size: ${(pdfBlob.size / 1024).toFixed(1)} KB`);
        resolve(true);
      }, 1200);
    });
  }
}

function renderCompleteSummary(adminEmail) {
  const schema = docSchemas[selectedDocType];
  const summaryBox = document.getElementById('complete-summary');
  const applicantName = currentFormData['applicant_name'] || '-';
  const now = new Date().toLocaleString();
  const gasUrlInput = document.getElementById('gas-url-input');
  const hasGasUrl = gasUrlInput && gasUrlInput.value.trim();

  summaryBox.innerHTML = `
    <p><strong>${currentLang === 'ko' ? '제출 서류:' : 'Submitted Document:'}</strong> ${schema[currentLang].title}</p>
    <p><strong>${currentLang === 'ko' ? '신청자 성명:' : 'Applicant Name:'}</strong> ${applicantName}</p>
    <p><strong>${currentLang === 'ko' ? '수신처:' : 'Recipient:'}</strong> ${currentLang === 'ko' ? '교육연수동 공용숙소 관리부서' : 'Training Center Residence Administration'}</p>
    <p><strong>${currentLang === 'ko' ? '제출 일시:' : 'Submitted At:'}</strong> ${now}</p>
    <p style="color: #059669; font-weight: 700; margin-top: 10px;">
      ${hasGasUrl 
        ? (currentLang === 'ko' ? '✓ 담당자 메일함으로 전자서명된 정식 PDF가 성공적으로 전송되었습니다.' : '✓ Official PDF with digital signature has been successfully transmitted to the administrator.')
        : (currentLang === 'ko' ? '✓ 서류가 정상 제출 처리되었습니다.' : '✓ Document submitted successfully.')
      }
    </p>
  `;
}

// Register PWA Service Worker for Offline Caching & Installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);
    }).catch((err) => {
      console.warn('[PWA] Service Worker registration failed:', err);
    });
  });
}
