// Google Apps Script Web App URL (แก้เป็นของคุณ)
const googleSheetWebAppUrl =
  "https://script.google.com/macros/s/AKfycbwAodJO5mOAgQLgQsUj4cjigSwvKYVjRZTZAYFGE4qWZSkxQ8ao_4y67wP7DfdGPgIL/exec";

/* --------------------------- ฐานข้อมูลคำถาม --------------------------- */
const quizData = [
  /* Grammar */
  {
    type: "grammar",
    question: "He ____ to the gym every Sunday.",
    options: ["go", "goes", "going", "gone"],
    answer: "goes",
  },
  {
    type: "grammar",
    question: "They ____ lunch at noon.",
    options: ["has", "have", "having", "had"],
    answer: "have",
  },
  {
    type: "grammar",
    question: "I ____ TV when she called.",
    options: ["watch", "watched", "was watching", "am watching"],
    answer: "was watching",
  },
  {
    type: "grammar",
    question: "She ____ a lot of books.",
    options: ["reads", "read", "reading", "reader"],
    answer: "reads",
  },
  {
    type: "grammar",
    question: "They ____ soccer every weekend.",
    options: ["plays", "play", "played", "playing"],
    answer: "play",
  },

  /* Sentence Structure */
  {
    type: "structure",
    question: "Rearrange to correct sentence: 'to / like / I / music / listen'",
    options: [
      "I like to listen music",
      "I to like listen music",
      "I like listen to music",
      "I like to listen to music",
    ],
    answer: "I like to listen to music",
  },
  {
    type: "structure",
    question: "Rearrange: 'book / a / reading / I / am'",
    options: [
      "I reading am a book",
      "I am reading a book",
      "Am I reading a book",
      "Reading I am a book",
    ],
    answer: "I am reading a book",
  },
  {
    type: "structure",
    question: "Rearrange: 'never / is / late / he'",
    options: [
      "He is never late",
      "Never he is late",
      "Is he never late",
      "Late he is never",
    ],
    answer: "He is never late",
  },
  {
    type: "structure",
    question: "Rearrange: 'coffee / morning / drinks / every / she'",
    options: [
      "She drinks coffee every morning",
      "Coffee drinks she every morning",
      "She every drinks coffee morning",
      "Drinks every morning coffee she",
    ],
    answer: "She drinks coffee every morning",
  },
  {
    type: "structure",
    question: "Rearrange: 'going / we / tonight / are / out'",
    options: [
      "We are going out tonight",
      "Going out tonight we are",
      "Tonight going we are out",
      "We out are going tonight",
    ],
    answer: "We are going out tonight",
  },

  /* Reading */
  {
    type: "reading",
    question:
      "Choose the best title for this passage: 'The increase in global temperatures has led to...'",
    options: ["Climate Change", "Sports", "Shopping Habits", "History"],
    answer: "Climate Change",
  },
  {
    type: "reading",
    question: "What can be inferred from the text?",
    options: [
      "The person is sad",
      "The person is angry",
      "The person is confused",
      "The person is happy",
    ],
    answer: "The person is happy",
  },
  {
    type: "reading",
    question: "Why did the author mention whales?",
    options: [
      "To describe a migration pattern",
      "To explain pollution",
      "To show economic effects",
      "To criticize hunters",
    ],
    answer: "To describe a migration pattern",
  },
  {
    type: "reading",
    question: "What is the purpose of this notice?",
    options: ["Inform of delay", "Request help", "Warn danger", "Offer a service"],
    answer: "Inform of delay",
  },
  {
    type: "reading",
    question: "What is the tone of the passage?",
    options: ["Serious", "Humorous", "Angry", "Neutral"],
    answer: "Serious",
  },

  /* Vocabulary */
  {
    type: "vocabulary",
    question: "Choose the word that best completes the sentence: She is very ____ in art.",
    options: ["interest", "interested", "interesting", "interests"],
    answer: "interested",
  },
  {
    type: "vocabulary",
    question: "Which word is a synonym of 'quick'?",
    options: ["slow", "happy", "fast", "loud"],
    answer: "fast",
  },
  {
    type: "vocabulary",
    question: "Choose the antonym of 'strong'",
    options: ["tall", "weak", "loud", "brave"],
    answer: "weak",
  },
  {
    type: "vocabulary",
    question: "Choose the correct word: The meeting was very ____.",
    options: ["inform", "information", "informative", "informs"],
    answer: "informative",
  },
  {
    type: "vocabulary",
    question: "Which word is related to 'education'?",
    options: ["teacher", "driver", "painter", "farmer"],
    answer: "teacher",
  },
];

/* ----------------------------- ตัวแปรสเตตัส ----------------------------- */
let username = "";
let currentIndex = 0;
let scoreByType = {};
let shuffledQuiz = [];
let selectedAnswer = null;

/* --------------------------- ตัวแปรอ้างอิง DOM --------------------------- */
const loginSection = document.getElementById("loginSection");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");

const partLabel = document.getElementById("partLabel");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");

const resultContent = document.getElementById("resultContent");
const restartBtn = document.getElementById("restartBtn");

/* ------------------------------ เริ่มทำแบบทดสอบ ------------------------------ */
function startTest() {
  username = usernameInput.value.trim();
  if (!username) {
    alert("กรุณาใส่ชื่อผู้ใช้ก่อนเริ่มแบบทดสอบ");
    return;
  }

  loginSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  resultSection.classList.add("hidden");

  currentIndex = 0;
  scoreByType = {};
  selectedAnswer = null;
  shuffledQuiz = shuffleArray(quizData);

  loadQuestion();
}

/* ------------------------------- โหลดคำถาม ------------------------------- */
function loadQuestion() {
  if (currentIndex >= shuffledQuiz.length) {
    showResult();
    return;
  }

  const q = shuffledQuiz[currentIndex];
  partLabel.textContent = `Part: ${capitalize(q.type)}`;
  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";

  q.options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectOption(optionDiv, option);
    optionsDiv.appendChild(optionDiv);
  });

  // อัปเดต Progress Bar
  progressBar.style.width = `${Math.round(
    (currentIndex / shuffledQuiz.length) * 100
  )}%`;

  selectedAnswer = null;
  nextBtn.disabled = true;
  nextBtn.classList.remove("hidden");
}

/* ------------------------------ เลือกคำตอบ ------------------------------ */
function selectOption(optionDiv, option) {
  [...optionsDiv.children].forEach((c) => c.classList.remove("selected"));
  optionDiv.classList.add("selected");
  selectedAnswer = option;
  nextBtn.disabled = false;
}

/* -------------------------- กดปุ่มถัดไป (Next) -------------------------- */
nextBtn.onclick = () => {
  if (!selectedAnswer) return;

  const q = shuffledQuiz[currentIndex];
  if (!scoreByType[q.type]) scoreByType[q.type] = { total: 0, correct: 0 };

  scoreByType[q.type].total++;
  if (selectedAnswer === q.answer) scoreByType[q.type].correct++;

  currentIndex++;
  loadQuestion();
};

/* ---------------------------- แสดงผลลัพธ์สุดท้าย ---------------------------- */
function showResult() {
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  // ชื่อผู้ใช้
  resultContent.innerHTML = `<p>Username: <b>${username}</b></p>`;

  // รายการคะแนนรายพาร์ต
  Object.keys(scoreByType).forEach((type) => {
    const { total, correct } = scoreByType[type];
    const percent = Math.round((correct / total) * 100);
    const div = document.createElement("div");
    div.textContent = `${capitalize(type)}: ${correct} / ${total} (${percent}%) → ${getAdvice(
      percent
    )}`;
    resultContent.appendChild(div);

    // ส่งไป Google Sheet
    sendResultToGoogleSheet(username, type, percent, correct, total);
  });

  /* --------- สรุปคะแนนรวม --------- */
  let totalQuestions = 0,
    totalCorrect = 0;
  Object.values(scoreByType).forEach(({ total, correct }) => {
    totalQuestions += total;
    totalCorrect += correct;
  });
  const overallPercent = Math.round((totalCorrect / totalQuestions) * 100);

  const overallDiv = document.createElement("div");
  overallDiv.innerHTML = `<b>ภาพรวมทั้งหมด: ${totalCorrect}/${totalQuestions} (${overallPercent}%) → ${getAdvice(
    overallPercent
  )}</b>`;
  Object.assign(overallDiv.style, {
    marginTop: "20px",
    background: "#764ba2",
    color: "white",
    textAlign: "center",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(255,255,255,0.1)",
  });
  resultContent.prepend(overallDiv);

  /* --------------------- วาดกราฟ Chart.js --------------------- */
  buildChart();
}

/* --------------------------- ฟังก์ชันวาดกราฟ --------------------------- */
function buildChart() {
  const chartCanvas = document.getElementById("scoreChart");
  const labels = Object.keys(scoreByType).map(capitalize);
  const data = Object.values(scoreByType).map((s) =>
    Math.round((s.correct / s.total) * 100)
  );

  // ลบกราฟเก่า (ถ้ามี)
  if (window.scoreChartInstance) window.scoreChartInstance.destroy();

  window.scoreChartInstance = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "คะแนน (%)",
          data,
          backgroundColor: ["#8c6eff", "#bb86fc", "#7c4dff", "#9575cd"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "กราฟแสดงผลคะแนนรายพาร์ต",
          color: "#fff",
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#fff" },
          grid: { color: "#444" },
        },
        x: {
          ticks: { color: "#fff" },
          grid: { color: "#444" },
        },
      },
    },
  });
}

/* ---------------------- ตัวช่วย/ยูทิลิตีฟังก์ชัน ---------------------- */
function getAdvice(score) {
  if (score >= 80) return "ยอดเยี่ยม!";
  if (score >= 60) return "ดี แต่ยังพัฒนาได้";
  return "ควรฝึกเพิ่มเติม";
}
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ------- ส่งผลคะแนนไป Google Sheets ผ่าน Web App ------- */
function sendResultToGoogleSheet(username, part, scorePercent, correct, total) {
  fetch(googleSheetWebAppUrl, {
    method: "POST",
    body: JSON.stringify({ username, part, scorePercent, correct, total }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        console.log(`ส่งผลคะแนน ${part} เรียบร้อย`);
      } else {
        console.error("เกิดข้อผิดพลาด:", data.message);
      }
    })
    .catch((err) => console.error("เกิดข้อผิดพลาด:", err));
}

/* --------------------------- รีเซ็ต/เริ่มใหม่ --------------------------- */
restartBtn.onclick = () => {
  usernameInput.value = "";
  username = "";
  scoreByType = {};
  currentIndex = 0;
  selectedAnswer = null;

  resultSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
};

/* --------------------------- ปุ่มเริ่มทำแบบทดสอบ --------------------------- */
loginBtn.onclick = startTest;
