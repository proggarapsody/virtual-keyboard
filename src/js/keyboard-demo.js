// import json from './keys.json';
// const body = document.querySelector('body');

// body.innerHTML = `<textarea tabindex="-1" class="textarea"></textarea><div class="keyboard"><div class="keyboard__container"></div></div>`;

// const data = json;

// const container = document.querySelector('.keyboard__container');
// const textarea = document.querySelector('.textarea');

// let isCaps = false;
// let isShift = false;
// let lang = 'eng';

// for (const [key, value] of Object.entries(data)) {
//   container.innerHTML += `<div class="keyboard__key key ${key}"><span class="rus hidden"><span class="caseDown">${value.rus.caseDown}</span><span class="caseUp hidden">${value.rus.caseUp}</span><span class="caps hidden">${value.rus.caps}</span><span class="shiftCaps hidden">${value.rus.shiftCaps}</span></span><span class="eng"><span class="caseDown">${value.eng.caseDown}</span><span class="caseUp hidden">${value.eng.caseUp}</span><span class="caps hidden">${value.eng.caps}</span><span class="shiftCaps hidden">${value.eng.shiftCaps}</span></span></div>`;



// const shiftLeft = container.querySelector('.ShiftLeft');
// const shiftRight = container.querySelector('.ShiftRight');
// const capsLock = container.querySelector(`.CapsLock`);
// const keys = container.querySelectorAll(`.key:not(.OSleft):not(.OSRight)`);

// textarea.addEventListener('change', (e) => {
//   e.preventDefault();
//   return false;
// });

// document.addEventListener('keydown', (event) => {
//   const name = event.key;
//   const code = event.code;
//   const key = container.querySelector(`.${code}`);
//   const text = key.querySelector(`.${lang} span:not(.hidden)`).textContent;

//   if (
//     code != 'Backspace' &&
//     code != 'Tab' &&
//     code != 'CapsLock' &&
//     code != 'ShiftLeft' &&
//     code != 'ShiftRight' &&
//     code != 'ControlLeft' &&
//     code != 'ControlRight' &&
//     name != 'Enter' &&
//     code != 'AltLeft' &&
//     code != 'AltRight' &&
//     code != 'Space'
//   ) {
//     textarea.value += text;
//   } else if (code == 'Space') {
//     textarea.value += ' ';
//   } else if (code == 'Backspace') {
//     if (textarea.value.length) {
//       textarea.value = textarea.value.slice(0, -1);
//     }
//   } else if ((name == 'Alt' && event.ctrlKey) || (name == 'Control' && event.altKey)) {
//     changeLanguage();
//   }

//   try {
//     if (!event.repeat) {
//       if (code == 'CapsLock') {
//         CapsLock();
//       } else if (code == 'ShiftLeft' || code == 'ShiftRight') {
//         shift(code);
//       } else {
//         key.classList.add('active');
//       }
//     } else {
//       key.classList.add('active');
//     }
//   } catch (error) {
//     // empty
//   }
// });

// document.addEventListener('keyup', (event) => {
//   let code = event.code;
//   try {
//     container.querySelector(`.${code}:not(.CapsLock)`).classList.remove('active');

//     if (code == 'ShiftLeft' || code == 'ShiftRight') {
//       shift(code);
//     }
//   } catch (error) {
//     // empty
//   }
// });

// keys.forEach((el) => {
//   el.addEventListener('mousedown', onClick);
// });

// function setActive(str) {
//   keys.forEach((el) => {
//     el.querySelector('.eng:not(.hidden),.rus:not(.hidden)')
//       .querySelectorAll('span')
//       .forEach((s) => {
//         if (s.classList.contains(str)) {
//           s.classList.remove('hidden');
//         } else {
//           s.classList.add('hidden');
//         }
//       });
//   });
// }

// // function disActive(el, str) {
// //   if (str == 'caps') {
// //     el.querySelectorAll('span').forEach((el) => {
// //       if (el.classList.contains(str)) {
// //         el.classList.add('hidden');
// //       }
// //       if (el.classList.contains('caseDown') && !isShift) {
// //         el.classList.remove('hidden');
// //       }
// //     });
// //   }
// // }

// function CapsLock() {
//   try {
//     if (!isCaps) {
//       setActive('caps');
//       capsLock.classList.add('active');
//       isCaps = true;
//     } else {
//       setActive('caseDown');
//       capsLock.classList.remove('active');
//       isCaps = false;
//     }
//   } catch (error) {
//     // empty
//   }
// }

// function shift(code) {
//   try {
//     if (!isShift) {
//       isShift = true;
//       if (code == 'ShiftLeft') {
//         shiftLeft.classList.add('active');
//       } else if (code == 'ShiftRight') {
//         shiftRight.classList.add('active');
//       }
//       if (isCaps) {
//         setActive('shiftCaps');
//       } else {
//         setActive('caseUp');
//       }
//     } else {
//       if (code == 'ShiftLeft') {
//         shiftLeft.classList.remove('active');
//       } else if (code == 'ShiftRight') {
//         shiftRight.classList.remove('active');
//       }
//       if (isCaps) {
//         setActive('caps');
//       } else {
//         setActive('caseDown');
//       }
//       isShift = false;
//     }
//   } catch (error) {
//     // empty
//   }
// }

// function onClick(e) {
//   const el = e.currentTarget.querySelector(`.${lang} span:not(.hidden)`);
//   const code = e.currentTarget.classList[e.currentTarget.classList.length - 1];

//   if (code == 'CapsLock') {
//     CapsLock();
//     return;
//   }
//   if (code == 'active') {
//     CapsLock();
//     return;
//   }

//   e.currentTarget.classList.add('active');
//   document.dispatchEvent(
//     new KeyboardEvent('keydown', {
//       key: el.textContent,
//       code: code,
//     })
//   );
//   e.currentTarget.classList.remove('active');

//   document.dispatchEvent(
//     new KeyboardEvent('keyup', {
//       key: el.textContent,
//       code: code,
//     })
//   );
// }

// function changeLanguage() {
//   if (lang == 'rus') {
//     lang = 'eng';
//     container.querySelectorAll('.rus').forEach((el) => el.classList.add('hidden'));
//     container.querySelectorAll('.eng').forEach((el) => el.classList.remove('hidden'));
//   } else if (lang == 'eng') {
//     lang = 'rus';
//     container.querySelectorAll('.rus').forEach((el) => el.classList.remove('hidden'));
//     container.querySelectorAll('.eng').forEach((el) => el.classList.add('hidden'));
//   }
// }
