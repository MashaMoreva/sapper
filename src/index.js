import { convert } from "./js/utils.js";

function startGame(width, height, bombsQuantity) {
    const field = document.querySelector('.field');
    const cellsCounter = width * height;
    const cell = document.createElement('button');
    cell.classList.add('cell', 'default');
    const emoji = document.querySelector('.emoji');

    let closedCellCounter = cellsCounter;

    emoji.addEventListener('mousedown', () =>
        emoji.classList.toggle('smile-mousedown')
    )

    emoji.addEventListener('mouseup', () =>
        emoji.classList.toggle('smile-mousedown')
    )


    for (let i = 0; i < cellsCounter; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell', 'default');
        field.append(cell);
    }

    const bombs = [...Array(cellsCounter).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombsQuantity)

    console.log(bombs)

    // field.addEventListener('contextmenu', (evt) => {
    //     evt.preventDefault();
    //     if (evt.target.tagName !== 'BUTTON') {
    //         return
    //     }
    //     evt.target.classList.add('flag');
    // })

    // field.addEventListener('mousedown', (evt) => {
    //     if (evt.target.tagName !== 'BUTTON') {
    //         return
    //     }
    //     emoji.classList.toggle('scare');
    //     evt.target.classList.add('open');
    // })

    field.addEventListener('click', (evt) => {
        if (evt.target.tagName !== 'BUTTON') {
            return
        }
        // emoji.classList.toggle('scare');
        const cells = [...field.children];
        const index = cells.indexOf(evt.target);
        const column = index % width;
        const row = Math.floor(index / width);
        open(row, column);
    })

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
            return
        }

        if (isBomb(row, column)) {
            cell.classList.add('bomb-loser')
            emoji.classList.add('loser')
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



    // cell.classList.add(isBomb(row, column) ? 'bomb' : countBombsAround(row, column));

    function isBomb(row, column) {
        if (!isValid(row, column)) {
            return false
        }
        const index = row * width + column;
        return bombs.includes(index)
    }

    function isValid(row, column) {
        return row >= 0
            && row < height
            && column >= 0
            && column < width
    }
}

startGame(16, 16, 10)
