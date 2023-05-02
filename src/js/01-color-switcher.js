const btnStart = document.querySelector('[data-start]');
const btnStop = document.querySelector('[data-stop]');
let timerId = null;

btnStop.setAttribute('disabled', '');

btnStart.addEventListener('click', () => {
  btnStart.setAttribute('disabled', '');
  btnStop.removeAttribute('disabled');
  setRandomBgColor();
  timerId = setInterval(() => {
    setRandomBgColor();
  }, 1000);
});
btnStop.addEventListener('click', () => {
  clearInterval(timerId);
  btnStop.setAttribute('disabled', '');
  btnStart.removeAttribute('disabled');
  //  document.body.removeAttribute('style');
});

function setRandomBgColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
