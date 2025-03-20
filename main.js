let balance = 1000;
let currentBet = 0;
let mineCount = 1;
let mines = [];
let gameActive = false;
let winnings = 0;
let multiplier = 1;
let clickCount = 0;

const onMine=new Audio("onMine.mp3");
const onTile=new Audio("onTile.mp3");
const cashout=new Audio("cashout.mp3");
const startmine=new Audio("startmine.mp3");

const mineImage = "https://i.pinimg.com/736x/bc/12/c3/bc12c33f7d6821e6d27d0f88eae70855.jpg";
const gemImage = "https://i.pinimg.com/736x/eb/7e/77/eb7e772fd6451448d45233d08133e161.jpg";

const balanceDisplay = document.getElementById("balance");
const betAmountInput = document.getElementById("bet-amount");
const betButton = document.getElementById("bet-btn");
const cashoutButton = document.getElementById("cash-out-btn");
const mineGrid = document.getElementById("mine-grid");
const mineSelector = document.getElementById("mine");
const messageBox = document.getElementById("message-box");

betButton.addEventListener("click", startGame);
cashoutButton.addEventListener("click", cashOut);
betAmountInput.addEventListener("input", validateBetAmount);

function validateBetAmount() {
    let betAmount = parseFloat(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        betButton.disabled = true;
        betButton.style.opacity = "0.6";
        betButton.style.cursor = "not-allowed";
    } else {
        betButton.disabled = false;
        betButton.style.opacity = "1";
        betButton.style.cursor = "pointer";
    }
}

function createMineGrid() {
    mineGrid.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        let btn = document.createElement("button");
        btn.classList.add("mine-btn");
        btn.dataset.index = i;

        let img = document.createElement("img");
        img.classList.add("hidden");
        btn.appendChild(img);

        btn.addEventListener("click", () => revealMine(btn));
        mineGrid.appendChild(btn);
    }
}

function startGame() {
    startmine.play()
    let betAmount = Math.floor(parseFloat(betAmountInput.value));
    mineCount = parseInt(mineSelector.value);

    if (betAmount <= 0 || isNaN(betAmount)) {
        messageBox.innerText = "Enter a valid bet amount!";
        return;
    }

    if (mineCount === 1) multiplier = 1.1;
    else if (mineCount === 2) multiplier = 1.2;
    else if (mineCount === 3) multiplier = 1.3;
    else if (mineCount === 4) multiplier = 1.4;
    else multiplier = 1.5;

    balance -= betAmount;
    balanceDisplay.value = balance;
    currentBet = betAmount;
    winnings = currentBet;
    gameActive = true;
    clickCount = 0;
    mines = [];

    betButton.disabled = true;
    betButton.style.opacity = "0.6";
    betButton.style.cursor = "not-allowed";

    cashoutButton.disabled = true;
    messageBox.innerText = "Game started! Pick a tile.";

    generateMines();
    createMineGrid();
}

function generateMines() {
    let maxClicksBeforeMine = 10;

    if (currentBet >= balance) {
        maxClicksBeforeMine = Math.floor(Math.random() * 2) + 1;
    } else if (mineCount > 5) {
        maxClicksBeforeMine = Math.floor(Math.random() * 3) + 2;
    } else {
        maxClicksBeforeMine = Math.floor(Math.random() * 4) + 3;
    }

    while (mines.length < mineCount) {
        let randomIndex = Math.floor(Math.random() * 11);
        if (!mines.includes(randomIndex) && randomIndex > maxClicksBeforeMine) {
            mines.push(randomIndex);
        }
    }
}

function revealMine(button) {
    if (!gameActive || button.classList.contains("clicked")) return;

    let index = parseInt(button.dataset.index);
    button.classList.add("clicked");
    clickCount++;

    if (mines.includes(index)) {
        button.querySelector("img").src = mineImage;
        button.querySelector("img").classList.remove("hidden");
        button.classList.add("mine-lost");

        gameOver(false);
    } else {
        onTile.play();
        button.querySelector("img").src = gemImage;
        button.querySelector("img").classList.remove("hidden");
        button.classList.add("gem-won");

        


        if (clickCount === 1) {
            cashoutButton.disabled = false;
            cashoutButton.style.opacity = "1";
            cashoutButton.style.cursor = "pointer";
        }

        winnings = Math.floor(winnings * multiplier);
        messageBox.innerText = `You found a gem! Current winnings: ${winnings}`;

        if (clickCount >= 2 && currentBet >= balance) {
            mines.push(Math.floor(Math.random() * 25));
        }
    }
}

function cashOut() {
    cashout.play();
    if (!gameActive) return;

    balance += winnings;
    balanceDisplay.value = balance;
    messageBox.innerText = `You cashed out ${winnings}!`;

    resetGame();
}

function gameOver(win) {
    gameActive = false;

    betButton.disabled = false;
    betButton.style.opacity = "1";
    betButton.style.cursor = "pointer";

    cashoutButton.disabled = true;
    cashoutButton.style.opacity = "0.6";
    cashoutButton.style.cursor = "not-allowed";

    if (!win) {
        onMine.play()
        messageBox.innerText = "You hit a mine! Game over.";
    }

    setTimeout(resetGame, 2000);
}

function resetGame() {
    gameActive = false;

    betButton.disabled = false;
    betButton.style.opacity = "1";
    betButton.style.cursor = "pointer";

    cashoutButton.disabled = true;
    cashoutButton.style.opacity = "0.6";
    cashoutButton.style.cursor = "not-allowed";

    createMineGrid();
    validateBetAmount();
}

createMineGrid();
validateBetAmount();
