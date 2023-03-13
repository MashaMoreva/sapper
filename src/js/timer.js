let timer;

export function startTimer() {
  const timerElem = document.getElementById('timer');
  timerElem.textContent = '000';
  let seconds = 0;
  timer = setInterval(() => {
    seconds++;
    const secondsStr = seconds.toString().padStart(3, '0');
    timerElem.textContent = secondsStr;
  }, 1000);

  return timer;
}

export function stopTimer() {
  clearInterval(timer);
}


// timer = setInterval(function () {
//     seconds = timeMinut % 60 // Получаем секунды
//     minutes = timeMinut / 60 % 60 // Получаем минуты
//     hour = timeMinut / 60 / 60 % 60 // Получаем часы
//     // Условие если время закончилось то...
//     if (timeMinut <= 0) {
//         // Таймер удаляется
//         clearInterval(timer);
//         // Выводит сообщение что время закончилось
//         alert("Время закончилось");
//     } else { // Иначе
//         // Создаём строку с выводом времени
//         let strTimer = `${Math.trunc(hour)}:${Math.trunc(minuts)}:${seconds}`;
//         // Выводим строку в блок для показа таймера
//         timerShow.innerHTML = strTimer;
//     }
//     --timeMinut; // Уменьшаем таймер
// }, 1000)


// Вам нужен обычный таймер отсчета, только вместо цифр ставите картинки соответствующие
// 1. делаем массив / словарь цифр, где ключ соответствует числу цифры на картинке
// 2. выводим время в нужном формате(12: 23)
// 3. заменяем все цифры в строке на эквивалент с картинками

// var images = {
//     '1': 'digit-one',
//     '2': 'digit-two',
//     '3': 'three',
// };

// "12:23".split('').map((item) => {
//     return "<img src='" + images[item] + "'>"
// }).join('')
//"<img src='/img/1.jpg'><img src='/img/2.jpg'><img src='/img/splitter.jpg'><img src='/img/2.

