import Notiflix from 'notiflix';

const formEl = document.querySelector('.form');
const formBtnEl = formEl.querySelector('button');

// formEl.elements.delay.value = 1100;
// formEl.elements.step.value = 500;
// formEl.elements.amount.value = 7;

formEl.addEventListener('submit', onSubmit);

/**
 *? Обробляє подію submit форми
 * @param {Event} e - Об'єкт події submit
 */
function onSubmit(e) {
  e.preventDefault();

  formBtnEl.setAttribute('disabled', '');

  const {
    elements: { delay, amount, step },
  } = e.currentTarget;
  const delayValue = Number(delay.value);
  const amountValue = Number(amount.value);
  const stepValue = Number(step.value);

  let promiseDelay = delayValue;
  let promiseCount = 1;

  for (let i = 0; i < amountValue; i++) {
    createPromise(promiseCount, promiseDelay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      })
      .finally(() => {
        formBtnEl.removeAttribute('disabled');
      });
    promiseCount += 1;
    promiseDelay += stepValue;
  }
}

/**
 *? Створює об'єкт Promise з випадковим вирішенням або відхиленням
 * @param {number} position - Позиція обіцянки
 * @param {number} delay - Затримка перед вирішенням або відхиленням
 * @returns {Promise} - Об'єкт Promise
 */
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    if (shouldResolve) {
      setTimeout(() => {
        resolve({ position, delay });
      }, delay);
    } else {
      setTimeout(() => {
        reject({ position, delay });
      }, delay);
    }
  });
}
