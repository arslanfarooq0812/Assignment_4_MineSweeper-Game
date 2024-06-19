const levels = {
    easy: { size: 8, bombs: 10 },
    regular: { size: 16, bombs: 40 },
    hard: { size: 24, bombs: 99 }
};

let gameBoard, bombCount, currentDifficulty, bombsRevealed;

function initGame(difficulty) {
    currentDifficulty = difficulty;
    const level = levels[difficulty];
    bombCount = level.bombs;
    bombsRevealed = 0;

    document.getElementById('bombCount').innerText = `Bombs: ${bombCount}`;
    document.getElementById('gameStatus').innerText = '';
    gameBoard = createBoard(level.size, level.bombs);
    renderBoard(gameBoard);
}

function createBoard(size, bombs) {
    let board = Array.from({ length: size }, () => Array.from({ length: size }, () => ({
        bomb: false,
        revealed: false,
        adjacent: 0
    })));

    // Place bombs
    let placedBombs = 0;
    while (placedBombs < bombs) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (!board[row][col].bomb) {
            board[row][col].bomb = true;
            placedBombs++;
            updateAdjacentCells(board, row, col);
        }
    }
    return board;
}

function updateAdjacentCells(board, row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board.length && !(i === row && j === col)) {
                board[i][j].adjacent++;
            }
        }
    }
}

function renderBoard(board) {
    const gameBoardDiv = document.getElementById('gameBoard');
    gameBoardDiv.innerHTML = '';
    gameBoardDiv.style.gridTemplateColumns = `repeat(${board.length}, 30px)`;

    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.addEventListener('click', () => revealCell(i, j));
            gameBoardDiv.appendChild(cellDiv);
        });
    });
}

function revealCell(row, col) {
    const cell = gameBoard[row][col];
    if (cell.revealed) return;

    cell.revealed = true;
    const cellDiv = document.querySelector(`#gameBoard div:nth-child(${row * gameBoard.length + col + 1})`);
    cellDiv.classList.add('revealed');
    if (cell.bomb) {
        bombsRevealed++;
        cellDiv.classList.add('bomb');
        const bombImg = document.createElement('img');
        bombImg.src = 'bomb.png'; 
        cellDiv.appendChild(bombImg);
        document.getElementById('gameStatus').innerText = `Bombs revealed: ${bombsRevealed}`;
        if (bombsRevealed === bombCount) {
            alert('Game Over');
            document.getElementById('gameStatus').innerText += ' - You lost!';
            initGame(currentDifficulty);
        }
    } else if (cell.adjacent > 0) {
        cellDiv.innerText = cell.adjacent;
    } else {
        revealAdjacentCells(row, col);
    }

    const revealedCells = document.querySelectorAll('.cell.revealed').length;
    const totalCells = gameBoard.length * gameBoard.length;
    const successRate = ((totalCells - bombCount - revealedCells + bombsRevealed) / (totalCells - bombCount)) * 100;
    document.getElementById('gameStatus').innerText += ` - Success rate: ${successRate.toFixed(2)}%`;
}

function revealAdjacentCells(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gameBoard.length && j >= 0 && j < gameBoard.length && !(i === row && j === col)) {
                revealCell(i, j);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame('easy');
});
