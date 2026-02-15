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
        if (playerOneName.trim() === "") {
            playerOneName = "Player One";
        }
        if (playerTwoName.trim() === "") {
            playerTwoName = "Player Two";
        }
        playerOne = createPlayer(playerOneName, "X");
        playerTwo = createPlayer(playerTwoName, "O");
        winner = null;
        activePlayer = playerOne;
    }

    const playerTurn = (position) => {
        if (gameState !== "active") {
            return gameState;
        }
        const markSuccess = gameboard.placeMark(position, activePlayer.mark);
        if (markSuccess === true) {
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
        else if (markSuccess === false) {
            return "invalid";
        }
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

const displayController = (function displayController() {
    const newGameBtn = document.getElementById("newGame");
    const newConfirmDia = document.getElementById("confirmNewDialog");
    const cancelBtn = document.getElementById("cancel");
    const confirmBtn = document.getElementById("confirm");
    const newGameDia = document.getElementById("newGameDialog")
    const startNewBtn = document.getElementById("start");
    const cancelNewBtn = document.getElementById("cancelNew");
    const playerOne = document.getElementById("playerOne");
    const playerTwo = document.getElementById("playerTwo");
    const cells = document.getElementById("gameContainer");
    const status = document.getElementById("status");
    const playerOneDisplay = document.getElementById("playerOneDisplay");
    const playerTwoDisplay = document.getElementById("playerTwoDisplay");


    const bindEvents = () => {

        newGameBtn.addEventListener("click", () => {
            newConfirmDia.showModal();
        });

        cancelBtn.addEventListener("click", () => {
            newConfirmDia.close();
        });

        confirmBtn.addEventListener("click", () => {
            newGameDia.showModal();
            newConfirmDia.close();
        });

        startNewBtn.addEventListener("click", () => {
            gameController.newGame(playerOne.value, playerTwo.value);
            displayNames(playerOne.value, playerTwo.value);
            newGameDia.close();
            playerOne.value = "";
            playerTwo.value = "";
            renderBoard();
            renderStatus();
            renderActivePlayer();
        });

        cancelNewBtn.addEventListener("click", () => {
            newGameDia.close();
            playerOne.value = "";
            playerTwo.value = "";
        });

        cells.addEventListener("click", (event) => {
            const cellElement = event.target.closest(".cell");
            if (!cellElement) {
                return;
            }
            const cellId = Number(cellElement.dataset.index);
            const result = gameController.playerTurn(cellId);
            renderBoard();
            renderStatus(result);
            renderActivePlayer();
        })
    }

    const displayNames = (playerOneName, playerTwoName) => {
        const playerOne = document.getElementById("playerOneName");
        const playerTwo = document.getElementById("playerTwoName");
        playerOne.textContent = playerOneName;
        playerTwo.textContent = playerTwoName;
    }

    const renderBoard = () => {
        const cells = document.querySelectorAll(".cell")
        const board = gameboard.getBoard();
        for (const cell of cells) {
            const index = Number(cell.dataset.index)
            cell.textContent = board[index];
        }
    }

    const renderStatus = (result) => {
        const gameState = gameController.getGameState();
        const activePlayer = gameController.getActivePlayer();
        const winner = gameController.getWinner();
        if (result === "invalid") {
            status.textContent = "Invalid Move! Please try again."
        }
        else if (gameState === null) {
            status.textContent = "Please click Start New Game to begin!";
        }
        else if (gameState === "active") {
            status.textContent = `${activePlayer.name}'s turn! ${activePlayer.mark}`;
        }
        else if (gameState === "win") {
            status.textContent = `${winner.name} wins!!!`;

        }
        else if (gameState === "tie") {
            status.textContent = "It's a tie! Try Again!";
        }
    }

    const renderActivePlayer = () => {
        const activePlayer = gameController.getActivePlayer();
        playerOneDisplay.classList.remove("active");
        playerTwoDisplay.classList.remove("active");
        if (activePlayer.mark === "X") {
            playerOneDisplay.classList.add("active");
        } else {
            playerTwoDisplay.classList.add("active");
        }
    }


    return {bindEvents, displayNames, renderBoard, renderStatus, renderActivePlayer}
})();

displayController.bindEvents();
displayController.renderStatus();
