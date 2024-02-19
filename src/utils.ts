export function convert(counter: number): string {
  // Массив с названиями классов спрайтов
  const spriteClasses = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
  ];

  // Проверяем, что значение счетчика находится в диапазоне от 0 до 8
  if (counter >= 0 && counter <= 8) {
    return spriteClasses[counter]; // Возвращаем соответствующий класс спрайта
  } else {
    return ""; // Если значение счетчика некорректно, возвращаем пустую строку
  }
}
