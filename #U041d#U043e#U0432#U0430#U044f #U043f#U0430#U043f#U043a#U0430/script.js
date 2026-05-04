// app.js — обновлённая версия: модальное окно корректно закрывается, проекты автоматически заполнены (200 items)
document.addEventListener('DOMContentLoaded', () => {
  const TOTAL = 200;
  const grid = document.getElementById('grid');
  const loadMoreBtn = document.getElementById('loadMore');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const heroShowcase = document.getElementById('heroShowcase');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const viewPortfolio = document.getElementById('viewPortfolio');
  const ctaHire = document.getElementById('ctaHire');
  const contactMe = document.getElementById('contactMe');

  // categories distribution
  const categories = ['logo','branding','ui','illustration'];

  // generate projects (200) + mark some as "best cases"
  const projects = [];
  for(let i=1;i<=TOTAL;i++){
    const isLogo = (i <= 150) || Math.random() < 0.7; // majority logos
    const cat = isLogo ? 'logo' : categories[Math.floor(Math.random()*categories.length)];
    const title = (isLogo ? 'Logo' : capitalize(cat)) + ' Project ' + i;
    const color = randomColor(i);
    const accent = randomColor(i + 7);
    const desc = (i <= 8)
      ? XXXINLINECODEXXX0XXXINLINECODEXXX
      : XXXINLINECODEXXX1XXXINLINECODEXXX;
    projects.push({
      id: 'p' + i,
      title,
      category: cat,
      createdAt: Date.now() - i * 86400000,
      color,
      accent,
      description: desc,
      bestCase: i <= 8 // первые 8 — лучшие кейсы
    });
  }

  // helpers
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function randomColor(seed){
    const h = (seed * 37) % 360;
    return XXXINLINECODEXXX2XXXINLINECODEXXX;
  }
  function svgDataUrl(text, bg, w=1200, h=1200){
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
      <rect width='100%' height='100%' fill='${bg}' rx='26' />
      <g transform='translate(${w/2},${h/2})'>
        <circle r='160' fill='rgba(255,255,255,0.06)'/>
        <text x='0' y='20' font-family='Inter, Arial, sans-serif' font-size='120' fill='#fff' font-weight='800' text-anchor='middle'>${escapeHtml(text)}</text>
      </g>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // paging
  let shown = 0;
  const PAGE = 24;

  function renderThumb(project){
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = project.id;
    const initials = project.title.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase();
    const src = svgDataUrl(initials, project.color, 800, 800);
    card.innerHTML = `
      <div class="thumb" style="background:${project.color}">
        <img data-src="${src}" alt="${escapeHtml(project.title)}" class="thumb-img" style="width:100%;height:100%;object-fit:cover;border-radius:8px" />
      </div>
      <div class="item-meta">
        <div class="title">${escapeHtml(project.title)}</div>
        <div class="cat">${capitalize(project.category)} ${project.bestCase ? '• кейс' : ''}</div>
      </div>
    `;
    card.addEventListener('click', ()=> openModal(project));
    return card;
  }

  function openModal(project){
    const initials = project.title.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase();
    const big = svgDataUrl(initials, project.color, 1400, 1400);
    // fill modal content and ensure close button present (close handled globally)
    modalContent.innerHTML = `
      <div class="modal-body" style="display:flex;gap:16px;flex-wrap:wrap">
        <div class="modal-thumb" style="background:${project.color}">
          <img src="${big}" alt="${escapeHtml(project.title)}" style="width:100%;height:100%;object-fit:contain;border-radius:10px"/>
        </div>
        <div class="modal-info">
          <h3>${escapeHtml(project.title)}</h3>
          <p class="muted">${capitalize(project.category)} • ${new Date(project.createdAt).toLocaleDateString()}</p>
          <p>${escapeHtml(project.description)}</p>
          <div style="margin-top:12px;display:flex;gap:8px">
            <a class="btn btn-primary" id="downloadSvg" href="${big}" download="${project.title.replace(/\s+/g,'_')}.svg">Скачать SVG</a>
            <button id="btnContactProject" class="btn btn-ghost">Обсудить этот проект</button>
          </div>
          ${project.bestCase ? XXXINLINECODEXXX3XXXINLINECODEXXX : ''}
        </div>
      </div>
    `;
    // action
    const contactBtn = modalContent.querySelector('#btnContactProject');
    if(contactBtn){
      contactBtn.addEventListener('click', ()=> {
        window.location.href = XXXINLINECODEXXX4XXXINLINECODEXXX;
      });
    }
    // show
    modalBackdrop.classList.remove('hidden');
    // focus for accessibility
    modalContent.querySelector('h3')?.focus();
  }

  function closeModal(){
    modalBackdrop.classList.add('hidden');
    modalContent.innerHTML = '';
  }

  // global click handlers for modal close (delegation)
  document.addEventListener('click', (e) => {
    // close when clicking backdrop (outside modal-card)
    if(e.target === modalBackdrop) {
      closeModal();
      return;
    }
    // close when clicking element with class modal-close
    if(e.target.closest && e.target.closest('.modal-close')){
      closeModal();
      return;
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) closeModal();
  });

  // render more projects
  function renderMore(){
    const items = filteredAndSorted();
    const slice = items.slice(shown, shown + PAGE);
    slice.forEach(p => grid.appendChild(renderThumb(p)));
    shown += slice.length;
    lazyLoadImages();
    loadMoreBtn.style.display = (shown < items.length) ? '' : 'none';
  }

  loadMoreBtn.addEventListener('click', ()=> renderMore());
  viewPortfolio?.addEventListener('click', ()=> { window.scrollTo({top: document.getElementById('portfolio').offsetTop - 20, behavior:'smooth'}); });
  ctaHire?.addEventListener('click', ()=> window.location.href = 'mailto:your@email.example?subject=Hire%20Alisherov');
  contactMe?.addEventListener('click', ()=> window.location.href = 'mailto:your@email.example?subject=Project%20Inquiry');

  // filtering & sorting
  function filteredAndSorted(){
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = (categorySelect?.value || 'all');
    let items = projects.slice();
    if(cat !== 'all') items = items.filter(p => p.category === cat);
    if(q) items = items.filter(p => p.title.toLowerCase().includes(q));
    const sort = (sortSelect?.value || 'new');
    if(sort === 'new') items.sort((a,b)=> b.createdAt - a.createdAt);
    else if(sort === 'old') items.sort((a,b)=> a.createdAt - b.createdAt);
    else if(sort === 'alpha') items.sort((a,b)=> a.title.localeCompare(b.title));
    return items;
  }
  [searchInput, categorySelect, sortSelect].forEach(el => {
    if(!el) return;
    el.addEventListener('input', ()=> {
      shown = 0; grid.innerHTML = ''; renderMore();
    });
  });

  // lazy load images for performance
  function lazyLoadImages(){
    const imgs = Array.from(document.querySelectorAll('img.thumb-img'));
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          const src = img.dataset.src;
          if(src && !img.src) img.src = src;
          obs.unobserve(img);
        }
      });
    }, {rootMargin:'200px'});
    imgs.forEach(img => { if(img.dataset.src) io.observe(img); });
  }

  // hero showcase: use several picked projects
  function initHero(){
    const picks = [1,3,5,7].map(i => projects[(i-1) % projects.length]);
    picks.forEach(p => {
      const initials = p.title.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase();
      const node = document.createElement('div');
      node.className = 'logo-thumb';
      node.style.background = p.color;
      node.textContent = initials;
      heroShowcase.appendChild(node);
    });
  }

  // initial render
  function init(){
    initHero();
    renderMore();
    // animate skill bars (already inline styles in HTML)
    document.querySelectorAll('.bar > div').forEach(el => {
      const w = el.style.width || '80%';
      setTimeout(()=> el.style.width = w, 150);
    });
  }
  init();
});












// Получаем элементы (в начале DOMContentLoaded)
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Показать модалку с HTML-контентом
function showModal(html) {
  modalContent.innerHTML = html || '<div style="padding:12px">Нет содержимого</div>';
  modalBackdrop.classList.remove('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  // фокусируем контент для клавиатурной доступности
  setTimeout(() => modalContent.focus && modalContent.focus(), 50);
}

// Скрыть модалку
function hideModal() {
  modalBackdrop.classList.add('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  // чистим контент (опционально)
  modalContent.innerHTML = '';
}

// Крестик
modalClose.addEventListener('click', hideModal);

// Закрыть по клику вне карточки
modalBackdrop.addEventListener('click', (e) => {
  // если кликнули на сам backdrop (а не внутри modal-card)
  if (e.target === modalBackdrop) hideModal();
});

// Закрыть по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
    hideModal();
  }
});