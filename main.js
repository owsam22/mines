let balance = 1000;
let currentBet = 0;
let mineCount = 1;
let mines = [];
let gameActive = false;
let winnings = 0;
let multiplier = 1;
let clickCount = 0;

const mineImage = "https://i.pinimg.com/736x/bc/12/c3/bc12c33f7d6821e6d27d0f88eae70855.jpg";
const gemImage = "https://i.pinimg.com/736x/eb/7e/77/eb7e772fd6451448d45233d08133e161.jpg";


const balanceDisplay = document.getElementById("balance");
const betAmountInput = document.getElementById("bet-amount");
const betButton = document.getElementById("bet-btn");
const cashoutButton = document.getElementById("cash-out-btn");
const mineGrid = document.getElementById("mine-grid");
const mineSelector = document.getElementById("mine");
const multiplierSelector = document.getElementById("multiplier");
const messageBox = document.getElementById("message-box");

betButton.addEventListener("click", startGame);
cashoutButton.addEventListener("click", cashOut);

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
    let betAmount = Math.floor(parseFloat(betAmountInput.value)); 
    mineCount = parseInt(mineSelector.value);
    multiplier = parseFloat(multiplierSelector.value); 

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        messageBox.innerText = "Invalid bet!";
        return;
    }

    balance -= betAmount;
    balanceDisplay.value = balance;
    currentBet = betAmount;
    winnings = currentBet;
    gameActive = true;
    clickCount = 0;
    mines = [];

    cashoutButton.disabled = false;
    betButton.disabled = true;
    messageBox.innerText = "Game started! Pick a tile.";


    generateMines();

    createMineGrid();
}

function generateMines() {
    let maxClicksBeforeMine = 10; // Default max clicks before a mine appears

    if (currentBet >= balance) {
        maxClicksBeforeMine = Math.floor(Math.random() * 2) + 2; // Mines will appear within 2-3 clicks
    } else if (mineCount > 5) {
        maxClicksBeforeMine = Math.floor(Math.random() * 3) + 3; // Mines appear in 3-5 clicks if more mines exist
    } else {
        maxClicksBeforeMine = Math.floor(Math.random() * 5) + 5; // Mines appear in 5-10 clicks normally
    }

    // Generate mines but keep the first few safe clicks
    while (mines.length < mineCount) {
        let randomIndex = Math.floor(Math.random() * 25);
        if (!mines.includes(randomIndex) && randomIndex > maxClicksBeforeMine) {
            mines.push(randomIndex);
        }
    }
}

// Reveal mine or gem
function revealMine(button) {
    if (!gameActive || button.classList.contains("clicked")) return;

    let index = parseInt(button.dataset.index);
    button.classList.add("clicked");
    clickCount++;

    if (mines.includes(index)) {
        // Found a mine
        button.querySelector("img").src = mineImage;
        button.querySelector("img").classList.remove("hidden");
        button.classList.add("mine-lost");

        gameOver(false);

    } else {
        // Found a gem
        button.querySelector("img").src = gemImage;
        button.querySelector("img").classList.remove("hidden");
        button.classList.add("gem-won");

        // Increase winnings based on multiplier
        winnings = Math.floor(winnings * multiplier);
        messageBox.innerText = `You found a gem! Current winnings: ${winnings}`;


        // Check if mines should appear sooner based on click count
        if (clickCount >= 2 && currentBet >= balance) {
            mines.push(Math.floor(Math.random() * 25)); // Force a mine soon
        }
    }
}

// Cashout winnings
function cashOut() {
    if (!gameActive) return;

    balance += winnings;
    balanceDisplay.value = balance;
    messageBox.innerText = `You cashed out ${winnings}!`;



    resetGame();
}

// Game over logic
function gameOver(win) {
    gameActive = false;
    betButton.disabled = false;
    cashoutButton.disabled = true;

    if (!win) {
        messageBox.innerText = "You hit a mine! Game over.";
    }

    setTimeout(resetGame, 2000);
}

// Reset game
function resetGame() {
    gameActive = false;
    betButton.disabled = false;
    cashoutButton.disabled = true;
    createMineGrid();
}

// Initialize game
createMineGrid();
