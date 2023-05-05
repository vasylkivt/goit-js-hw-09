import Notiflix from 'notiflix';

const formEl = document.querySelector('.form');
const formBtnEl = formEl.querySelector('button');

// formEl.elements.delay.value = 1100;
// formEl.elements.step.value = 1500;
// formEl.elements.amount.value = 7;

formEl.addEventListener('submit', onSubmit);

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

// formEl.addEventListener('submit', function (e) {
//   e.preventDefault();

//   const {
//     elements: { delay, amount, step },
//   } = e.currentTarget;

//   let delays = delay.value;

//   for (let i = 1; i <= amount.value; i++) {
//     setTimeout(createPromise, delays, i, delays);
//     delays = +delays + +step.value;
//     console.log('delays:', delays);
//   }
// });

// function createPromise(position, delay) {
//   const shouldResolve = Math.random() > 0.3;

//   if (shouldResolve) {
//     Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
//   } else {
//     Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
//   }
// }
