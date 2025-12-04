// app.js

const themeToggle = document.getElementById('theme-toggle');

// Cargar preferencia guardada
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeToggle.textContent = '☀️ Claro';
}

// Alternar tema
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '☀️ Claro' : '🌙 Oscuro';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
const API = 'https://pokeapi.co/api/v2';
const grid = document.getElementById('grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const limitSelect = document.getElementById('limit-select');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');

const details = document.getElementById('details');
const closeDetails = document.getElementById('close-details');
const detailsContent = document.getElementById('details-content');

let offset = 0;
let limit = Number(limitSelect.value);
let currentPage = 1;
const cache = new Map(); // id|name -> data

// Utils
const getIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
};
const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

function setPagerState(totalCount) {
  const totalPages = Math.ceil(totalCount / limit);
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
}

// Fetch list and details
async function fetchList(offset, limit) {
  const res = await fetch(`${API}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error('Error cargando la lista');
  return res.json();
}

async function fetchPokemon(identifier) {
  const key = String(identifier).toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(`${API}/pokemon/${key}`);
  if (!res.ok) throw new Error('Pokémon no encontrado');
  const data = await res.json();
  cache.set(key, data);
  cache.set(String(data.id), data);
  cache.set(data.name.toLowerCase(), data);
  return data;
}

// Render cards
function renderCards(results) {
  grid.innerHTML = '';
  for (const item of results) {
    const id = item.id ?? getIdFromUrl(item.url);
    const name = item.name;
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', id);
    card.innerHTML = `
      <div class="thumb">
        <img loading="lazy" src="${artworkUrl(id)}" alt="${name}" />
      </div>
      <div class="meta">
        <span class="name">${name}</span>
        <span class="id">#${String(id).padStart(3, '0')}</span>
      </div>
    `;
    card.addEventListener('click', () => openDetails(id));
    grid.appendChild(card);
  }
}

// Details panel
async function openDetails(identifier) {
  try {
    const data = await fetchPokemon(identifier);
    const types = data.types.map((t) => t.type.name);
    const abilities = data.abilities.map((a) => a.ability.name);
    const stats = data.stats.map((s) => ({ name: s.stat.name, base: s.base_stat }));
    detailsContent.innerHTML = `
      <div class="details-card">
        <img src="${artworkUrl(data.id)}" alt="${data.name}" />
        <div>
          <h2 style="margin:0 0 0.25rem 0;text-transform:capitalize;">
            ${data.name} <span style="color:#9ca3af;">#${String(data.id).padStart(3,'0')}</span>
          </h2>
          <div class="badges">
            ${types.map((t) => `<span class="badge">${t}</span>`).join('')}
          </div>
          <div class="stats">
            ${stats
              .map(
                (s) => `
              <div class="stat">
                <div class="label">${s.name}</div>
                <div class="value">${s.base}</div>
              </div>`
              )
              .join('')}
          </div>
          <div style="margin-top:0.8rem;">
            <div class="label" style="color:#9ca3af;font-size:0.9rem;">Habilidades</div>
            <div class="badges">${abilities.map((a) => `<span class="badge">${a}</span>`).join('')}</div>
          </div>
        </div>
      </div>
    `;
    details.classList.remove('hidden');
  } catch (err) {
    detailsContent.innerHTML = `<div class="details-card"><div>Ocurrió un error: ${err.message}</div></div>`;
    details.classList.remove('hidden');
  }
}

closeDetails.addEventListener('click', () => {
  details.classList.add('hidden');
});

// Load initial page
async function loadPage() {
  grid.innerHTML = '<div style="padding:1rem;color:#9ca3af;">Cargando…</div>';
  try {
    const { results, count } = await fetchList(offset, limit);
    setPagerState(count);
    renderCards(results);
  } catch (err) {
    grid.innerHTML = `<div style="padding:1rem;color:#ef4444;">Error: ${err.message}</div>`;
  }
}

// Pager events
prevBtn.addEventListener('click', () => {
  if (offset - limit >= 0) {
    offset -= limit;
    currentPage -= 1;
    loadPage();
  }
});
nextBtn.addEventListener('click', () => {
  offset += limit;
  currentPage += 1;
  loadPage();
});
limitSelect.addEventListener('change', () => {
  limit = Number(limitSelect.value);
  offset = 0;
  currentPage = 1;
  loadPage();
});

// Search
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;
  grid.innerHTML = '';
  try {
    const data = await fetchPokemon(q);
    renderCards([{ id: data.id, name: data.name }]);
    pageInfo.textContent = 'Resultado de búsqueda';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  } catch (err) {
    grid.innerHTML = `<div style="padding:1rem;color:#ef4444;">No encontrado: ${q}</div>`;
  }
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  offset = 0;
  currentPage = 1;
  loadPage();
});

// Start
loadPage();
