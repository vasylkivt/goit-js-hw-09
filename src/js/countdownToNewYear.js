import Notiflix from 'notiflix';

const datetimeInputEl = document.getElementById('year-input');
const btnStart = document.querySelector('[data-start]');
const timerEl = document.querySelector('.timer');
const refs = {
  days: timerEl.querySelector('[data-days]'),
  hours: timerEl.querySelector('[data-hours]'),
  minutes: timerEl.querySelector('[data-minutes]'),
  seconds: timerEl.querySelector('[data-seconds]'),
  milliseconds: timerEl.querySelector('[data-milliseconds]'),
};

let selectedDate;
let timerId = null;

btnStart.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  selectedDate = new Date(`01-01-${datetimeInputEl.value} 00:00:00`);

  btnStart.textContent = 'Reset';
  datetimeInputEl.setAttribute('disabled', '');
  btnStart.removeEventListener('click', onStartBtnClick);
  Notiflix.Notify.success('Timer is running!', {
    clickToClose: true,
  });
  updateTimer();
  timerId = setInterval(updateTimer, 48);
  btnStart.addEventListener('click', onResetBtnClick);
}

function onResetBtnClick() {
  Notiflix.Notify.info('The timer is cleared, select a new date.');

  clearInterval(timerId);

  refs.days.textContent = '00';
  refs.hours.textContent = '00';
  refs.minutes.textContent = '00';
  refs.seconds.textContent = '00';
  refs.milliseconds.textContent = '000';

  btnStart.textContent = 'Start';
  datetimeInputEl.removeAttribute('disabled');

  btnStart.removeEventListener('click', onResetBtnClick);
  btnStart.addEventListener('click', onStartBtnClick);
}

function updateTimer() {
  const { days, hours, minutes, seconds, milliseconds } = convertMs(
    selectedDate - new Date()
  );
  if (selectedDate - new Date() < 0) {
    onResetBtnClick();
    return;
  }

  refs.days.textContent = addLeadingZero(days, 2);
  refs.hours.textContent = addLeadingZero(hours, 2);
  refs.minutes.textContent = addLeadingZero(minutes, 2);
  refs.seconds.textContent = addLeadingZero(seconds, 2);
  refs.milliseconds.textContent = addLeadingZero(milliseconds, 3);
}

function addLeadingZero(value, amount) {
  return value.toString().padStart(amount, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  const milliseconds = Math.floor((((ms % day) % hour) % minute) % second);

  return { days, hours, minutes, seconds, milliseconds };
}
