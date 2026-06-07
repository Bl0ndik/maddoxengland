
// =====================
// TOPBAR
// =====================
// Tady si beru prvky z horní lišty, abych s nimi mohl pracovat v JavaScriptu.
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const topbarTime = document.getElementById('topbarTime');
const topbarDate = document.getElementById('topbarDate');

const appleBtn = document.getElementById('appleBtn');
const shutdownScreen = document.getElementById('shutdownScreen');

// Funkce nastavuje aktuální datum a čas v horní liště.
function updateTopbarClock() {
  const now = new Date();

  const days = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  const months = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];

  const dayName = days[now.getDay()];
  const dayNum = now.getDate();
  const monthName = months[now.getMonth()];

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  topbarDate.textContent = `${dayNum} ${dayName} ${monthName}`;
  topbarTime.textContent = `${hours}:${minutes}`;
}

updateTopbarClock();
setInterval(updateTopbarClock, 10000);


// =====================
// DARK MODE
// =====================
// Po kliknutí se přepne světlý a tmavý motiv celé stránky.
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  themeIcon.textContent = isDark ? '☀' : '☾';
});


// =====================
// SHUTDOWN SCREEN
// =====================
// Apple tlačítko zobrazí jednoduchou vypínací obrazovku.
appleBtn.addEventListener('click', () => {
  shutdownScreen.classList.remove('hidden');
});

shutdownScreen.addEventListener('click', () => {
  shutdownScreen.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    shutdownScreen.classList.add('hidden');
  }
});


// =====================
// UNIVERZÁLNÍ FUNKCE PRO OKNA
// =====================
// Tuhle funkci používám pro všechna okna, aby se nemusel opakovat stejný kód.
// Řeší otevření, zavření, minimalizaci, fullscreen a přesouvání okna.
function setupWindow(options) {
  const openBtn = document.getElementById(options.openBtnId);
  const closeBtn = document.getElementById(options.closeBtnId);
  const minBtn = document.getElementById(options.minBtnId);
  const maxBtn = document.getElementById(options.maxBtnId);
  const windowEl = document.getElementById(options.windowId);

  // Když nějaký prvek v HTML chybí, funkce se radši ukončí a web nespadne.
  if (!openBtn || !closeBtn || !minBtn || !maxBtn || !windowEl) {
    return;
  }

  const headerEl = windowEl.querySelector(options.headerSelector || '.mail-header');

  if (!headerEl) {
    return;
  }

  let dragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function openWindow() {
    resetWindowPosition();
    windowEl.classList.remove('hidden');

    // Na mobilu nebo tabletu se okno otevře rovnou přes celou obrazovku.
    if (window.innerWidth <= 900) {
      windowEl.classList.add('fullscreen');
    }

    if (typeof options.onOpen === 'function') {
      options.onOpen();
    }
  }

  function closeWindow() {
    windowEl.classList.add('hidden');
    windowEl.classList.remove('fullscreen');
    resetWindowPosition();
    if (typeof options.onClose === 'function') {
      options.onClose();
    }
  }

  function minimizeWindow() {
    windowEl.classList.add('hidden');
  }

  function toggleFullscreen() {
    if (window.innerWidth <= 900) return;
    windowEl.classList.toggle('fullscreen');
  }

  function resetWindowPosition() {
    windowEl.style.left = '';
    windowEl.style.top = '';
    windowEl.style.transform = '';
  }

  function startDragging(e) {
    if (e.target.classList.contains('dot')) return;
    if (windowEl.classList.contains('fullscreen')) return;
    if (window.innerWidth <= 900) return;

    dragging = true;
    windowEl.classList.add('dragging');

    const rect = windowEl.getBoundingClientRect();

    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    windowEl.style.transform = 'none';
    windowEl.style.left = `${rect.left}px`;
    windowEl.style.top = `${rect.top}px`;
  }

  function dragWindow(e) {
    if (!dragging) return;

    const windowWidth = windowEl.offsetWidth;
    const windowHeight = windowEl.offsetHeight;

    const maxX = window.innerWidth - windowWidth;
    const maxY = window.innerHeight - windowHeight;

    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(28, Math.min(newY, maxY));

    windowEl.style.left = `${newX}px`;
    windowEl.style.top = `${newY}px`;
  }

  function stopDragging() {
    dragging = false;
    windowEl.classList.remove('dragging');
  }

  openBtn.addEventListener('click', openWindow);
  closeBtn.addEventListener('click', closeWindow);
  minBtn.addEventListener('click', minimizeWindow);
  maxBtn.addEventListener('click', toggleFullscreen);

  headerEl.addEventListener('mousedown', startDragging);

  document.addEventListener('mousemove', dragWindow);
  document.addEventListener('mouseup', stopDragging);

  headerEl.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('dot')) return;
    toggleFullscreen();
  }); 
  
}


// =====================
// NASTAVENÍ JEDNOTLIVÝCH OKEN
// =====================
// Tady propojuju konkrétní aplikace s univerzální funkcí setupWindow.
setupWindow({
  openBtnId: 'openMail',
  closeBtnId: 'closeMail',
  minBtnId: 'minMail',
  maxBtnId: 'maxMail',
  windowId: 'mailWindow'
});


setupWindow({
  openBtnId: 'openInsta',
  closeBtnId: 'closeInsta',
  minBtnId: 'minInsta',
  maxBtnId: 'maxInsta',
  windowId: 'InstagramWindow',
  onOpen: () => {
    showInstagramPage('home');
  }
});


setupWindow({
  openBtnId: 'openSpotify',
  closeBtnId: 'closeSpotify',
  minBtnId: 'minSpotify',
  maxBtnId: 'maxSpotify',
  windowId: 'SpotifyWindow'
});


setupWindow({
  openBtnId: 'openSteam',
  closeBtnId: 'closeSteam',
  minBtnId: 'minSteam',
  maxBtnId: 'maxSteam',
  windowId: 'SteamWindow'
});


setupWindow({
  openBtnId: 'openFiles',
  closeBtnId: 'closeFiles',
  minBtnId: 'minFiles',
  maxBtnId: 'maxFiles',
  windowId: 'FilesWindow',
  onClose: () => {
    showFolders();
  }
});


setupWindow({
  openBtnId: 'openKos',
  closeBtnId: 'closeKos',
  minBtnId: 'minKos',
  maxBtnId: 'maxKos',
  windowId: 'KosWindow'
});

// =====================
// SPOTIFY - YOUTUBE
// =====================
// Tato funkce otevře aktuální písničku na YouTube podle uloženého ID.
function openCurrentTrack() {
  const t = tracks[currentTrack];

  window.open(
    `https://www.youtube.com/watch?v=${t.yt}`,
    '_blank',
    'noopener,noreferrer'
  );
}


// =====================
// INSTAGRAM
// =====================
// Funkce přepíná mezi hlavní stránkou Instagramu a profilem.
function showInstagramPage(name) {
  const selectedPage = document.getElementById('page-' + name);
  if (!selectedPage) return;

  document.querySelectorAll('#InstagramWindow .page').forEach(page => {
    page.classList.remove('active');
  });

  selectedPage.classList.add('active');

  document.getElementById('nav-home-ig').classList.toggle('active', name === 'home');
  document.getElementById('nav-profile-ig').classList.toggle('active', name === 'profile');
}

showInstagramPage('home');


// =====================
// SPOTIFY
// =====================
// Pole tracks obsahuje všechny písničky, které se zobrazují ve Spotify okně.
const tracks = [
  { title:'Creep',                     artist:'Radiohead',          dur:'3:58', secs:238, cover:'img/RadioheadC1.jpg',          yt:'XFkzRNyygfk' },
  { title:'Let Down',                  artist:'Radiohead',          dur:'4:58', secs:275, cover:'img/RadioheadC2.jpg',          yt:'duBCwvC1kP4' },
  { title:'No Surprises',              artist:'Radiohead',          dur:'3:48', secs:209, cover:'img/RadioheadC2.jpg',          yt:'SGTrXomvxh8' },
  { title:'Come As You Are',           artist:'Nirvana',            dur:'3:38', secs:218, cover:'img/NirvanaC1.jpeg',           yt:'XrXEfnbcWV8' },
  { title:'Smells Like Teen Spirit',   artist:'Nirvana',            dur:'3:38', secs:218, cover:'img/NirvanaC1.jpeg',           yt:'UmWZymztDp8' },
  { title:'Lithium',                   artist:'Nirvana',            dur:'3:38', secs:218, cover:'img/NirvanaC1.jpeg',           yt:'PbgKEjNBHqM' },
  { title:'Heart-Shaped Box',          artist:'Nirvana',            dur:'3:38', secs:218, cover:'img/NirvanaC2.png',            yt:'n6P0SitRqn8' },
  { title:'Do I Wanna Know?',          artist:'Arctic Monkeys',     dur:'4:32', secs:272, cover:'img/ArcticMonkeysC1.jpg',      yt:'bpOSxM0rNPM' },
  { title:'Walking on a Dream',        artist:'Empire of the Sun',  dur:'3:44', secs:224, cover:'img/Empire of the sunC1.png',  yt:'eioCcU3wD80' },
  { title:'Slow Dancing in the Dark',  artist:'Joji',               dur:'3:29', secs:209, cover:'img/JojiC1.jpeg',              yt:'K3Qzzggn--s' },
  { title:'Treasure',                  artist:'Bruno Mars',         dur:'2:59', secs:179, cover:'img/Bruno MarsC1.png',         yt:'nPvuNsRccVw' },
  { title:'Earrings',                  artist:'Malcom Todd',        dur:'2:30', secs:150, cover:'img/MalcomToddC1.png',         yt:'zH0jD6-jX7A'},
  { title:'Roommates',                 artist:'Malcom Todd',        dur:'3:33', secs:200, cover:'img/MalcomToddC1.png',         yt:'tG5L6R6Z5Zk'},
  { title:'Sweet Boy',                 artist:'Malcom Todd',        dur:'3:00', secs:180, cover:'img/MalcomToddC1.png',         yt:'uCclwVfU7Yw'},
];
 
// Tady si ukládám aktuální stav přehrávače.
let currentTrack = 0;
let isPlaying = false;
let elapsed = 0;
let timer = null;
let filteredTracks = [...tracks];

// HTML prvky, které se mění podle vybrané skladby.
const trackList = document.getElementById('trackList');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const coverImg = document.getElementById('coverImg');
const progTotal = document.getElementById('progTotal');
const progFill = document.getElementById('progFill');
const progCurrent = document.getElementById('progCurrent');

// Převádí sekundy na formát času, třeba 75 sekund na 1:15.
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = String(seconds % 60).padStart(2, '0');

  return `${minutes}:${restSeconds}`;
}
 
// Vykreslí seznam skladeb podle toho, jestli jsou všechny nebo jen od jednoho interpreta.
function renderTracks(list) {
  trackList.innerHTML = '';

  list.forEach((t, i) => {
    const trackIndex = tracks.indexOf(t);
    const row = document.createElement('div');

    row.className = 'track-row' + (currentTrack === trackIndex ? ' playing' : '');
    row.innerHTML = `
      <div class="track-num">${i + 1}</div>
      <div class="track-info">
        <div class="track-cover">
          <img src="${t.cover}">
        </div>

        <div>
          <div class="track-title">${t.title}</div>
          <div class="track-artist-name">${t.artist}</div>
        </div>
      </div>
      <div class="track-art">${t.artist}</div>
      <div class="track-dur">${t.dur}</div>
    `;
    row.addEventListener('click', () => playTrack(trackIndex));
    trackList.appendChild(row);
  });
}
 
// Aktualizuje spodní přehrávač podle aktuálně zvolené skladby.
function updatePlayerUI() {
  const t = tracks[currentTrack];

  nowTitle.textContent = t.title;
  nowArtist.textContent = t.artist;
  coverImg.src = t.cover;
  progTotal.textContent = t.dur;
  progFill.style.width = '0%';
  progCurrent.textContent = '0:00';

  renderTracks(filteredTracks);
}

// Spustí skladbu podle jejího pořadí v poli tracks.
function playTrack(index) {
  currentTrack = index;
  elapsed = 0;
  updatePlayerUI();
  startPlay();
}
 
// Simuluje přehrávání pomocí časovače a posouvá progress bar.
function startPlay() {
  isPlaying = true;
  clearInterval(timer);
  timer = setInterval(() => {
    elapsed++;
    const t = tracks[currentTrack];
    const pct = Math.min((elapsed / t.secs) * 100, 100);
    progFill.style.width = pct + '%';
    progCurrent.textContent = formatTime(elapsed);
    if (elapsed >= t.secs) nextTrack();
  }, 1000);
}
 
 
// Přepne na další skladbu, po poslední se vrátí zase na první.
function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  elapsed = 0;
  updatePlayerUI();

  if (isPlaying) startPlay();
}
 
// Přepne na předchozí skladbu, nebo vrátí aktuální skladbu na začátek.
function prevTrack() {
  // Když už skladba chvíli běží, první klik ji jen restartuje.
  if (elapsed > 3) {
    elapsed = 0;
    progFill.style.width = '0%';
    progCurrent.textContent = '0:00';
    return;
  }

  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  elapsed = 0;
  updatePlayerUI();

  if (isPlaying) startPlay();
}
 
// Umožní kliknutím posunout skladbu v progress baru.
function seekTrack(e) {
  const bar = document.getElementById('progBar');
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  elapsed = Math.floor(pct * tracks[currentTrack].secs);
  progFill.style.width = (pct * 100) + '%';
  progCurrent.textContent = formatTime(elapsed);
}
 
// Hlasitost je jen vizuální, protože stránka reálně nepřehrává zvuk.
function setVolume(e) {
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
  document.getElementById('volFill').style.width = pct + '%';
}
 
// Zobrazí pouze skladby od vybraného interpreta.
function filterArtist(name) {
  filteredTracks = tracks.filter(t => t.artist === name);
  document.getElementById('pageTitle').textContent = name;
  document.getElementById('pageSub').textContent = filteredTracks.length + (filteredTracks.length === 1 ? ' píseň' : ' písně');
  renderTracks(filteredTracks);
  document.querySelectorAll('.artist-item').forEach(el => {
    el.style.background = el.querySelector('.artist-name').textContent === name ? '#1a1a1a' : '';
  });
}
 
// Vrátí Spotify zpět na hlavní seznam všech oblíbených písniček.
function showSpotifyHome() {
  filteredTracks = [...tracks];
  document.getElementById('pageTitle').textContent = 'Oblíbené písničky';
  document.getElementById('pageSub').textContent = tracks.length + ' písní';
  renderTracks(filteredTracks);

  document.querySelectorAll('.artist-item').forEach(el => {
    el.style.background = '';
  });
}
 


renderTracks(filteredTracks);

// =====================
// STEAM
// =====================
// Objekt games obsahuje informace o hrách, které se mění po kliknutí na kartu.
const games = {
  er: {
    name: 'Elden Ring',
    hours: '550',
    ach: '30/42',
    tags: ['RPG', 'Open World', 'Soulslike']
  },

  cs2: {
    name: 'Counter-Strike 2',
    hours: '220',
    ach: '1/1',
    tags: ['FPS', 'Multiplayer', 'Akce']
  },

  cp: {
    name: 'Cyberpunk 2077',
    hours: '60',
    ach: '3/54',
    tags: ['RPG', 'Open World', 'Cyberpunk']
  },

  ter: {
    name: 'Terraria',
    hours: '20',
    ach: '37/137',
    tags: ['Sandbox', '2D', 'Adventure']
  },

  hk: {
    name: 'Hollow Knight',
    hours: '10',
    ach: '4/63',
    tags: ['Metroidvania', 'Indie', 'Action']
  },

  sky: {
    name: 'Skyrim',
    hours: '137',
    ach: '40/75',
    tags: ['RPG', 'Open World', 'Fantasy']
  }
};
 
// Po kliknutí na hru se aktualizuje její název, hodiny, achievementy a tagy.
function selectGame(key) {
  const g = games[key];

  if (!g) return;
  document.querySelectorAll('.game-card-st').forEach(c => c.classList.remove('active'));
  document.getElementById('gc-' + key).classList.add('active');
  document.getElementById('gi-name').textContent = g.name;
  document.getElementById('gi-hours').textContent = g.hours;
  document.getElementById('gi-ach').textContent = g.ach;
  document.getElementById('gi-tags').innerHTML = g.tags.map(t => `<span class="game-info-tag-st">${t}</span>`).join('');
}
 
// Přepíná ve Steamu mezi stránkou s hrami a profilem.
function showSteamPage(name) {
  document.querySelectorAll('.page-st').forEach(p => {
    p.classList.remove('active');
  });

  document.querySelectorAll('.tab-st').forEach(t => {
    t.classList.remove('active');
  });

  const page = document.getElementById('page-' + name);
  const tab = document.getElementById('tab-' + name);

  if (page) page.classList.add('active');
  if (tab) tab.classList.add('active');
}

 
// =====================
// FILES
// =====================
// Schová všechny části okna Files, aby se potom mohla zobrazit jen vybraná složka.
function resetFilesView() {
  document.querySelectorAll('#main-fl > div').forEach(el => {
    el.classList.add('hidden');
  });

  document.querySelectorAll('.sidebar-item-fl').forEach(item => {
    item.classList.remove('active');
  });
}

// Zobrazí úvodní přehled složek.
function showFolders() {
  resetFilesView();

  document.getElementById('view-home').classList.remove('hidden');
  document.getElementById('si-all').classList.add('active');
}
 
// Otevře konkrétní složku podle názvu uloženého v HTML.
function openFolder(folder) {
  resetFilesView();

  document.getElementById('view-' + folder).classList.remove('hidden');
  document.getElementById('si-' + folder).classList.add('active');
}
 
// Tlačítko zpět vrací uživatele na přehled složek.
function goBack() {
  showFolders();
}


// =====================
// EVENT LISTENERY
// =====================
// Tady přidávám klikací funkce přes JavaScript místo psaní onclick přímo do HTML.
function addClickListener(id, callback) {
  const element = document.getElementById(id);
  if (!element) return;
  element.addEventListener('click', callback);
}

addClickListener('nav-home-ig', () => showInstagramPage('home'));
addClickListener('nav-profile-ig', () => showInstagramPage('profile'));

addClickListener('spotifyHomeBtn', showSpotifyHome);
addClickListener('prevTrackBtn', prevTrack);
addClickListener('youtubeBtn', openCurrentTrack);
addClickListener('nextTrackBtn', nextTrack);
addClickListener('progBar', seekTrack);
addClickListener('volBar', setVolume);

// Spotify interpreti používají data-artist, podle kterého se filtrují písničky.
document.querySelectorAll('.artist-item[data-artist]').forEach(item => {
  item.addEventListener('click', () => {
    filterArtist(item.dataset.artist);
  });
});

// Steam záložky používají data-page, podle kterého se vybere správná stránka.
document.querySelectorAll('.tab-st[data-page]').forEach(tab => {
  tab.addEventListener('click', () => {
    showSteamPage(tab.dataset.page);
  });
});

// Steam karty používají data-game, podle kterého se načtou informace o hře.
document.querySelectorAll('.game-card-st[data-game]').forEach(card => {
  card.addEventListener('click', () => {
    selectGame(card.dataset.game);
  });
});

addClickListener('filesBackBtn', goBack);

document.querySelectorAll('[data-folder]').forEach(item => {
  item.addEventListener('click', () => {
    const folder = item.dataset.folder;

    if (folder === 'all') {
      showFolders();
      return;
    }

    openFolder(folder);
  });
});

// =====================
// MODAL PRO FOTKY
// =====================
// Proměnná drží aktuálně otevřený náhled fotky. Když je null, žádný náhled otevřený není.
let photoModalOverlay = null;

// Otevře obrázek ve větším náhledu přes stránku.
function openPhotoModal(src, label) {
  closePhotoModal();

  const overlay = document.createElement('div');
  overlay.className = 'photo-modal-overlay';
  overlay.tabIndex = 0;

  const img = document.createElement('img');
  img.className = 'photo-modal-img';
  img.alt = label || '';
  img.src = src;

  const caption = document.createElement('div');
  caption.className = 'photo-modal-caption';
  caption.textContent = label || '';

  overlay.appendChild(img);
  overlay.appendChild(caption);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === img) closePhotoModal();
  });

  img.addEventListener('error', () => {
    caption.textContent = 'Obrázek se nepodařilo načíst.';
    img.style.display = 'none';
  });

  document.body.appendChild(overlay);
  photoModalOverlay = overlay;

  // Focus pomáhá tomu, aby se modal dal zavřít klávesou Escape.
  overlay.focus();
}

// Zavře otevřený náhled fotky.
function closePhotoModal() {
  if (photoModalOverlay) {
    photoModalOverlay.remove();
    photoModalOverlay = null;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePhotoModal();
});

// Jeden společný listener řeší fotky ve Files, Instagramu i Koši.
document.addEventListener('click', (e) => {
  // Kliknutí na tlačítka a navigaci nechci brát jako kliknutí na fotku.
  if (e.target.closest('button, a, .dock, .insta-dock, .traffic-lights, .topbar, .spotify-dock')) {
    return;
  }

  // Fotky ve Files.
  const card = e.target.closest('.photo-card-fl');
  if (card) {
    const imgEl = card.querySelector('img');
    const nameEl = card.querySelector('.photo-desc-fl');

    if (!imgEl) return;

    const src = imgEl.getAttribute('src');
    const label = nameEl ? nameEl.textContent.trim() : imgEl.alt || '';

    openPhotoModal(src, label);
    return;
  }

  // Fotky na Instagram profilu.
  const instagramGridImg = e.target.closest('#page-profile .grid-item');
  if (instagramGridImg) {
    const src = instagramGridImg.getAttribute('src');
    const label = instagramGridImg.getAttribute('title')
      || instagramGridImg.getAttribute('alt')
      || 'Instagram příspěvek';

    openPhotoModal(src, label);
    return;
  }

  // Obrázek v Koši špatných nápadů.
  const kosCard = e.target.closest('.kos-klauzura-card');
  if (kosCard) {
    const imgEl = kosCard.querySelector('img');
    const nameEl = kosCard.querySelector('.kos-klauzura-name');

    if (!imgEl) return;

    const src = imgEl.getAttribute('src');
    const label = nameEl ? nameEl.textContent.trim() : imgEl.alt || 'Koš špatných nápadů';

    openPhotoModal(src, label);
  }
});