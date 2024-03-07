// variables to keep track of game
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

// hide/show start screen show/start time
function startQuiz() {
    var startScreenEl = document.getElementById('start-screen');
    startScreenEl.setAttribute('class', 'hide');
    questionsEl.removeAttribute('class');
    timerId = setInterval(clockTick, 1000);
    timerEl.textContent = time;

    getQuestion();
}
// get question from array, get new question, remove old question
function getQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;
    choicesEl.innerHTML = '';

    // loop over choices, new button for each choice
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        var choice = currentQuestion.choices[i];
        var choiceNode = document.createElement('button');
        choiceNode.setAttribute('class', 'choice');
        choiceNode.setAttribute('value', choice);

        choiceNode.textContent = i + 1 + '. ' + choice;
        choicesEl.appendChild(choiceNode);
    }
}

function questionClick(event) {
    var buttonEl = event.target;

    // if the clicked element is not a choice button, do nothing.
    if (!buttonEl.matches('.choice')) {
        return;
    }

    // check if user guessed wrong
    if (buttonEl.value !== questions[currentQuestionIndex].answer) {
        // time penalized
        time -= 15;
        if (time < 0) {
            time = 0;
        }
        // display new penalized time 
        timerEl.textContent = time;
        feedbackEl.textContent = 'Nope!';
    } else {
        feedbackEl.textContent = 'Great Job!';
    }
    // nope/greatJob feedback on page
    feedbackEl.setAttribute('class', 'feedback');
    setTimeout(function () {
        feedbackEl.setAttribute('class', 'feedback hide');
    }, 500);

    // next question
    currentQuestionIndex++;

    // check if we've run out of questions
    if (time <= 0 || currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

//time stop, show score, hide questions
function quizEnd() {
    clearInterval(timerId);

    var endScreenEl = document.getElementById('end-screen');
    endScreenEl.removeAttribute('class');

    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    questionsEl.setAttribute('class', 'hide');
}

//check if user ran out of time
function clockTick() {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();

    // make sure value wasn't empty
    if (initials !== '') {
        // get saved scores from localstorage, if not any, set to empty array
        var highscores =
            JSON.parse(window.localStorage.getItem('highscores')) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials,
        };

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem('highscores', JSON.stringify(highscores));

        // highscore page
        window.location.href = 'highscores.html';
    }
}

function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === 'Enter') {
        saveHighscore();
    }
}

// enter initials
submitBtn.onclick = saveHighscore;

// start game
startBtn.onclick = startQuiz;

// element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
