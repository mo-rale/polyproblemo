// Quiz questions
const quizQuestions = [
  { q: "What is (3x^2 + 2y) + (x^2 + 5y)?", choices: ["4x^2 + 7y", "3x^2 + x^2 + 10y", "2x^2 + 7y", "4x^2 + 5y"], answer: "4x^2 + 7y" },
  { q: "What is (5x^2 - 3y + 2) - (2x^2 + y - 4)?", choices: ["3x^2 - 4y + 6", "7x^2 - 4y + 6", "3x^2 - 2y - 2", "5x^2 - 2y + 6"], answer: "3x^2 - 4y + 6" },
  { q: "In polynomial addition, what do you combine?", choices: ["All terms", "Only constant terms", "Like terms", "Highest powers only"], answer: "Like terms" },
  { q: "Simplify: (2xy + 3z) + (4xy - z)", choices: ["6xy + 2z", "2xy + 2z", "6xy + z", "6xy"], answer: "6xy + 2z" },
  { q: "What is (x^2 + 2x + 1) + (3x^2 - x + 4)?", choices: ["4x^2 + x + 5", "2x^2 + x + 5", "4x^2 + 3x + 3", "4x^2 + x + 3"], answer: "4x^2 + x + 5" },
  { q: "Simplify: (7a - 3b) - (2a - 5b)", choices: ["5a + 2b", "9a - 8b", "5a - 8b", "5a + b"], answer: "5a + 2b" }
];

// Quiz state variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

// Page Navigation
function goTo(page) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("learn").classList.add("hidden");
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById(page).classList.remove("hidden");
  
  // Reset output animation state
  const output = document.getElementById("output");
  output.classList.remove("show");
  output.classList.remove("fade-in");
  
  if (page === "quiz") {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    loadQuiz();
  }
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.classList.add('ripple');
    button.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
      
      const ripple = this.getElementsByClassName('ripple-effect')[0];
      if (ripple) {
        ripple.remove();
      }
      
      this.appendChild(circle);
    });
  });
});

// Polynomial Parser
function parsePolynomial(poly) {
  poly = poly.replace(/\s+/g, "");
  const terms = poly.match(/[+-]?\d*[a-z](\^\d+)?|[+-]?\d+/gi) || [];
  let parsed = {};
  terms.forEach(term => {
    let coeff = 0, vars = "";
    const match = term.match(/^([+-]?\d*)([a-z](\^\d+)?([a-z](\^\d+)?)*)?/i);
    if (match) {
      coeff = match[1] === "" || match[1] === "+" ? 1 :
              match[1] === "-" ? -1 : parseInt(match[1]);
      vars = match[2] ? match[2] : "";
    }
    parsed[vars] = (parsed[vars] || 0) + coeff;
  });
  return parsed;
}

function formatPolynomial(poly) {
  let terms = [];
  let keys = Object.keys(poly).filter(k => poly[k] !== 0);

  // sort by power length then alphabetically
  keys.sort((a,b) => {
    const getPower = v => v.match(/\^(\d+)/) ? parseInt(v.match(/\^(\d+)/)[1]) : (v === "" ? 0 : 1);
    return getPower(b) - getPower(a) || a.localeCompare(b);
  });

  keys.forEach(k => {
    let coeff = poly[k];
    if (coeff === 0) return;
    let term = "";
    if (k === "") term = coeff.toString();
    else if (coeff === 1) term = k;
    else if (coeff === -1) term = "-" + k;
    else term = coeff + k;
    terms.push(term);
  });

  return terms.join(" + ").replace(/\+\s-\s/g, "- ");
}

function showSteps() {
  const p1 = parsePolynomial(document.getElementById("poly1").value);
  const p2 = parsePolynomial(document.getElementById("poly2").value);

  let stepsAdd = "<h3>Addition Steps:</h3>";
  let stepsSub = "<h3>Subtraction Steps:</h3>";

  const allKeys = Array.from(new Set([...Object.keys(p1), ...Object.keys(p2)]));

  let finalAdd = {}, finalSub = {};
  allKeys.forEach(k => {
    let c1 = p1[k] || 0;
    let c2 = p2[k] || 0;
    stepsAdd += `${c1}${k} + ${c2}${k} = ${(c1+c2)}${k}<br>`;
    stepsSub += `${c1}${k} - ${c2}${k} = ${(c1-c2)}${k}<br>`;
    finalAdd[k] = c1 + c2;
    finalSub[k] = c1 - c2;
  });

  const output = document.getElementById("output");
  
  // Reset animation
  output.classList.remove("show");
  output.classList.remove("fade-in");
  
  // Force reflow to restart animation
  void output.offsetWidth;
  
  output.innerHTML = `
    ${stepsAdd}<b>Final Answer: ${formatPolynomial(finalAdd)}</b><br><br>
    ${stepsSub}<b>Final Answer: ${formatPolynomial(finalSub)}</b>
  `;
  
  // Trigger animation with a slight delay to allow DOM update
  setTimeout(() => {
    output.classList.add("show");
    output.classList.add("fade-in");
  }, 10);
}

function showStatement() {
  const output = document.getElementById("output");
  
  // Reset animation
  output.classList.remove("show");
  output.classList.remove("fade-in");
  
  // Force reflow to restart animation
  void output.offsetWidth;
  
  output.innerHTML = `
    <h3>How to Solve Polynomial Addition & Subtraction:</h3>
    <p>
    1. Write both polynomials in standard form.<br>
    2. Line up like terms (same variables & exponents).<br>
    3. For addition: add coefficients of like terms.<br>
    4. For subtraction: subtract coefficients of like terms.<br>
    5. Rewrite in standard form.<br>
    </p>
  `;
  
  // Trigger animation with a slight delay to allow DOM update
  setTimeout(() => {
    output.classList.add("show");
    output.classList.add("fade-in");
  }, 10);
}

// Quiz System
function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function loadQuiz() {
  const container = document.getElementById("quizContent");
  container.innerHTML = "";

  const numQuestions = 3; // how many random questions
  currentQuestions = shuffle([...quizQuestions]).slice(0, numQuestions);
  totalQuestions = currentQuestions.length;
  
  // Add quiz container structure
  container.innerHTML = `
    <div class="quiz-container">
      <div class="score-display">Score: ${score}/${totalQuestions}</div>
      <div id="currentQuestion"></div>
      <div class="progress-bar"></div>
      <div class="quiz-footer">
        <button onclick="nextQuestion()" class="hidden" id="nextButton">Next Question</button>
      </div>
    </div>
  `;
  
  showQuestion(0);
}

function showQuestion(index) {
  if (index >= currentQuestions.length) {
    // Quiz completed
    showQuizResults();
    return;
  }
  
  const questionContainer = document.getElementById("currentQuestion");
  const qObj = currentQuestions[index];
  
  let qBlock = `<div class="quiz-question"><h3>Q${index+1}: ${qObj.q}</h3>`;
  let shuffledChoices = shuffle([...qObj.choices]);
  
  shuffledChoices.forEach(choice => {
    qBlock += `<div class='choice' onclick="checkAnswer('${qObj.answer.replace(/'/g, "\\'")}', '${choice.replace(/'/g, "\\'")}')">${choice}</div>`;
  });
  
  qBlock += "</div>";
  questionContainer.innerHTML = qBlock;
  
  // Reset progress bar
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = '0%';
  
  // hide next button
  document.getElementById('nextButton').classList.add('hidden');
  
  // animate quiz choices after a short delay
  setTimeout(() => {
    const choices = document.querySelectorAll('.choice');
    choices.forEach((choice, idx) => {
      setTimeout(() => {
        choice.classList.add('show');
      }, idx * 100);
    });
  }, 100);
  
  currentQuestionIndex = index;
  
  // update score display
  document.querySelector('.score-display').textContent = `Score: ${score}/${totalQuestions}`;
}

function checkAnswer(correct, choice) {
  const choices = document.querySelectorAll('.choice');
  const progressBar = document.querySelector('.progress-bar');
  
  // mkae the other choices unclickable after one is selercted
  choices.forEach(c => {
    c.classList.add('disabled');
  });
  
  // mark correct and incorrect answers
  choices.forEach(c => {
    if (c.textContent === correct) {
      c.classList.add('correct');
    } else if (c.textContent === choice) {
      c.classList.add('incorrect');
    }
  });
  
  // updates the score if correct
  if (choice === correct) {
    score++;
    document.querySelector('.score-display').textContent = `Score: ${score}/${totalQuestions}`;
  }
  
  // progress bar animation 
  progressBar.style.width = '100%';
  
  // 2 seconds delay before next question
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

function nextQuestion() {
  showQuestion(currentQuestionIndex + 1);
}

function showQuizResults() {
  const container = document.getElementById("quizContent");
  container.innerHTML = `
    <div class="quiz-results fade-in">
      <h2>Quiz Completed!</h2>
      <p>Your final score: ${score}/${totalQuestions}</p>
      <p>${score === totalQuestions ? 'Perfect! 🎉' : score >= totalQuestions/2 ? 'Good job! 👍' : 'Keep practicing! 💪'}</p>
      <button onclick="loadQuiz()">Try Again</button>
    </div>
  `;
}