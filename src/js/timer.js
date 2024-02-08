let timer;

export function startTimer() {
  const timerElem = document.querySelector('.timer'); // Получаем элемент таймера 
  let seconds = 0; // Инициализируем счетчик секунд

  // Устанавливаем интервал обновления таймера
  timer = setInterval(() => {
    seconds++;
    const secondsStr = seconds.toString().padStart(3, '0'); // Форматируем секунды
    // Заменяем текст таймера на спрайты с цифрами
    timerElem.innerHTML = secondsStr.split('').map(digit => `<span class="digit digit-${digit}"></span>`).join('');
  }, 1000);

  return timer; // Возвращаем ID интервала
}

export function stopTimer() {
  clearInterval(timer); // Останавливаем таймер
}
