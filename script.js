const gameboard = (function gameboard()  {
    let board = new Array(9).fill(" ");

    const getBoard = () => board.slice();
    const isAvailable = (position) => {
        if (board[position] === " "){
            return true;
        } else {
            return false;
        }
    }
    const placeMark = (position, mark) => {
       if (isAvailable(position) === true) {
        board[position] = mark;
        return true;
       } else {
        return false;
       }
    }
    const reset = () => {
         board = new Array(9).fill(" ");
    }
    return {getBoard, placeMark, reset}
})();

const gameController = (function gameController() {
    let gameState = null;

    const checkWin = () => {
    const winningPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const board = gameboard.getBoard();
    for (const pattern of winningPatterns) {
        if (board[pattern[0]] != " " && board[pattern[0]] === board[pattern[1]] && board[pattern[1]] === board[pattern[2]]) {
            return true;
        }
        }
        return false;
    }

    const checkTie = () => {
        const board = gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                return false;
            }
        }
        return true;
    }

    const createPlayer = (name, mark) => {
        return {name, mark};
    }

    let playerOne = null;
    let playerTwo = null;
    let activePlayer = null;
    let winner = null;

    const newGame = (playerOneName, playerTwoName) => {
        gameboard.reset();
        gameState = "active";
        playerOne = createPlayer(playerOneName, "X");
        playerTwo = createPlayer(playerTwoName, "O");
        winner = null;
        activePlayer = playerOne;
    }

    const playerTurn = (position) => {
        if (gameState !== "active") {
            return gameState;
        }
        if (gameboard.placeMark(position, activePlayer.mark) === true) {
            if (checkWin() === true) {
                gameState = "win";
                winner = activePlayer;
                return gameState;
            } else if (checkTie() === true) {
                gameState = "tie";
                return gameState;
            } else {
            activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        }}
        return gameState;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const getGameState = () => { 
        return gameState;
    }

    const getWinner = () => {
        return winner;
    }


    return {checkWin, checkTie, createPlayer, newGame, playerTurn, getActivePlayer, getGameState, getWinner}
})();


