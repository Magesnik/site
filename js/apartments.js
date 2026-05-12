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
      <td><span class="status status-${a.status}">${statusLabel(a.status)}</span></td>
      <td class="col-plan">${planThumbButton(a)}</td>
      <td><button class="btn-ghost btn" style="padding:0.4rem 0.9rem;font-size:0.85rem" onclick="showDetails('${a.id}')">Детайли</button></td>
    </tr>
  `).join('');
}

// Бутон с миниатюра на плана (или disabled placeholder, ако още няма снимка)
function planThumbButton(a) {
  if (a.plan_image) {
    const thumb = a.plan_thumb || a.plan_image;
    return `<button class="plan-thumb-btn" title="Виж плана на ${typeLabel(a.type).toLowerCase()} №${a.number}" onclick="openApartmentImage('${a.id}')">
      <img src="${thumb}" alt="План на ${typeLabel(a.type)} №${a.number}" loading="lazy">
    </button>`;
  }
  return `<span class="plan-thumb-empty" title="Снимка на този апартамент скоро">—</span>`;
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
      <span class="value">При запитване</span>
    </div>

    ${a.plan_image ? `
      <div class="apt-plan-block">
        <div class="apt-plan-header">
          <h4 style="margin:0">Илюстративен план на ${typeLabel(a.type).toLowerCase()}а</h4>
          <span class="apt-plan-badge">AI визуализация</span>
        </div>
        <img src="${a.plan_image}" alt="План на ${typeLabel(a.type)} №${a.number}"
             class="apt-plan-img"
             onclick="openApartmentImage('${a.id}')"
             loading="lazy">
        <p class="apt-plan-note">Изображението е генерирано от изкуствен интелект по архитектурната скица и служи единствено за илюстрация на разпределението. Клик за уголемяване.</p>
      </div>
    ` : ''}

    ${floorImg ? `<img src="${floorImg}" alt="План на ${a.floor}-ри етаж" style="width:100%;border-radius:var(--radius);margin:1rem 0;cursor:zoom-in" onclick="window.open(this.src)">` : ''}
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
      ${pdfLink ? `<a href="${pdfLink}" target="_blank" class="btn btn-ghost">📄 Свали PDF на етажа</a>` : ''}
      <a href="contact.html?unit=${a.id}" class="btn btn-primary">Направи запитване</a>
    </div>
  `;
  document.getElementById('modal').classList.add('open');
}

// ============================================
// Image viewer за плановете на апартаментите
// (zoom + pan + pinch — както на страница „Етажи")
// ============================================
function openApartmentImage(id) {
  const a = allData.apartments.find(x => x.id === id);
  if (!a || !a.plan_image) return;
  const title = `${typeLabel(a.type)} №${a.number} — илюстративен план`;
  openImageViewer(a.plan_image, title);
}

// Глобален viewer (инжектиран веднъж в DOM при първо ползване)
let imgViewerState = { zoom: 1, tx: 0, ty: 0, dragging: false, startX: 0, startY: 0,
                       touchStartDist: 0, touchStartZoom: 1, initialized: false };

function ensureImageViewer() {
  if (document.getElementById('apt-img-viewer')) return;
  const html = `
    <div class="img-viewer" id="apt-img-viewer">
      <div class="img-viewer-header">
        <div class="img-viewer-title" id="apt-img-viewer-title"></div>
        <div class="img-viewer-controls">
          <button onclick="aptImgZoom(0.8)" title="Намали">−</button>
          <button onclick="aptImgResetZoom()" title="Възстанови">⟲</button>
          <button onclick="aptImgZoom(1.25)" title="Увеличи">+</button>
          <button onclick="closeImageViewer()" title="Затвори" class="close">×</button>
        </div>
      </div>
      <div class="img-viewer-stage" id="apt-img-stage">
        <img id="apt-img" src="" alt="" draggable="false">
      </div>
      <div class="img-viewer-hint">Скрол за уголемяване · Влачи за местене · Двоен клик нулира</div>
    </div>`;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  document.body.appendChild(tmp.firstElementChild);
  bindImageViewerEvents();
}

function openImageViewer(src, title) {
  ensureImageViewer();
  document.getElementById('apt-img').src = src;
  document.getElementById('apt-img-viewer-title').textContent = title || 'План';
  aptImgResetZoom();
  document.getElementById('apt-img-viewer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
  const v = document.getElementById('apt-img-viewer');
  if (v) v.classList.remove('open');
  document.body.style.overflow = '';
}

function aptImgResetZoom() {
  imgViewerState.zoom = 1;
  imgViewerState.tx = 0;
  imgViewerState.ty = 0;
  applyImgTransform();
}
function aptImgZoom(factor) {
  imgViewerState.zoom = Math.max(0.3, Math.min(8, imgViewerState.zoom * factor));
  applyImgTransform();
}
function applyImgTransform() {
  const img = document.getElementById('apt-img');
  if (!img) return;
  img.style.transform = `translate(calc(-50% + ${imgViewerState.tx}px), calc(-50% + ${imgViewerState.ty}px)) scale(${imgViewerState.zoom})`;
}

function bindImageViewerEvents() {
  if (imgViewerState.initialized) return;
  imgViewerState.initialized = true;
  const stage = document.getElementById('apt-img-stage');

  // Mouse drag
  document.addEventListener('mousedown', e => {
    if (!e.target.closest('#apt-img-stage')) return;
    if (e.target.tagName !== 'IMG') return;
    imgViewerState.dragging = true;
    imgViewerState.startX = e.clientX - imgViewerState.tx;
    imgViewerState.startY = e.clientY - imgViewerState.ty;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!imgViewerState.dragging) return;
    imgViewerState.tx = e.clientX - imgViewerState.startX;
    imgViewerState.ty = e.clientY - imgViewerState.startY;
    applyImgTransform();
  });
  document.addEventListener('mouseup', () => { imgViewerState.dragging = false; });

  // Wheel zoom
  document.addEventListener('wheel', e => {
    const v = document.getElementById('apt-img-viewer');
    if (!v || !v.classList.contains('open')) return;
    if (!e.target.closest('#apt-img-stage')) return;
    e.preventDefault();
    aptImgZoom(e.deltaY < 0 ? 1.15 : 0.87);
  }, { passive: false });

  // Touch (pinch + drag)
  document.addEventListener('touchstart', e => {
    if (!e.target.closest('#apt-img-stage')) return;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      imgViewerState.touchStartDist = Math.sqrt(dx*dx + dy*dy);
      imgViewerState.touchStartZoom = imgViewerState.zoom;
    } else if (e.touches.length === 1) {
      imgViewerState.dragging = true;
      imgViewerState.startX = e.touches[0].clientX - imgViewerState.tx;
      imgViewerState.startY = e.touches[0].clientY - imgViewerState.ty;
    }
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    const v = document.getElementById('apt-img-viewer');
    if (!v || !v.classList.contains('open')) return;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      imgViewerState.zoom = Math.max(0.3, Math.min(8, imgViewerState.touchStartZoom * (dist / imgViewerState.touchStartDist)));
      applyImgTransform();
      e.preventDefault();
    } else if (imgViewerState.dragging && e.touches.length === 1) {
      imgViewerState.tx = e.touches[0].clientX - imgViewerState.startX;
      imgViewerState.ty = e.touches[0].clientY - imgViewerState.startY;
      applyImgTransform();
    }
  }, { passive: false });
  document.addEventListener('touchend', () => { imgViewerState.dragging = false; });

  // Double click reset
  stage.addEventListener('dblclick', aptImgResetZoom);

  // Keyboard
  document.addEventListener('keydown', e => {
    const v = document.getElementById('apt-img-viewer');
    if (!v || !v.classList.contains('open')) return;
    if (e.key === 'Escape') closeImageViewer();
    if (e.key === '+' || e.key === '=') aptImgZoom(1.2);
    if (e.key === '-') aptImgZoom(0.83);
    if (e.key === '0') aptImgResetZoom();
  });
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Затваряне на модал с ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
