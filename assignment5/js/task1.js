const START_LIVES = 3;
const MIN_VALUE = 1;
const MAX_VALUE = 10;
const WIN_STREAK = 10;

const game = document.querySelector("#game");
const rulesText = document.querySelector("#rules");
const livesText = document.querySelector("#lives");
const streakText = document.querySelector("#streak");
const bestText = document.querySelector("#best");
const beforeText = document.querySelector("#before");
const nowText = document.querySelector("#now");
const nowBox = document.querySelector("#now-box");
const message = document.querySelector("#message");
const higherButton = document.querySelector("#higher");
const lowerButton = document.querySelector("#lower");
const restartButton = document.querySelector("#restart");

let current = 0;
let before = null;
let lives = 0;
let streak = 0;
let best = 0;
let gameOver = false;

function randomValue() {
    return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
}

function showMessage(text, type) {
    message.textContent = text;
    message.classList.remove("message--error", "message--success", "message--win", "message--lose");
    if (type !== "") {
        message.classList.add("message--" + type);
    }
}

function showState() {
    livesText.textContent = lives + " of " + START_LIVES;
    streakText.textContent = streak + " of " + WIN_STREAK;
    bestText.textContent = best;
    nowText.textContent = current;
    if (before === null) {
        beforeText.textContent = "-";
    } else {
        beforeText.textContent = before;
    }
    higherButton.disabled = gameOver;
    lowerButton.disabled = gameOver;
}

function startGame() {
    lives = START_LIVES;
    streak = 0;
    before = null;
    current = randomValue();
    gameOver = false;
    game.classList.remove("game--win", "game--lose");
    nowBox.classList.remove("number--right", "number--wrong");
    showMessage("Will the next number be higher or lower than " + current + "?", "");
    showState();
}

function guess(choice) {
    if (gameOver) {
        showMessage("The game is over. Press New game to play again.", "error");
        return;
    }

    const next = randomValue();
    const isRight = (choice === "higher" && next >= current) || (choice === "lower" && next <= current);

    before = current;
    current = next;

    if (isRight) {
        streak = streak + 1;
        if (streak > best) {
            best = streak;
        }
    } else {
        lives = lives - 1;
        streak = 0;
    }

    nowBox.classList.toggle("number--right", isRight);
    nowBox.classList.toggle("number--wrong", !isRight);

    if (isRight && streak === WIN_STREAK) {
        gameOver = true;
        game.classList.add("game--win");
        showMessage("You win! " + WIN_STREAK + " right guesses in a row.", "win");
    } else if (!isRight && lives === 0) {
        gameOver = true;
        game.classList.add("game--lose");
        showMessage("Game over. The number was " + next + ". Your best streak is " + best + ".", "lose");
    } else if (isRight && next === before) {
        showMessage("Same number, " + next + ". Equal counts as a right guess!", "success");
    } else if (isRight) {
        showMessage("Right! " + before + " then " + next + ". Higher or lower than " + next + "?", "success");
    } else {
        showMessage("Wrong: " + before + " then " + next + ". You lost a life.", "error");
    }

    showState();
}

rulesText.textContent = "Guess if the next number from " + MIN_VALUE + " to " + MAX_VALUE +
    " will be higher or lower. An equal number counts as a right guess. You have " + START_LIVES +
    " lives. Make " + WIN_STREAK + " right guesses in a row to win.";

higherButton.addEventListener("click", function () {
    guess("higher");
});

lowerButton.addEventListener("click", function () {
    guess("lower");
});

restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }
    const key = event.key.toLowerCase();
    if (key === "h" || key === "arrowup") {
        event.preventDefault();
        guess("higher");
    } else if (key === "l" || key === "arrowdown") {
        event.preventDefault();
        guess("lower");
    } else if (key === "n") {
        startGame();
    } else if (key.length === 1 && key !== " ") {
        showMessage("\"" + event.key + "\" is not a move. Press H for Higher or L for Lower.", "error");
    }
});

startGame();
