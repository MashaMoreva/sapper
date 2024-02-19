import { startTimer, stopTimer } from "./timer";
import { convert } from "./utils";
import "./index.scss";

let isFirstClick: boolean = true;
let flagsPlaced: number = 0;
let bombsQuantity: number = 40;

function startGame(width: number, height: number): void {
  const field: HTMLElement = document.querySelector(".field")!;
  const cellsCounter: number = width * height;
  const emoji: HTMLElement = document.querySelector(".emoji")!;
  let closedCellCounter: number = cellsCounter;

  emoji.addEventListener("mousedown", (evt) => {
    if (evt.button === 0) {
      emoji.classList.toggle("smile-mousedown");
    }
  });

  emoji.addEventListener("mouseup", (evt) => {
    if (evt.button === 0) {
      emoji.classList.toggle("smile-mousedown");
      window.document.location.reload();
    }
  });

  for (let i = 0; i < cellsCounter; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell", "default");
    field.append(cell);
  }

  const bombs: number[] = [...Array(cellsCounter).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsQuantity);

  field.addEventListener("mousedown", (evt) => {
    const target = evt.target as HTMLElement;
    if (target.tagName === "BUTTON" && isFirstClick) {
      startTimer();
      isFirstClick = false;
    }

    if (target.tagName === "BUTTON" && evt.button === 0) {
      emoji.classList.toggle("scare");
      target.classList.add("open");
    }
  });

  field.addEventListener("contextmenu", (evt) => {
    evt.preventDefault();
    const target = evt.target as HTMLButtonElement;
    if (target.tagName !== "BUTTON") {
      return;
    }
    if (evt.button === 2) {
      target.classList.add("flag");
      target.disabled = true;
      flagsPlaced++;
      updateBombCounter();
    }
  });

  field.addEventListener("mouseup", (evt) => {
    const target = evt.target as HTMLElement;
    if (target.tagName !== "BUTTON") {
      return;
    }
    if (evt.button === 0) {
      emoji.classList.toggle("scare");
      target.classList.add("open");
      const cells = [...field.children];
      const index = cells.indexOf(target);
      const column = index % width;
      const row = Math.floor(index / width);
      open(row, column);
    }
  });

  function updateBombCounter() {
    const counterElements = document.querySelectorAll(".counter .digit");
    const remainingBombs = bombsQuantity - flagsPlaced;
    const remainingBombsStr = remainingBombs.toString().padStart(3, "0");
    const digits = remainingBombsStr.split("");
    counterElements.forEach((element, index) => {
      element.className = `digit digit-${digits[index]}`;
    });
  }

  function countBombsAround(row: number, column: number): number {
    let counter = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          counter++;
        }
      }
    }
    return counter;
  }

  function open(row: number, column: number): void {
    if (!isValid(row, column)) return;

    const index = row * width + column;
    const cells: HTMLButtonElement[] = [
      ...field.children,
    ] as HTMLButtonElement[];
    const cell = cells[index];
    const bombsAround = countBombsAround(row, column);

    if (cell.disabled === true) return;
    cell.disabled = true;
    closedCellCounter--;
    if (closedCellCounter <= bombsQuantity) {
      cell.classList.add(convert(bombsAround));
      emoji.classList.add("winner");
      stopTimer();
      return;
    }

    if (isBomb(row, column)) {
      cell.classList.add("bomb-loser");
      emoji.classList.add("loser");
      stopTimer();
      cells.forEach((cell, index) => {
        const isBomb = bombs.includes(index);
        const isFlagged = cell.classList.contains("flag");
        if (isBomb) {
          if (!isFlagged) {
            cell.classList.add("bomb");
          }
        } else if (isFlagged) {
          cell.classList.add("bomb-error");
        }
      });
      return;
    } else if (bombsAround !== 0) {
      cell.classList.add(convert(bombsAround));
      return;
    } else if (bombsAround === 0) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          cell.classList.add("open");
          open(row + y, column + x);
        }
      }
    }
  }

  function isBomb(row: number, column: number): boolean {
    if (!isValid(row, column)) {
      return false;
    }
    const index = row * width + column;
    return bombs.includes(index);
  }

  function isValid(row: number, column: number): boolean {
    return row >= 0 && row < height && column >= 0 && column < width;
  }
}

function renderCounterAndTimer(): void {
  const counterElement: HTMLElement = document.querySelector(".counter")!;
  const timerElement: HTMLElement = document.querySelector(".timer")!;

  for (let i = 0; i < 3; i++) {
    const digitSpan = document.createElement("span");
    digitSpan.classList.add("digit", `digit-${i}`);
    if (i === 1) {
      digitSpan.classList.add("digit-4");
    } else {
      digitSpan.classList.add("digit-0");
    }
    counterElement.appendChild(digitSpan);
  }

  for (let i = 0; i < 3; i++) {
    const digitSpan = document.createElement("span");
    digitSpan.classList.add("digit", "digit-0");
    timerElement.appendChild(digitSpan);
  }
}

renderCounterAndTimer();
startGame(16, 16);
