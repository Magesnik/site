// ============================================
// Пиротска 123 - Общи функции (навигация, помощни)
// ============================================

// Mobile навигация
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }

  // Подчертава активната страница в навигацията
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});

// Помощник за форматиране на числа в български стил
function formatNumber(n, decimals = 2) {
  if (n === null || n === undefined) return '—';
  return n.toLocaleString('bg-BG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Преобразува статус към български текст
function statusLabel(s) {
  const map = {
    available: 'Свободен',
    reserved: 'Резервиран',
    sold: 'Продаден'
  };
  return map[s] || s;
}

// Преобразува тип към удобен формат
function typeLabel(t) {
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// Зареждане на JSON данните
async function loadData() {
  const res = await fetch('data/apartments.json');
  if (!res.ok) throw new Error('Не успях да заредя данните');
  return res.json();
}
