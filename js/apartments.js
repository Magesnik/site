// ============================================
// Пиротска 123 - Apartments page logic
// ============================================

let allData = null;
let filteredList = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allData = await loadData();
    initFilters();
    applyFilters();
  } catch (e) {
    document.getElementById('apartments-container').innerHTML =
      '<p class="text-muted text-center">Грешка при зареждане на данните: ' + e.message + '</p>';
  }
});

function initFilters() {
  // Попълваме филтъра за етажи
  const floors = [...new Set(allData.apartments.map(a => a.floor))].sort((a,b) => a-b);
  const floorSel = document.getElementById('filter-floor');
  floors.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = `${f}-ри етаж`;
    floorSel.appendChild(opt);
  });

  // Закачаме event listeners
  ['filter-floor', 'filter-type', 'filter-status', 'filter-area-min', 'filter-area-max']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', applyFilters);
    });

  document.getElementById('btn-reset').addEventListener('click', resetFilters);
}

function applyFilters() {
  const floor = document.getElementById('filter-floor').value;
  const type = document.getElementById('filter-type').value;
  const status = document.getElementById('filter-status').value;
  const areaMin = parseFloat(document.getElementById('filter-area-min').value) || 0;
  const areaMax = parseFloat(document.getElementById('filter-area-max').value) || Infinity;

  filteredList = allData.apartments.filter(a => {
    if (floor && a.floor != floor) return false;
    if (type && a.type !== type) return false;
    if (status && a.status !== status) return false;
    if (a.area_total < areaMin || a.area_total > areaMax) return false;
    return true;
  });

  renderTable();
}

function resetFilters() {
  document.querySelectorAll('.filters select, .filters input').forEach(el => el.value = '');
  applyFilters();
}

function renderTable() {
  const summary = document.getElementById('results-summary');
  summary.textContent = `Показани ${filteredList.length} от ${allData.apartments.length} апартамента`;

  const tbody = document.querySelector('#apartments-table tbody');
  if (filteredList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:2rem">Няма намерени резултати. Опитайте с други филтри.</td></tr>';
    return;
  }

  tbody.innerHTML = filteredList.map(a => `
    <tr data-id="${a.id}">
      <td><strong>${a.number}</strong></td>
      <td>${typeLabel(a.type)}</td>
      <td class="num">${a.floor}</td>
      <td class="num">${formatNumber(a.area_net)}</td>
      <td class="num">${formatNumber(a.area_total)}</td>
      <td class="num">${a.price !== null ? formatNumber(a.price, 0) : '<span class="text-muted">—</span>'}</td>
      <td><span class="status status-${a.status}">${statusLabel(a.status)}</span></td>
      <td><button class="btn-ghost btn" style="padding:0.4rem 0.9rem;font-size:0.85rem" onclick="showDetails('${a.id}')">Детайли</button></td>
    </tr>
  `).join('');
}

function showDetails(id) {
  const a = allData.apartments.find(x => x.id === id);
  if (!a) return;

  const floorImg = a.floor >= 2 && a.floor <= 7 ? `floors/img/floor-${a.floor}.jpg` : '';
  const pdfLink = a.floor >= 2 && a.floor <= 7 ? `floors/pdf/floor-${a.floor}.pdf` : '';

  document.getElementById('modal-title').textContent =
    `${typeLabel(a.type)} №${a.number}`;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-grid">
      <div class="item">
        <span class="label">Етаж</span>
        <span class="value">${a.floor}-ри</span>
      </div>
      <div class="item">
        <span class="label">Статус</span>
        <span class="value"><span class="status status-${a.status}">${statusLabel(a.status)}</span></span>
      </div>
      <div class="item">
        <span class="label">Чиста площ</span>
        <span class="value">${formatNumber(a.area_net)} м²</span>
      </div>
      <div class="item">
        <span class="label">Обща площ</span>
        <span class="value">${formatNumber(a.area_total)} м²</span>
      </div>
      <div class="item">
        <span class="label">Идеални части</span>
        <span class="value">${formatNumber(a.area_ideal)} м²</span>
      </div>
      <div class="item">
        <span class="label">% от сградата</span>
        <span class="value">${formatNumber(a.ideal_pct, 4)}%</span>
      </div>
    </div>
    ${a.notes ? `<p class="info-box"><strong>Забележка:</strong> ${a.notes}</p>` : ''}
    <div class="item" style="background:var(--color-bg);padding:1rem;border-radius:var(--radius);margin-bottom:1rem">
      <span class="label">Цена</span>
      <span class="value">${a.price !== null ? formatNumber(a.price, 0) + ' лв' : 'При запитване'}</span>
    </div>
    ${floorImg ? `<img src="${floorImg}" alt="План на ${a.floor}-ри етаж" style="width:100%;border-radius:var(--radius);margin:1rem 0;cursor:zoom-in" onclick="window.open(this.src)">` : ''}
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
      ${pdfLink ? `<a href="${pdfLink}" target="_blank" class="btn btn-ghost">📄 Свали PDF на етажа</a>` : ''}
      <a href="contact.html?unit=${a.id}" class="btn btn-primary">Направи запитване</a>
    </div>
  `;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Затваряне на модал с ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
