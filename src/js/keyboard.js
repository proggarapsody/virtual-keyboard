import json from './keys.json';
import jsonMobile from './phone-keys.json';
import { themeSwitcher } from './theme';

document.querySelector('body').innerHTML = `<select name="theme" id="select">
<option value="orange">Orange</option>
<option value="pink">Pink</option>
<option value="blue">Blue</option>
</select><textarea tabindex="-1" class="textarea"></textarea><div class="keyboard"><div class="keyboard__container"></div></div><div class="help noselect">Press Left ctrl + Left alt to change language</div>`;

themeSwitcher();

const data = window.innerWidth < 768 ? Object.entries(jsonMobile) : Object.entries(json);
const container = document.querySelector('.keyboard__container');
const textarea = document.querySelector('.textarea');

let isCaps = false;
let isShift = false;
let lang = window.localStorage.getItem('lang') || 'eng';

function fillKeyboard() {
  for (const [key, value] of data) {
    container.innerHTML += `<div class="keyboard__key key ${key}"><span data-shiftCaps="${
      value.eng.shiftCaps
    }" data-caseDown="${value.eng.caseDown}" data-caseUp="${value.eng.caseUp}" data-caps="${
      value.eng.caps
    }" class="eng ${lang == 'eng' ? '' : 'hidden'} noselect">${
      value.eng.caseDown
    }</span><span data-shiftCaps="${value.rus.shiftCaps}" data-caseDown="${
      value.rus.caseDown
    }" data-caseUp="${value.rus.caseUp}" data-caps="${value.rus.caps}" class="rus ${
      lang == 'rus' ? '' : 'hidden'
    } noselect">${value.rus.caseDown}</span></div>`;
  }
}

fillKeyboard();

const shiftLeft = container.querySelector('.ShiftLeft');
const shiftRight = container.querySelector('.ShiftRight');
const capsLock = container.querySelector(`.CapsLock`);
const keys = container.querySelectorAll(`.key:not(.OSLeft)`);

textarea.addEventListener('change', (e) => {
  e.preventDefault();
  return false;
});

document.addEventListener('keydown', (event) => {
  try {
    const name = event.key;
    const code = event.code;
    const key = container.querySelector(`.${code}`);
    const text = key.querySelector(`span:not(.hidden)`).textContent;

    if (isFunctionalButton(event, name, code)) {
      textarea.value += text;
    } else if (code == 'Space') {
      textarea.value += ' ';
    } else if (code == 'Backspace' || name == 'delete' || name == 'Delete') {
      if (textarea.value.length) {
        textarea.value = textarea.value.slice(0, -1);
      }
    } else if (
      (name == 'Alt' && event.ctrlKey) ||
      (name == 'Control' && event.altKey) ||
      code == 'ChangeLanguage'
    ) {
      changeLanguage();
    } else if (name == 'enter' || name == 'Enter') {
      textarea.value += '\r\n';
    } else if (name == 'tab' || name == 'Tab') {
      textarea.value += '   ';
    }
    if (!event.repeat) {
      if (key.classList.contains('CapsLock')) {
        CapsLock();
      } else if (code == 'ShiftLeft' || code == 'ShiftRight') {
        shift(code);
      } else {
        key.classList.add('active');
      }
    } else {
      key.classList.add('active');
    }
  } catch (error) {
    // empty
  }
});

document.addEventListener('keyup', (event) => {
  const code = event.code;

  try {
    if (event.key == 'Shift' || event.key == 'shift') {
      shift(code);
      return;
    }
    container.querySelector(`.${code}:not(.CapsLock)`).classList.remove('active');
  } catch (error) {
    // empty
  }
});

keys.forEach((el) => {
  el.addEventListener('mousedown', onClick);
});
keys.forEach((el) => {
  el.addEventListener('mouseup', onUp);
});

function setActive(str) {
  keys.forEach((el) => {
    const span = el.querySelector(`span:not(.hidden)`);

    span.textContent = span.getAttribute(`data-${str}`);
  });
}

function CapsLock() {
  try {
    if (!isCaps) {
      setActive('caps');
      capsLock.classList.add('active');
      isCaps = true;
    } else {
      setActive('caseDown');
      capsLock.classList.remove('active');
      isCaps = false;
    }
  } catch (error) {
    // empty
  }
}

function shift(code) {
  try {
    if (!isShift) {
      isShift = true;
      if (code == 'ShiftLeft') {
        shiftLeft.classList.add('active');
      } else if (code == 'ShiftRight') {
        shiftRight.classList.add('active');
      }
      if (isCaps) {
        setActive('shiftCaps');
      } else {
        setActive('caseUp');
      }
    } else {
      if (code == 'ShiftLeft') {
        shiftLeft.classList.remove('active');
      } else if (code == 'ShiftRight') {
        shiftRight.classList.remove('active');
      }
      if (isCaps) {
        setActive('caps');
      } else {
        setActive('caseDown');
      }
      isShift = false;
    }
  } catch (error) {
    // empty
  }
}

function changeLanguage() {
  try {
    if (lang == 'rus') {
      lang = 'eng';
      container.querySelectorAll('.rus').forEach((el) => el.classList.add('hidden'));
      container.querySelectorAll('.eng').forEach((el) => el.classList.remove('hidden'));
      localStorage.setItem('lang', lang);
    } else if (lang == 'eng') {
      lang = 'rus';
      container.querySelectorAll('.rus').forEach((el) => el.classList.remove('hidden'));
      container.querySelectorAll('.eng').forEach((el) => el.classList.add('hidden'));
      localStorage.setItem('lang', lang);
    }
  } catch (error) {
    // empty
  }
}

function onClick(e) {
  const el = e.currentTarget.querySelector(`span:not(.hidden)`);
  const code = e.currentTarget.classList[e.currentTarget.classList.length - 1];

  if (
    (e.currentTarget.classList.contains('ShiftRight') && e.shiftKey) ||
    (e.currentTarget.classList.contains('ShiftLeft') && e.shiftKey)
  ) {
    if (isShift) {
      return;
    }
  }

  e.currentTarget.classList.add('active');
  if (el) {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: el.textContent,
        code: code,
      })
    );
  }
}

function onUp(e) {
  const el = e.currentTarget.querySelector(`span:not(.hidden)`);
  const code = e.currentTarget.classList[e.currentTarget.classList.length - 1];

  if (e.currentTarget.classList.contains('CapsLock') && code == 'active') {
    return;
  }

  if (
    (e.currentTarget.classList.contains('ShiftRight') && e.shiftKey) ||
    (e.currentTarget.classList.contains('ShiftLeft') && e.shiftKey)
  ) {
    return;
  }

  e.currentTarget.classList.remove('active');
  if (el) {
    document.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: el.textContent,
        code: code,
      })
    );
  }
}
function isFunctionalButton(e, name, code) {
  return (
    code != 'Backspace' &&
    code != 'Tab' &&
    code != 'CapsLock' &&
    code != 'ShiftLeft' &&
    code != 'ShiftRight' &&
    code != 'ShiftLeft' &&
    code != 'ShiftRight' &&
    code != 'ControlLeft' &&
    code != 'ControlRight' &&
    name != 'Enter' &&
    code != 'AltLeft' &&
    code != 'AltRight' &&
    code != 'Space' &&
    code != 'Escape' &&
    name != 'OS' &&
    name != 'fn' &&
    code != 'OSleft' &&
    code != 'active' &&
    code != 'OSRight' &&
    name != 'insert' &&
    name != 'delete' &&
    name != 'Delete' &&
    name != 'Insert' &&
    name != 'enter' &&
    name != 'tab' &&
    code != 'ChangeLanguage' &&
    name != 'ControlLeft' &&
    !e.ctrlKey
  );
}
