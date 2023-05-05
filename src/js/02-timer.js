import Notiflix from 'notiflix';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datetimeInputEl = document.getElementById('datetime-picker');
const btnStart = document.querySelector('[data-start]');
const timerEl = document.querySelector('.timer');

let selectedDate;
let timerId = null;

btnStart.setAttribute('disabled', '');
btnStart.style.fontSize = '30px';

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    statusSelectedDate();
  },
});

function statusSelectedDate() {
  if (selectedDate - new Date() < 0) {
    return Notiflix.Notify.failure('Please choose a date in the future', {
      clickToClose: true,
    });
  }
  preparesForStart();
}

function preparesForStart() {
  Notiflix.Notify.info(
    'You have selected the correct date, click the "Start button" to start the timer.',
    {
      clickToClose: true,
    }
  );

  btnStart.removeAttribute('disabled');
  btnStart.addEventListener('click', onStartBtnClick);
}

function onStartBtnClick() {
  btnStart.textContent = 'Reset';
  datetimeInputEl.setAttribute('disabled', '');
  btnStart.removeEventListener('click', onStartBtnClick);
  Notiflix.Notify.success('Timer is running!', {
    clickToClose: true,
  });

  updateTimer();

  timerId = setInterval(updateTimer, 1000);

  btnStart.addEventListener('click', onResetBtnClick);
}

function onResetBtnClick() {
  Notiflix.Notify.info('The timer is cleared, select a new date.');

  clearInterval(timerId);

  timerEl.querySelector('[data-days]').textContent = '00';
  timerEl.querySelector('[data-hours]').textContent = '00';
  timerEl.querySelector('[data-minutes]').textContent = '00';
  timerEl.querySelector('[data-seconds]').textContent = '00';

  datetimeInputEl.removeAttribute('disabled');
  btnStart.textContent = 'Start';
  btnStart.setAttribute('disabled', '');
  btnStart.removeEventListener('click', onResetBtnClick);
}

function updateTimer() {
  const { days, hours, minutes, seconds } = convertMs(
    selectedDate - new Date()
  );
  if (selectedDate - new Date() < 0) {
    onResetBtnClick();
    return;
  }

  timerEl.querySelector('[data-days]').textContent = addLeadingZero(days);
  timerEl.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  timerEl.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  timerEl.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
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

  return { days, hours, minutes, seconds };
}
