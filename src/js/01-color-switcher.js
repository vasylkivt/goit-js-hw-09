const btnStart = document.querySelector('[data-start]');
const btnStop = document.querySelector('[data-stop]');
let timerId = null;

btnStop.disabled = true;

btnStart.addEventListener('click', startTimer);

btnStop.addEventListener('click', stopTimer);

/**
 *? Функція для початку таймера
 */
function startTimer() {
  btnStart.disabled = true;
  btnStop.disabled = false;
  setRandomBgColor();
  timerId = setInterval(setRandomBgColor, 1000);
}

/**
 *? Функція для зупинки таймера
 */
function stopTimer() {
  clearInterval(timerId);
  btnStop.disabled = true;
  btnStart.disabled = false;
  // document.body.removeAttribute('style');
}

/**
 *? Встановлює випадковий колір фону для елементу <body>
 */
function setRandomBgColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}

/**
 *? Генерує випадковий шістнадцятковий колір
 * @returns {string} - Шістнадцятковий колір у форматі "#RRGGBB"
 */
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}
