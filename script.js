
function Gameboard() {
    const rows = 9;
    const board = [];


    for (let i = 0; i < rows; i++) {
        board.push(Cell());

    }
    console.log(board)
    const getBoard = () => board;

    const dropToken = (id, player) => {

        board[id].addToken(player);
    };


    const printBoard = () => {
        const boardWithCellValues = board.map((cell) => cell.getValue())
        return boardWithCellValues;
        console.log(boardWithCellValues);
    };


    return { getBoard, dropToken, printBoard };
}


function HtmlControler() {
    const app = document.querySelector('.app');
    let activPlayer;
    const createElem = (tag, classs) => {
        let elem = document.createElement(tag);
        elem.classList.add(classs);
        return elem;
    }

    const startGame = () => {
        const start = createElem('div', 'start');
        const startTitle = createElem('div', 'start-title');
        startTitle.textContent = 'TIC-TAC-TOE'
        const panelPick = createElem('div', 'pick-panel');
        const titlePick = createElem('div', 'pick-title');
        titlePick.textContent = "Pick who goes first?"
        const whoPick = createElem('div', 'pick-who');
        const cross = createElem('div', 'cross');
        const round = createElem('div', 'round');
        const img1 = createElem('img', 'img1');
        img1.src = '/cross.png'
        const img2 = createElem('img', 'img2');
        img2.src = '/round.png'
        cross.append(img1);
        round.append(img2);
        whoPick.append(cross, round);
        panelPick.append(titlePick, whoPick);
        start.append(startTitle, panelPick);
        app.append(start);
        cross.addEventListener('click', () => {
            game.setOnePlayerSym('0', 'X')
            app.innerHTML = '';
            app.append(fieldgame);
            game.timerRound()
        })
        round.addEventListener('click', () => {
            game.setTwoPlayerSym('0', 'X')
            app.innerHTML = '';
            app.append(fieldgame);
            game.timerRound()

        })
    }

    const gameField = () => {
        const gamefield = createElem('div', 'game-field');
        activPlayer = createElem('div', 'activ-player');
        const activTimer = createElem('div', 'activ-timer');
        activTimer.textContent = '0:00'
        const activText = createElem('div', 'activ-text');
        activText.textContent = 'Player 1’s Turn'
        activPlayer.append(activTimer, activText)

        const gameCellsContainer = createElem('div', 'game-cells_container');
        const gameCells = createElem('div', 'game-cells');
        for (let i = 0; i < 9; i++) {
            const cell = createElem('div', `cell-${i + 1}`);
            cell.addEventListener('click', () => {
                //console.log(game.getActivePlayer())
                if (cell.id !== 'active') game.playRound(i)
                //game.playRound(i)
                if (game.getActivePlayer().symbol === 'X' && cell.id !== 'active') {
                    cell.style.background = `url(${'./cross.png'})`
                    cell.id = 'active'
                }
                if (game.getActivePlayer().symbol === '0' && cell.id !== 'active') {
                    cell.style.background = `url(${'./round.png'})`
                    cell.id = 'active'
                }
            })
            gameCells.append(cell)
        }
        gameCellsContainer.append(gameCells)
        gamefield.append(activPlayer, gameCellsContainer)
        return gamefield;
    }

    const modalFunc = () => {
        const modal = createElem('div', 'modal-winner');
        const modalItem = createElem('div', 'modal-item');
        const modalItemText = createElem('div', 'modal-item_text');
        const modalItemReset = createElem('div', 'modal-item_reset');
        modalItemReset.addEventListener('click', () => {
            startGame();
            modal.style.display = 'none'
            fieldgame = gameField()
            game = GameController();
        })
        modalItemReset.textContent = 'Reset'
        modalItem.append(modalItemText, modalItemReset);
        modal.append(modalItem);
        document.querySelector('body').append(modal);
        return { modalItemText, modal }
    }


    startGame();
    let fieldgame = gameField()
    const { modalItemText, modal } = modalFunc();
    return { activPlayer, modalItemText, modal }
}


function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const board = Gameboard();
    let timer1;
    const players = [
        {
            name: playerOneName,
            token: 1,
            symbol: ''
        },
        {
            name: playerTwoName,
            token: 2,
            symbol: ''
        }
    ];

    let activePlayer = players[0];


    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
    const setOnePlayerSym = (str, str2) => { players[0].symbol = str; players[1].symbol = str2 };
    const setTwoPlayerSym = (str, str2) => { players[1].symbol = str; players[0].symbol = str2 };

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (id) => {
        clearInterval(timer1)
        board.dropToken(id, getActivePlayer().token);
        if (getActivePlayer().name !== "Player 1") { html.activPlayer.children[1].textContent = `Player 1's Turn` } else { html.activPlayer.children[1].textContent = `Player 2's Turn` }
        timerRound()
        checkWinner();
        switchPlayerTurn();
        printNewRound();
    };
    const checkWinner = () => {
        let bo = board.printBoard()
        console.log(('' + bo[0] + bo[4] + bo[8]))
        if (('' + bo[0] + bo[1] + bo[2]) === '111' || ('' + bo[0] + bo[1] + bo[2]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[3] + bo[4] + bo[5]) === '111' || ('' + bo[3] + bo[4] + bo[5]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[6] + bo[7] + bo[8]) === '111' || ('' + bo[6] + bo[7] + bo[8]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[0] + bo[4] + bo[8]) === '111' || ('' + bo[0] + bo[4] + bo[8]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[6] + bo[4] + bo[2]) === '111' || ('' + bo[6] + bo[4] + bo[2]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[0] + bo[3] + bo[6]) === '111' || ('' + bo[0] + bo[3] + bo[6]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[1] + bo[4] + bo[7]) === '111' || ('' + bo[1] + bo[4] + bo[7]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (('' + bo[2] + bo[5] + bo[8]) === '111' || ('' + bo[2] + bo[5] + bo[8]) === '222') { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Победил игрок " + getActivePlayer().token }
        if (!bo.includes(0)) { html.modal.style.display = 'flex'; html.modalItemText.textContent = "Ничья" }
    }

    const timerRound = () => {
        let timer = '0:00';
        html.activPlayer.children[0].textContent = '0:00'
        let min = 0;
        let sec = 0;
        timer1 = setInterval(() => {
            sec++;
            if (sec === 60) {
                min++;
                sec = 0;
            }
            timer = `${min}:${sec < 10 ? '0' + sec : sec}`
            html.activPlayer.children[0].textContent = timer;
        }, 1000)


    }
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        switchPlayerTurn,
        timerRound,
        setOnePlayerSym,
        setTwoPlayerSym
    };
}
const game = GameController();
const html = HtmlControler()







//function checkWinner(board) {
//    // Проверка горизонтальных линий
//    for (let row = 0; row < 3; row++) {
//        if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
//            return board[row][0];
//        }
//    }

//    // Проверка вертикальных линий
//    for (let col = 0; col < 3; col++) {
//        if (board[0][col] !== '' && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
//            return board[0][col];
//        }
//    }

//    // Проверка диагоналей
//    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
//        return board[0][0];
//    }

//    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
//        return board[0][2];
//    }

//    // Ничья
//    if (board.flat().every(cell => cell !== '')) {
//        return 'tie';
//    }

//    // Нет победителя
//    return null;
//}

//// Пример использования
//const board = [
//    ['X', 'O', 'X'],
//    ['O', 'X', 'O'],
//    ['O', 'X', 'X']
//];

//const winner = checkWinner(board);

//if (winner) {
//    if (winner === 'tie') {
//        console.log('Ничья!');
//    } else {
//        console.log(`Победитель: ${winner}`);
//    }
//} else {
//    console.log('Нет победителя');
//}
