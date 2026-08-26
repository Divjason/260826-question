const submitBtn = document.querySelector("#submitBtn");

// ----------------------------
// 객관식 정답
// ----------------------------

const answers = {
  q1: "4",
  q2: "3",
  q3: "4",
  q4: "2",
  q5: "1",
};

// 문제 내용

const questionTitles = {
  q1: "Python 언어의 특징",
  q2: "변수와 값 할당",
  q3: "자료형(Data Type)",
  q4: "사칙연산자",
  q5: "비교연산자",
};

// ----------------------------
// 제출
// ----------------------------

submitBtn.addEventListener("click", async () => {
  const studentName = document.querySelector("#studentName").value.trim();

  // 이름 검사
  if (!studentName) {
    alert("이름을 입력해주세요.");

    return;
  }

  let correctCount = 0;

  let wrongCount = 0;

  const wrongAnswers = [];

  // ----------------------------
  // 객관식 채점
  // ----------------------------

  for (let key in answers) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);

    const studentAnswer = selected ? selected.value : "미응답";

    const correctAnswer = answers[key];

    if (studentAnswer === correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;

      wrongAnswers.push({
        question: key,

        title: questionTitles[key],

        studentAnswer,

        correctAnswer,
      });
    }
  }

  // ----------------------------
  // 주관식 답안
  // ----------------------------

  const subjectiveAnswers = {
    q6: document.querySelector('[name="q6"]').value,

    q7: document.querySelector('[name="q7"]').value,

    q8: document.querySelector('[name="q8"]').value,

    q9: document.querySelector('[name="q9"]').value,

    q10: document.querySelector('[name="q10"]').value,
  };

  // ----------------------------
  // 전송할 데이터
  // ----------------------------

  const resultData = {
    studentName,

    correctCount,

    wrongCount,

    score: correctCount * 10,

    wrongAnswers,

    subjectiveAnswers,

    submittedAt: new Date().toLocaleString("ko-KR"),
  };

  console.log(resultData);

  // ----------------------------
  // Google Apps Script 전송
  // ----------------------------

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbzuJurIVqKHKKDJP88es5Khy3fpueJMAuwhpusagG_Yztadhb8NKDqL1EwQoY541gTH/exec",
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

    submitBtn.disabled = true;

    submitBtn.innerText = "제출 완료";
  } catch (error) {
    console.error(error);

    alert("제출 중 오류가 발생했습니다.");
  }
});

// ----------------------------
// 학생 화면 결과
// ----------------------------

function showResult(studentName, correctCount, wrongCount) {
  const result = document.querySelector("#result");

  result.classList.remove("hidden");

  result.innerHTML = `

    <h2>제출 완료</h2>

    <p>
      <strong>${studentName}</strong>님의
      답안이 제출되었습니다.
    </p>

    <p>
      객관식 정답 :
      ${correctCount}개
    </p>

    <p>
      객관식 오답 :
      ${wrongCount}개
    </p>

  `;
}
