// Global variables
let sudokuBoard = [];
let timerInterval;
let seconds = 0;
let minutes = 0;
let gameStarted = false;

const difficultyLevels = {
    easy: 35,    // 35 filled cells
    medium: 30,  // 30 filled cells
    hard: 25     // 25 filled cells
};

// Initialize when the page loads
window.onload = function() {
    newGame();
};

function newGame() {
    const difficulty = document.getElementById('difficulty').value;
    restartTimer();
    generateSudoku(difficulty);
    document.getElementById('status-message').textContent = '';
}

function generateSudoku(difficulty) {
    sudokuBoard = generateEmptyBoard();

    // Fill diagonal 3x3 boxes first (they are independent)
    fillDiagonal();
    
    // Solve the rest of the board
    solveSudoku(sudokuBoard);
    
    // Remove numbers based on difficulty
    removeNumbers(difficultyLevels[difficulty]);
    
    // Create the visual grid
    createSudokuGrid();
}

function generateEmptyBoard() {
    return Array(9).fill().map(() => Array(9).fill(0));
}

function fillDiagonal() {
    for (let i = 0; i < 9; i += 3) {
        fillBox(i, i);
    }
}

function fillBox(row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isSafeInBox(row, col, num));
            
            sudokuBoard[row + i][col + j] = num;
        }
    }
}

function isSafeInBox(row, col, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuBoard[row + i][col + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function removeNumbers(numbersToRemove) {
    let count = 81 - numbersToRemove;
    while (count > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        
        if (sudokuBoard[row][col] !== 0) {
            sudokuBoard[row][col] = 0;
            count--;
        }
    }
}

function createSudokuGrid() {
    const grid = document.getElementById('sudoku-grid').getElementsByTagName('tbody')[0];
    grid.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            input.value = sudokuBoard[row][col] !== 0 ? sudokuBoard[row][col] : '';
            input.disabled = sudokuBoard[row][col] !== 0;
            input.oninput = () => validateInput(input);
            
            const possibleNumbersSpan = document.createElement('span');
            possibleNumbersSpan.classList.add('possible-numbers');
            td.appendChild(input);
            td.appendChild(possibleNumbersSpan);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}

function validateInput(input) {
    const value = input.value;
    if (value !== '' && (value < 1 || value > 9)) {
        input.value = '';
        showStatus('Please enter a number between 1 and 9');
        return;
    }
    
    const inputs = document.getElementsByTagName('input');
    const index = Array.from(inputs).indexOf(input);
    const row = Math.floor(index / 9);
    const col = index % 9;
    
    sudokuBoard[row][col] = value === '' ? 0 : parseInt(value);
}

function isSafe(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function solveSudoku(board) {
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku(board)) {
                return true;
            }
            
            board[row][col] = 0;
        }
    }
    
    return false;
}

function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}

function getCurrentBoard() {
    const board = [];
    const inputs = document.getElementsByTagName('input');
    let index = 0;
    
    for (let row = 0; row < 9; row++) {
        board[row] = [];
        for (let col = 0; col < 9; col++) {
            const value = inputs[index].value;
            board[row][col] = value === '' ? 0 : parseInt(value);
            index++;
        }
    }
    
    return board;
}

function solve() {
    const currentBoard = getCurrentBoard();
    showStatus('Solving puzzle...');
    
    setTimeout(() => {
        if (solveSudoku(currentBoard)) {
            const inputs = document.getElementsByTagName('input');
            let index = 0;
            
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    inputs[index].value = currentBoard[row][col];
                    index++;
                }
            }
            showStatus('Puzzle solved successfully!');
        } else {
            showStatus('No solution exists for this puzzle!');
        }
    }, 100);
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById('timer').textContent = 
            `Time: ${formatTime(minutes)}:${formatTime(seconds)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function restartTimer() {
    stopTimer();
    seconds = 0;
    minutes = 0;
    gameStarted = false;
    document.getElementById('timer').textContent = 'Time: 00:00';
    startTimer();
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

function showStatus(message) {
    document.getElementById('status-message').textContent = message;
}

// Handle showing possible numbers
 // Global flag to track the state

function togglePossibleNumbers() {
    const inputs = document.getElementsByTagName('input');
    const spans = document.getElementsByClassName('possible-numbers');
    let index = 0;

    if (showingPossibleNumbers) {
        // Hide possible numbers if already showing
        for (let span of spans) {
            span.style.display = 'none';
        }
        showingPossibleNumbers = true;
    } else {
        // Show possible numbers
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuBoard[row][col] === 0) {
                    const possibleNumbers = findPossibleNumbers(sudokuBoard, row, col);
                    spans[index].textContent = possibleNumbers.join(' ');
                    spans[index].style.display = 'block';
                } else {
                    spans[index].style.display = 'none';
                }
                index++;
            }
        }
        showingPossibleNumbers = false;
    }
}

// Existing findPossibleNumbers function
function findPossibleNumbers(board, row, col) {
    const possibleNumbers = [];
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            possibleNumbers.push(num);
        }
    }
    return possibleNumbers;
}


function askShowPossibleNumbers() {
    showPossibleNumbers();
    showStatus('Showing possible numbers for empty cells');
}

function showPossibleNumbers() {
    const inputs = document.getElementsByTagName('input');
    const spans = document.getElementsByClassName('possible-numbers');
    let index = 0;
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuBoard[row][col] === 0) {
                const possibleNumbers = findPossibleNumbers(sudokuBoard, row, col);
                spans[index].textContent = possibleNumbers.join(' ');
                spans[index].style.display = 'block';
            } else {
                spans[index].style.display = 'none';
            }
            index++;
        }
    }
}

function hidePossibleNumbers() {
    const spans = document.getElementsByClassName('possible-numbers');
    for (let span of spans) {
        span.style.display = 'none';
    }
}