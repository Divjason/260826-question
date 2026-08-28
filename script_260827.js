const submitBtn = document.querySelector("#submitBtn");

// ======================================
// 객관식 정답
// ======================================

const answers = {
  q1: "4",
  q2: "1",
  q3: "1",
  q4: "2",
  q5: "2",
};

// ======================================
// 문제 제목
// ======================================

const questionTitles = {
  q1: "문자열 함수와 메서드",
  q2: "문자열 인덱스",
  q3: "문자열 슬라이싱",
  q4: "strip() 메서드",
  q5: "리스트 메서드",
};

// ======================================
// 객관식 보기 내용
// 이메일에서 번호만 보이지 않게 하기 위함
// ======================================

const optionTexts = {
  q1: {
    1: 'len("Python")',
    2: '"Python".find("t")',
    3: '"banana".count("a")',
    4: '"Python".len()',
  },

  q2: {
    1: "P, t, n",
    2: "P, y, n",
    3: "P, t, o",
    4: "y, t, n",
  },

  q3: {
    1: "Data",
    2: "DataA",
    3: "ataA",
    4: "Dat",
  },

  q4: {
    1: "###Python###",
    2: "Python",
    3: "###Python",
    4: "Python###",
  },

  q5: {
    1: '["apple", "banana"]',
    2: '["apple", "grape", "banana"]',
    3: '["grape", "banana", "orange"]',
    4: '["apple", "grape", "banana", "orange"]',
  },
};

// ======================================
// 제출 버튼
// ======================================

submitBtn.addEventListener("click", async () => {
  // ----------------------------------
  // 학생 이름
  // ----------------------------------

  const studentName = document.querySelector("#studentName").value.trim();

  if (!studentName) {
    alert("이름을 입력해주세요.");

    return;
  }

  // ----------------------------------
  // 모든 문제 답변 여부 검사
  // ----------------------------------

  for (let i = 1; i <= 5; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (!selected) {
      alert(`${i}번 객관식 문제에 답해주세요.`);

      return;
    }
  }

  for (let i = 6; i <= 10; i++) {
    const answer = document.querySelector(`[name="q${i}"]`).value.trim();

    if (!answer) {
      alert(`${i}번 주관식 문제에 답해주세요.`);

      return;
    }
  }

  let correctCount = 0;

  let wrongCount = 0;

  const wrongAnswers = [];

  const multipleChoiceAnswers = {};

  // ======================================
  // 객관식 채점
  // ======================================

  for (let key in answers) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);

    const studentAnswer = selected.value;

    const correctAnswer = answers[key];

    // 학생이 입력한 모든 객관식 답안 저장
    multipleChoiceAnswers[key] = {
      answerNumber: studentAnswer,

      answerText: optionTexts[key][studentAnswer],
    };

    if (studentAnswer === correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;

      wrongAnswers.push({
        question: key.replace("q", ""),

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

  const subjectiveAnswers = {
    q6: document.querySelector('[name="q6"]').value,

    q7: document.querySelector('[name="q7"]').value,

    q8: document.querySelector('[name="q8"]').value,

    q9: document.querySelector('[name="q9"]').value,

    q10: document.querySelector('[name="q10"]').value,
  };

  // ======================================
  // 결과 데이터
  // ======================================

  const resultData = {
    testName: "Python Day 2 Mini Test",

    studentName,

    correctCount,

    wrongCount,

    objectiveScore: correctCount * 10,

    multipleChoiceAnswers,

    wrongAnswers,

    subjectiveAnswers,

    submittedAt: new Date().toLocaleString("ko-KR"),
  };

  console.log(resultData);

  // ======================================
  // Google Apps Script 전송
  // ======================================

  try {
    submitBtn.disabled = true;

    submitBtn.innerText = "제출 중...";

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

    alert(`${studentName}님의 답안이 제출되었습니다.`);

    showResult(studentName, correctCount, wrongCount);

    submitBtn.innerText = "제출 완료";
  } catch (error) {
    console.error(error);

    alert("제출 중 오류가 발생했습니다.");

    submitBtn.disabled = false;

    submitBtn.innerText = "제출하기";
  }
});

// ======================================
// 학생 화면 결과
// ======================================

function showResult(studentName, correctCount, wrongCount) {
  const result = document.querySelector("#result");

  result.classList.remove("hidden");

  result.innerHTML = `

    <h2>
      제출 완료
    </h2>

    <p>
      <strong>${studentName}</strong>님의
      답안이 정상적으로 제출되었습니다.
    </p>

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

  result.scrollIntoView({
    behavior: "smooth",
  });
}
