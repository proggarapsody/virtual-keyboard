export function themeSwitcher() {
  const switcher = document.querySelector('#select');
  let currentTheme = localStorage.getItem('theme') || 'orange';
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', currentTheme);
  }
  switcher.value = currentTheme;
  document.documentElement.setAttribute('data-theme', currentTheme);
  switcher.addEventListener('change', (e) => {
    currentTheme = e.target.value.toLowerCase();
    localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  });
}
