import Notiflix from 'notiflix';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datetimeInputEl = document.getElementById('datetime-picker');
const btnStart = document.querySelector('[data-start]');
const timerEl = document.querySelector('.timer');
const refs = {
  days: timerEl.querySelector('[data-days]'),
  hours: timerEl.querySelector('[data-hours]'),
  minutes: timerEl.querySelector('[data-minutes]'),
  seconds: timerEl.querySelector('[data-seconds]'),
};

let selectedDate;
let timerId = null;

btnStart.disabled = true;
btnStart.style.fontSize = '30px';

/**
 *? Ініціалізація flatpickr для вибору дати та часу
 */
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

/**
 *? Перевіряє вибрану дату та показує відповідне повідомлення
 */
function statusSelectedDate() {
  if (selectedDate - new Date() < 0) {
    btnStart.disabled = true;

    return Notiflix.Notify.failure('Please choose a date in the future', {
      clickToClose: true,
    });
  }
  preparesForStart();
}

/**
 *? Підготовка до початку таймера
 */
function preparesForStart() {
  Notiflix.Notify.info(
    'You have selected the correct date, click the "Start button" to start the timer.',
    {
      clickToClose: true,
    }
  );

  btnStart.disabled = false;
  btnStart.addEventListener('click', onStartBtnClick);
}

/**
 *? Обробник кліку на кнопку "Start"
 */
function onStartBtnClick() {
  btnStart.textContent = 'Reset';
  datetimeInputEl.disabled = true;
  btnStart.removeEventListener('click', onStartBtnClick);
  Notiflix.Notify.success('Timer is running!', {
    clickToClose: true,
  });

  timerEl.insertAdjacentHTML(
    'beforeend',
    `<div class="field">
        <span class="value" data-milliseconds>000</span>
        <span class="label">Milliseconds</span>
      </div>`
  );

  updateTimer();

  timerId = setInterval(updateTimer, 48);

  btnStart.addEventListener('click', onResetBtnClick);
}

/**
 *? Обробник кліку на кнопку "Reset"
 */
function onResetBtnClick() {
  Notiflix.Notify.info('The timer is cleared, select a new date.');

  clearInterval(timerId);

  refs.days.textContent = '00';
  refs.hours.textContent = '00';
  refs.minutes.textContent = '00';
  refs.seconds.textContent = '00';
  timerEl.querySelector('[data-milliseconds]').parentNode.remove();

  datetimeInputEl.disabled = false;
  btnStart.textContent = 'Start';
  btnStart.disabled = true;
  btnStart.removeEventListener('click', onResetBtnClick);
}

/**
 *? Оновлення значень таймера
 */
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
  timerEl.querySelector('[data-milliseconds]').textContent = addLeadingZero(
    milliseconds,
    3
  );
}

/**
 *? Додавання ведучих нулів до числа
 * @param {number} value - Число
 * @param {number} amount - Максимальна кількість цифр
 * @returns {string} - Число з доданими ведучими нулями
 */
function addLeadingZero(value, amount) {
  return value.toString().padStart(amount, '0');
}

/**
 *? Перетворення мілісекунд у об'єкт з днями, годинами, хвилинами, секундами та мілісекундами
 * @param {number} ms - Кількість мілісекунд
 * @returns {Object} - Об'єкт з днями, годинами, хвилинами, секундами та мілісекундами
 */
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
