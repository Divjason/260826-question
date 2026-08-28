// ==========================================
// 제출 버튼
// ==========================================

const submitBtn = document.querySelector("#submitBtn");

// ==========================================
// 객관식 정답
// ==========================================

const answers = {
  q1: "2",
  q2: "1",
  q3: "2",
  q4: "3",
  q5: "3",
};

// ==========================================
// 객관식 문제 제목
// ==========================================

const questionTitles = {
  q1: "for 반복문",

  q2: "range() 함수",

  q3: "while 반복문",

  q4: "함수와 return",

  q5: "Git과 GitHub",
};

// ==========================================
// 객관식 보기 내용
// ==========================================

const optionTexts = {
  q1: {
    1: "0, 1, 2, 3, 4",

    2: "1, 2, 3, 4",

    3: "1, 2, 3, 4, 5",

    4: "0, 1, 2, 3",
  },

  q2: {
    1: "2, 4, 6, 8",

    2: "2, 4, 6, 8, 10",

    3: "2, 3, 4, 5, 6, 7, 8, 9",

    4: "0, 2, 4, 6, 8",
  },

  q3: {
    1: "0, 1, 2",

    2: "1, 2, 3",

    3: "1, 2, 3, 4",

    4: "무한 반복된다.",
  },

  q4: {
    1: "10",

    2: "20",

    3: "30",

    4: "아무것도 출력되지 않는다.",
  },

  q5: {
    1: "Git과 GitHub는 완전히 같은 프로그램이다.",

    2: "Git은 웹사이트이고 GitHub는 Python의 내장함수이다.",

    3: "Git은 버전 관리 시스템이고 GitHub는 Git 저장소를 온라인에서 관리·공유할 수 있는 서비스이다.",

    4: "GitHub를 사용하려면 반드시 Python 프로그램이 필요하다.",
  },
};

// ==========================================
// 제출 버튼 클릭
// ==========================================

submitBtn.addEventListener("click", async function () {
  // ========================================
  // 학생 이름 확인
  // ========================================

  const studentName = document.querySelector("#studentName").value.trim();

  if (studentName === "") {
    alert("이름을 입력해주세요.");

    return;
  }

  // ========================================
  // 객관식 답안 확인
  // ========================================

  const multipleChoiceAnswers = {};

  const wrongAnswers = [];

  let correctCount = 0;

  for (let i = 1; i <= 5; i++) {
    const key = "q" + i;

    const selected = document.querySelector(`input[name="${key}"]:checked`);

    // 선택하지 않은 문제가 있는 경우
    if (!selected) {
      alert(`${i}번 객관식 문제에 답해주세요.`);

      return;
    }

    const studentAnswer = selected.value;

    const correctAnswer = answers[key];

    // 학생이 제출한 답안 저장
    multipleChoiceAnswers[key] = {
      answerNumber: studentAnswer,

      answerText: optionTexts[key][studentAnswer],
    };

    // 정답 확인
    if (studentAnswer === correctAnswer) {
      correctCount++;
    } else {
      wrongAnswers.push({
        question: i,

        title: questionTitles[key],

        studentAnswerNumber: studentAnswer,

        studentAnswerText: optionTexts[key][studentAnswer],

        correctAnswerNumber: correctAnswer,

        correctAnswerText: optionTexts[key][correctAnswer],
      });
    }
  }

  // ========================================
  // 주관식 답안 확인
  // ========================================

  const subjectiveAnswers = {};

  for (let i = 6; i <= 10; i++) {
    const key = "q" + i;

    const textarea = document.querySelector(`textarea[name="${key}"]`);

    const answer = textarea.value.trim();

    // 주관식 미작성 확인
    if (answer === "") {
      alert(`${i}번 주관식 문제에 답해주세요.`);

      textarea.focus();

      return;
    }

    subjectiveAnswers[key] = answer;
  }

  // ========================================
  // 객관식 오답 개수
  // ========================================

  const wrongCount = 5 - correctCount;

  // ========================================
  // Apps Script로 전송할 데이터
  // ========================================

  const resultData = {
    testName: "Python Day 3 Mini Test",

    studentName: studentName,

    correctCount: correctCount,

    wrongCount: wrongCount,

    objectiveScore: correctCount * 10,

    multipleChoiceAnswers: multipleChoiceAnswers,

    wrongAnswers: wrongAnswers,

    subjectiveAnswers: subjectiveAnswers,

    submittedAt: new Date().toLocaleString("ko-KR"),
  };

  // ========================================
  // 제출 버튼 잠금
  // ========================================

  submitBtn.disabled = true;

  submitBtn.textContent = "제출 중...";

  try {
    // ======================================
    // Google Apps Script로 전송
    // ======================================

    await fetch(
      "https://script.google.com/macros/s/AKfycbzE4WtjTyX6FY5eiKYizps6RIBYEcz2mij0X1n-5xAbliIFypBTeeefpOB1Nd6t3SN1/exec",

      {
        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(resultData),
      },
    );

    // ======================================
    // 제출 완료
    // ======================================

    alert("답안이 정상적으로 제출되었습니다.");

    // 학생 화면에 결과 표시
    showResult(
      studentName,

      correctCount,

      wrongCount,
    );

    submitBtn.textContent = "제출 완료";
  } catch (error) {
    console.error(error);

    alert("제출 중 오류가 발생했습니다.");

    submitBtn.disabled = false;

    submitBtn.textContent = "답안 제출하기";
  }
});

// ==========================================
// 학생 화면 결과 표시
// ==========================================

function showResult(studentName, correctCount, wrongCount) {
  const result = document.querySelector("#result");

  result.innerHTML = `

    <h2>
      제출 완료
    </h2>

    <p>
      <strong>${studentName}</strong>님의
      답안이 정상적으로 제출되었습니다.
    </p>

    <hr>

    <p>
      객관식 정답 :
      <strong>${correctCount}개</strong>
    </p>

    <p>
      객관식 오답 :
      <strong>${wrongCount}개</strong>
    </p>

    <p>
      주관식 답안은 강사가 확인합니다.
    </p>

  `;

  result.classList.remove("hidden");

  result.scrollIntoView({
    behavior: "smooth",
  });
}
