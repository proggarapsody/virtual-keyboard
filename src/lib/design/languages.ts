const en = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./'
const ru = 'ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю.'
const shiftedEn = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?'
const shiftedRu = 'Ё!"№;%:?*()_+ЙЦУКЕНГШЩЗХЪ/ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,'
const codes = ['Backquote', ...[...'1234567890'].map(c => `Digit${c}`), 'Minus', 'Equal', ...[...'QWERTYUIOP'].map(c => `Key${c}`), 'BracketLeft', 'BracketRight', 'Backslash', ...[...'ASDFGHJKL'].map(c => `Key${c}`), 'Semicolon', 'Quote', ...[...'ZXCVBNM'].map(c => `Key${c}`), 'Comma', 'Period', 'Slash']
export function output(code: string, language: 'en' | 'ru', shift: boolean, caps: boolean) {
  if (code === 'Space') return ' '
  if (code.startsWith('Numpad')) return ({ NumpadAdd: '+', NumpadSubtract: '-', NumpadMultiply: '*', NumpadDivide: '/', NumpadDecimal: '.' } as Record<string, string>)[code] ?? (/^Numpad\d$/.test(code) ? code.slice(-1) : '')
  const index = codes.indexOf(code)
  if (index < 0) return ''
  const normal = (language === 'en' ? en : ru)[index]!
  const upper = (language === 'en' ? shiftedEn : shiftedRu)[index]!
  const isLetter = normal.toUpperCase() !== normal.toLowerCase()
  return (isLetter ? shift !== caps : shift) ? upper : normal
}
