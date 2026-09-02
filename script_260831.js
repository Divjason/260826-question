// ==========================================
// Marketing Day 1 Mini Test
// ==========================================

const submitBtn = document.querySelector("#submitBtn");

// ==========================================
// 객관식 정답
// ==========================================

const answers = {
  q1: "2",
  q2: "3",
  q3: "3",
  q4: "2",
  q5: "2",
};

// ==========================================
// 문제 제목
// ==========================================

const questionTitles = {
  q1: "Data → Decision",

  q2: "Information과 Insight",

  q3: "정량적 데이터와 정성적 데이터",

  q4: "Meta Pixel",

  q5: "Pixel Event",
};

// ==========================================
// 객관식 보기 내용
// ==========================================

const optionTexts = {
  q1: {
    1: "Data → Insight → Information → Decision → Hypothesis",

    2: "Data → Information → Insight → Hypothesis → Decision",

    3: "Information → Data → Hypothesis → Insight → Decision",

    4: "Data → Hypothesis → Information → Decision → Insight",
  },

  q2: {
    1: "Data",

    2: "Information",

    3: "Insight",

    4: "Decision",
  },

  q3: {
    1: "광고 클릭 수 3,520회",

    2: "구매 전환율 3.2%",

    3: '고객 인터뷰에서 "배송비 때문에 구매를 망설였다"는 의견',

    4: "일평균 사이트 방문자 15,000명",
  },

  q4: {
    1: "웹사이트 디자인을 자동으로 변경하기 위해",

    2: "웹사이트 방문자의 행동 및 전환 이벤트를 측정하고 광고 최적화에 활용하기 위해",

    3: "Instagram 팔로워를 자동으로 증가시키기 위해",

    4: "상품 이미지를 Meta 광고 크기에 맞게 자동 변환하기 위해",
  },

  q5: {
    1: "모든 방문자의 이름과 전화번호를 알아내기 위해",

    2: "어떤 행동이 실제 구매 전환으로 이어지는지 측정하고 광고 성과 및 최적화에 활용하기 위해",

    3: "웹사이트 서버를 빠르게 만들기 위해",

    4: "경쟁사의 광고비를 알아내기 위해",
  },
};

// ==========================================
// 제출 버튼 클릭
// ==========================================

submitBtn.addEventListener("click", async function () {
  // ======================================
  // 학생 이름
  // ======================================

  const studentName = document.querySelector("#studentName").value.trim();

  if (studentName === "") {
    alert("이름을 입력해주세요.");

    document.querySelector("#studentName").focus();

    return;
  }

  // ======================================
  // 객관식 채점
  // ======================================

  const multipleChoiceAnswers = {};

  const wrongAnswers = [];

  let correctCount = 0;

  for (let i = 1; i <= 5; i++) {
    const key = "q" + i;

    const selected = document.querySelector(`input[name="${key}"]:checked`);

    // 미응답
    if (!selected) {
      alert(`${i}번 객관식 문제에 답해주세요.`);

      return;
    }

    const studentAnswer = selected.value;

    const correctAnswer = answers[key];

    // 학생 답안 저장
    multipleChoiceAnswers[key] = {
      answerNumber: studentAnswer,

      answerText: optionTexts[key][studentAnswer],
    };

    // 정답 여부
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

  // ======================================
  // 주관식 답안
  // ======================================

  const subjectiveAnswers = {};

  for (let i = 6; i <= 10; i++) {
    const key = "q" + i;

    const textarea = document.querySelector(`textarea[name="${key}"]`);

    const answer = textarea.value.trim();

    if (answer === "") {
      alert(`${i}번 주관식 문제에 답해주세요.`);

      textarea.focus();

      return;
    }

    subjectiveAnswers[key] = answer;
  }

  // ======================================
  // 결과 계산
  // ======================================

  const wrongCount = 5 - correctCount;

  const objectiveScore = correctCount * 10;

  // ======================================
  // Apps Script 전송 데이터
  // ======================================

  const resultData = {
    testName: "Marketing Day 1 Mini Test",

    studentName: studentName,

    correctCount: correctCount,

    wrongCount: wrongCount,

    objectiveScore: objectiveScore,

    multipleChoiceAnswers: multipleChoiceAnswers,

    wrongAnswers: wrongAnswers,

    subjectiveAnswers: subjectiveAnswers,

    submittedAt: new Date().toLocaleString("ko-KR"),
  };

  // ======================================
  // 제출 버튼 잠금
  // ======================================

  submitBtn.disabled = true;

  submitBtn.textContent = "제출 중...";

  try {
    // ====================================
    // Google Apps Script 전송
    // ====================================

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

    // ====================================
    // 제출 완료
    // ====================================

    alert("답안이 정상적으로 제출되었습니다.");

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
// 학생 결과 화면
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
