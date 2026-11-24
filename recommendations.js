/*
  Community recommendations board.
  The database lives on Supabase; GitHub Pages only hosts the website files.
  Public visitors can read and submit recommendations after setup.
*/
(() => {
  'use strict';
  const cfg = window.RECOMMENDATIONS_CONFIG || {};
  const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url || '') && !!cfg.anonKey;
  const list = document.getElementById('recList');
  const form = document.getElementById('recommendationForm');
  const status = document.getElementById('recFormStatus');
  const more = document.getElementById('recMore');
  const submit = document.getElementById('recSubmit');
  const filters = document.getElementById('recFilters');
  if (!list || !form) return;
  const allowed = ['Anime','Manga','Manhua','Manhwa','Movie','TV Series','Game','Book','Other'];
  let category = 'All';
  let offset = 0;
  let loading = false;
  const pageSize = 10;
  const base = (cfg.url || '').replace(/\/$/, '') + '/rest/v1/recommendations';
  const headers = { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey };

  function message(text) {
    list.replaceChildren();
    const p = document.createElement('p');
    p.className = 'rec-placeholder';
    p.textContent = text;
    list.append(p);
  }

  // Search and sort are applied by Supabase so pagination stays correct.
  const searchInput = document.getElementById('recSearch');
  const sortInput = document.getElementById('recSort');
  let search = '';
  let sort = 'newest';
  let requestNumber = 0;
  const likeEndpoint = (cfg.url || '').replace(/\/$/, '') + '/rest/v1/rpc/like_recommendation';
  const tokenKey = 'portfolio_recommendation_voter';
  const likedKey = 'portfolio_liked_recommendations';
  let voterToken = null;
  let likedIds = new Set();
  try {
    const legacyPrefix = ['midnight', 'quest'].join('_');
    voterToken = localStorage.getItem(tokenKey) || localStorage.getItem(legacyPrefix + '_recommendation_voter');
    if (voterToken) localStorage.setItem(tokenKey, voterToken);
    if (!voterToken || !/^[0-9a-f-]{36}$/i.test(voterToken)) {
      voterToken = crypto.randomUUID();
      localStorage.setItem(tokenKey, voterToken);
    }
    likedIds = new Set(JSON.parse(localStorage.getItem(likedKey) || localStorage.getItem(legacyPrefix + '_liked_recommendations') || '[]').map(String));
  } catch (error) {
    // Some browsers disable local storage. The board still works without likes.
    voterToken = null;
  }

  // Create every element as text, never as untrusted HTML.
  function showItem(item) {
    const article = document.createElement('article');
    article.className = 'rec-item';
    const head = document.createElement('div');
    head.className = 'rec-item-head';
    const type = document.createElement('span');
    type.className = 'rec-category';
    type.textContent = item.category.toUpperCase();
    const author = document.createElement('span');
    author.className = 'rec-meta';
    author.textContent = 'BY ' + (item.author || 'ANONYMOUS ADVENTURER');
    head.append(type, author);
    const title = document.createElement('h4');
    title.textContent = item.title;
    const why = document.createElement('p');
    why.textContent = item.description;
    const bottom = document.createElement('div');
    bottom.className = 'rec-item-bottom';
    const date = document.createElement('span');
    date.className = 'rec-meta';
    date.textContent = new Date(item.created_at).toLocaleDateString(undefined, {year:'numeric',month:'short',day:'numeric'});
    const like = document.createElement('button');
    like.type = 'button';
    like.className = 'rec-like';
    const liked = likedIds.has(String(item.id));
    like.setAttribute('aria-pressed', String(liked));
    like.textContent = (liked ? '♥ LIKED ' : '♡ LIKE ') + Number(item.likes_count || 0);
    like.disabled = liked || !voterToken;
    like.title = !voterToken ? 'Likes require browser storage' : liked ? 'Already liked in this browser' : 'Like this recommendation';
    like.addEventListener('click', async () => {
      if (likedIds.has(String(item.id)) || !voterToken) return;
      like.disabled = true;
      try {
        const response = await fetch(likeEndpoint, {
          method: 'POST',
          headers: {...headers, 'Content-Type': 'application/json'},
          body: JSON.stringify({p_recommendation_id: item.id, p_voter_token: voterToken})
        });
        if (!response.ok) throw new Error('Like failed (' + response.status + '). Run the likes SQL upgrade.');
        const count = await response.json();
        likedIds.add(String(item.id));
        try { localStorage.setItem(likedKey, JSON.stringify([...likedIds])); } catch (_) {}
        like.setAttribute('aria-pressed', 'true');
        like.textContent = '♥ LIKED ' + count;
        if (sort === 'likes') load(true);
      } catch (error) {
        status.textContent = error.message;
        like.disabled = false;
      }
    });
    bottom.append(date, like);
    article.append(head, title, why, bottom);
    list.append(article);
  }

  // Escape characters that have special meaning in PostgREST's filter syntax.
  function searchFilter(value) {
    const safe = value.replace(/[\\%_*(),."']/g, ' ').trim().replace(/\s+/g, ' ');
    return safe ? 'or(' + ['title','author','description'].map(field => field + '.ilike.*' + safe + '*').join(',') + ')' : '';
  }

  async function load(reset = false) {
    if (!ready) { message('COMMUNITY BOARD IS NOT CONNECTED YET. SEE SETUP-RECOMMENDATIONS.md TO ENABLE THE SHARED DATABASE.'); return; }
    if (reset) { offset = 0; list.scrollTop = 0; message('LOADING COMMUNITY PICKS...'); more.hidden = true; }
    // Ignore stale requests when a visitor changes search/filter/sort quickly.
    const currentRequest = ++requestNumber;
    loading = true;
    more.disabled = true;
    try {
      const order = sort === 'name' ? 'title.asc' : sort === 'likes' ? 'likes_count.desc,created_at.desc' : 'created_at.desc';
      const params = new URLSearchParams({select:'id,category,title,description,author,created_at,likes_count',order,limit:String(pageSize),offset:String(offset)});
      if (category !== 'All') params.set('category', 'eq.' + category);
      if (search) { const filter = searchFilter(search); if (filter) params.set('or', filter.slice(3,-1)); }
      const response = await fetch(base + '?' + params, {headers});
      if (!response.ok) throw new Error('Database request failed (' + response.status + '). Run the likes SQL upgrade if needed.');
      const rows = await response.json();
      if (currentRequest !== requestNumber) return;
      if (offset === 0) list.replaceChildren();
      rows.forEach(showItem);
      offset += rows.length;
      if (!list.children.length) message('NO MATCHES YET. TRY ANOTHER SEARCH OR SHARE A PICK!');
      more.hidden = rows.length < pageSize;
      status.textContent = '';
    } catch (error) {
      if (currentRequest !== requestNumber) return;
      if (reset) message('COULD NOT LOAD RECOMMENDATIONS. CHECK YOUR DATABASE SETTINGS OR CONNECTION.');
      status.textContent = error.message;
    } finally {
      if (currentRequest === requestNumber) { loading = false; more.disabled = false; }
    }
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    category = button.dataset.category;
    [...filters.querySelectorAll('[data-category]')].forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    load(true);
  });
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { search = searchInput.value.trim().slice(0, 100); load(true); }, 300);
  });
  sortInput.addEventListener('change', () => { sort = sortInput.value; load(true); });
  document.getElementById('recRefresh').addEventListener('click', () => load(true));
  more.addEventListener('click', () => { if (!loading) load(); });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!ready) { status.textContent = 'Please connect Supabase first. See SETUP-RECOMMENDATIONS.md.'; return; }
    const values = new FormData(form);
    const item = {
      category: String(values.get('category') || ''),
      title: String(values.get('title') || '').trim(),
      description: String(values.get('description') || '').trim(),
      author: String(values.get('author') || '').trim() || 'Anonymous Adventurer'
    };
    if (!allowed.includes(item.category) || !item.title || !item.description || item.title.length > 120 || item.description.length > 500 || item.author.length > 40) {
      status.textContent = 'Please check your fields and try again.';
      return;
    }
    submit.disabled = true;
    status.textContent = 'SAVING YOUR RECOMMENDATION...';
    try {
      const response = await fetch(base, {
        method: 'POST',
        headers: {...headers, 'Content-Type':'application/json', Prefer:'return=minimal'},
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('Could not save (' + response.status + '). Please try again.');
      form.reset();
      category = 'All';
      filters.querySelector('[data-category="All"]').click();
      status.textContent = 'THANK YOU! YOUR RECOMMENDATION IS NOW ON THE BOARD.';
    } catch (error) { status.textContent = error.message; }
    finally { submit.disabled = false; }
  });
  // Show shortcut arrows only when visitors are browsing this section.
  const arcade = document.getElementById('recommendations');
  const skipNav = document.getElementById('recSkipNav');
  const skipUp = document.getElementById('recSkipUp');
  const skipDown = document.getElementById('recSkipDown');
  if (arcade && skipNav && skipUp && skipDown) {
    const updateShortcuts = () => {
      const bounds = arcade.getBoundingClientRect();
      const withinArcade = bounds.top < window.innerHeight * 0.8 && bounds.bottom > window.innerHeight * 0.2;
      skipNav.hidden = !withinArcade;
    };
    window.addEventListener('scroll', updateShortcuts, { passive: true });
    window.addEventListener('resize', updateShortcuts);
    skipUp.addEventListener('click', () => arcade.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    skipDown.addEventListener('click', () => {
      const nextSection = document.getElementById('experience');
      if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    updateShortcuts();
  }
  load(true);
})();
