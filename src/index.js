import { startTimer, stopTimer } from "./js/timer.js";
import { convert } from "./js/utils.js";

let isFirstClick = true;
let flagsPlaced = 0;
let bombsQuantity = 40;

function startGame(width, height) {

    const field = document.querySelector('.field');
    const cellsCounter = width * height;
    const emoji = document.querySelector('.emoji');
    let closedCellCounter = cellsCounter;

    emoji.addEventListener('mousedown', (evt) => {
        if (evt.button === 0) {
            emoji.classList.toggle('smile-mousedown')
        }
    })

    emoji.addEventListener('mouseup', (evt) => {
        if (evt.button === 0) {
            emoji.classList.toggle('smile-mousedown');
            window.document.location.reload();
        }
    })

    for (let i = 0; i < cellsCounter; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell', 'default');
        field.append(cell);
    }

    const bombs = [...Array(cellsCounter).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombsQuantity)

    field.addEventListener('mousedown', (evt) => {
        if (evt.target.tagName === 'BUTTON' && isFirstClick) {
            startTimer();
            isFirstClick = false;
        }


        if (evt.target.tagName === 'BUTTON' && evt.button === 0) {
            emoji.classList.toggle('scare');
            evt.target.classList.add('open');
        }
    });

    field.addEventListener('contextmenu', (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== 'BUTTON') {
            return
        }
        if (evt.button === 2) {
            evt.target.classList.add('flag');
            evt.target.disabled = true;
            flagsPlaced++;
            updateBombCounter();
        }

    })

    field.addEventListener('mouseup', (evt) => {
        if (evt.target.tagName !== 'BUTTON') {
            return
        }
        if (evt.button === 0) {
            emoji.classList.toggle('scare');
            evt.target.classList.add('open');
            const cells = [...field.children];
            const index = cells.indexOf(evt.target);
            const column = index % width;
            const row = Math.floor(index / width);
            open(row, column);
        }
    })

    function updateBombCounter() {
        const counterElements = document.querySelectorAll('.counter .digit');
        const remainingBombs = bombsQuantity - flagsPlaced;
        const remainingBombsStr = remainingBombs.toString().padStart(3, '0');
        const digits = remainingBombsStr.split('');
        counterElements.forEach((element, index) => {
            element.className = `digit digit-${digits[index]}`;
        });
    }

    function countBombsAround(row, column) {
        let counter = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (isBomb(row + y, column + x)) {
                    counter++
                }
            }
        }
        return counter
    }

    function open(row, column) {

        if (!isValid(row, column)) return;

        const index = row * width + column;
        const cells = [...field.children];
        const cell = cells[index];
        const bombsAround = countBombsAround(row, column)

        if (cell.disabled === true) return;
        cell.disabled = true;
        closedCellCounter--;
        if (closedCellCounter <= bombsQuantity) {
            cell.classList.add(convert(bombsAround))
            emoji.classList.add('winner')
            stopTimer();
            return
        }

        if (isBomb(row, column)) {
            cell.classList.add('bomb-loser')
            emoji.classList.add('loser')
            stopTimer();
            cells.forEach((cell, index) => {
                if (bombs.includes(index)) {
                    cell.classList.add('bomb');
                }
            });
            return
        } else if (bombsAround !== 0) {
            cell.classList.add(convert(bombsAround))
            return
        } else if (bombsAround === 0) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    cell.classList.add('open')
                    open(row + y, column + x)
                }
            }
        }
    }

    function isBomb(row, column) {
        if (!isValid(row, column)) {
            return false
        }
        const index = row * width + column;
        return bombs.includes(index)
    }

    function isValid(row, column) {
        return row >= 0 && row < height && column >= 0 && column < width;
    }
}

function renderCounterAndTimer() {
    const counterElement = document.querySelector('.counter');
    const timerElement = document.querySelector('.timer');

    for (let i = 0; i < 3; i++) {
        const digitSpan = document.createElement('span');
        digitSpan.classList.add('digit', `digit-${i}`);
        if (i === 1) {
            digitSpan.classList.add('digit-4');
        } else {
            digitSpan.classList.add('digit-0');
        }
        counterElement.appendChild(digitSpan);
    }

    for (let i = 0; i < 3; i++) {
        const digitSpan = document.createElement('span');
        digitSpan.classList.add('digit', 'digit-0');
        timerElement.appendChild(digitSpan);
    }
}

renderCounterAndTimer();
startGame(16, 16);
updateBombCounter();

