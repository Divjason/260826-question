// ==========================================
// Python Weekend Practice
// ==========================================

// 제출 버튼
const submitBtn = document.querySelector("#submitBtn");

// ==========================================
// 제출 버튼 클릭
// ==========================================

submitBtn.addEventListener("click", async function () {
  // ======================================
  // 1. 학생 이름 확인
  // ======================================

  const studentName = document.querySelector("#studentName").value.trim();

  if (studentName === "") {
    alert("이름을 입력해주세요.");

    document.querySelector("#studentName").focus();

    return;
  }

  // ======================================
  // 2. 제출 코드 확인
  // ======================================

  const practiceCode = document.querySelector("#practiceCode").value.trim();

  if (practiceCode === "") {
    alert("작성한 Python 코드를 입력해주세요.");

    document.querySelector("#practiceCode").focus();

    return;
  }

  // ======================================
  // 3. 너무 짧은 답안 방지
  // ======================================

  if (practiceCode.length < 100) {
    alert(
      "코드가 너무 짧습니다.\n" +
        "전체 프로그램 코드를 붙여넣었는지 확인해주세요.",
    );

    return;
  }

  // ======================================
  // 4. 자기 점검 체크박스 확인
  // ======================================

  const checkboxes = [
    "check1",
    "check2",
    "check3",
    "check4",
    "check5",
    "check6",
  ];

  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = document.getElementById(checkboxes[i]);

    if (!checkbox.checked) {
      alert("제출 전 자기 점검 항목을 모두 확인해주세요.");

      checkbox.focus();

      return;
    }
  }

  // ======================================
  // 5. 코드 사용 여부 간단 확인
  // ======================================

  const codeChecks = {
    list: practiceCode.includes("["),

    input: practiceCode.includes("input("),

    condition: practiceCode.includes("if "),

    forLoop: practiceCode.includes("for "),

    function: practiceCode.includes("def "),

    returnStatement: practiceCode.includes("return"),
  };

  // ======================================
  // 6. 누락된 주요 문법 확인
  // ======================================

  const missingItems = [];

  if (!codeChecks.list) {
    missingItems.push("리스트");
  }

  if (!codeChecks.input) {
    missingItems.push("input()");
  }

  if (!codeChecks.condition) {
    missingItems.push("if 조건문");
  }

  if (!codeChecks.forLoop) {
    missingItems.push("for 반복문");
  }

  if (!codeChecks.function) {
    missingItems.push("함수(def)");
  }

  if (!codeChecks.returnStatement) {
    missingItems.push("return");
  }

  // ======================================
  // 필수 문법 누락 시 확인
  // ======================================

  if (missingItems.length > 0) {
    const message =
      "다음 문법이 코드에서 확인되지 않습니다.\n\n" +
      missingItems.join(", ") +
      "\n\n그래도 제출하시겠습니까?";

    const confirmSubmit = confirm(message);

    if (!confirmSubmit) {
      return;
    }
  }

  // ======================================
  // 7. Apps Script 전송 데이터
  // ======================================

  const resultData = {
    assignmentName: "Python Week 1 Weekend Practice",

    assignmentTitle: "Python 카페 주문 관리 프로그램",

    studentName: studentName,

    practiceCode: practiceCode,

    codeLength: practiceCode.length,

    codeChecks: codeChecks,

    submittedAt: new Date().toLocaleString("ko-KR"),
  };

  // ======================================
  // 8. 제출 버튼 비활성화
  // ======================================

  submitBtn.disabled = true;

  submitBtn.textContent = "제출 중...";

  try {
    // ====================================
    // Google Apps Script로 전송
    // ====================================

    await fetch(
      "https://script.google.com/macros/s/AKfycbxifYR-iK_G8icqo_RpcHud5JV43F4ipQPKXHAx5ie2gbI1CNzG0ixrFdWZUxJVgTw/exec",

      {
        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(resultData),
      },
    );

    // ====================================
    // 제출 완료
    // ====================================

    alert("주말 실습이 정상적으로 제출되었습니다.");

    showResult(studentName, practiceCode);

    submitBtn.textContent = "제출 완료";
  } catch (error) {
    console.error(error);

    alert("제출 중 오류가 발생했습니다.\n" + "잠시 후 다시 시도해주세요.");

    submitBtn.disabled = false;

    submitBtn.textContent = "주말 실습 제출하기";
  }
});

// ==========================================
// 제출 결과 표시
// ==========================================

function showResult(studentName, practiceCode) {
  const result = document.querySelector("#result");

  // 코드 줄 수 계산
  const lineCount = practiceCode.split("\n").length;

  result.innerHTML = `

    <h2>
      제출 완료
    </h2>

    <p>
      <strong>${studentName}</strong>님의
      주말 종합 실습이 제출되었습니다.
    </p>

    <hr>

    <p>
      제출 코드 :
      <strong>${lineCount}줄</strong>
    </p>

    <p>
      제출한 코드는 강사가 확인한 후
      평가합니다.
    </p>

    <p>
      수고하셨습니다.
    </p>

  `;

  result.classList.remove("hidden");

  result.scrollIntoView({
    behavior: "smooth",
  });
}
