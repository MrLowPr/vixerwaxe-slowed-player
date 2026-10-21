/* ============================================================
   vixerwaxe — Slowed & Reverb Player
   Vanilla JS. Web Audio API: media element -> bass EQ -> [dry | convolver reverb] -> master -> analyser
   ============================================================ */
(() => {
  'use strict';

  /* --------------------------------------------------------- config */

  const GH_REPO = 'https://github.com/MrLowPr/vixerwaxe-slowed-player';
  const CHANNEL = 'https://www.youtube.com/@vixerwaxe';

  // local: mp3 shipped in /audio — yt: opens YouTube
  const TRACKS = [
    { id: 'p-0ZWqiu-LI', title: '9mm', alt: 'Slowed',                 views: 1300000, local: 'audio/9mm-slowed.mp3',            orig: 'Memphis Cult, Groove Dealers, SPLYXER' },
    { id: 'Jk2gAZQXtxs', title: 'One Chance', alt: 'Slowed',              views: 4400000, local: 'audio/one-chance-slowed.mp3',      orig: 'MoonDeity, INTERWORLD' },
    { id: 'tMFVAOcW6iQ', title: 'DEMONS IN MY SOUL', alt: 'Slowed',       views: 31000,   local: 'audio/demons-in-my-soul-slowed.mp3', orig: 'scxrsoul, sx1nxwy' },
    { id: 'zVd2Wz_By9g', title: 'Close Eyes', alt: 'Slowed + Reverbed',  views: 1600000 },
    { id: 'vjel5oEqzS8', title: "Killin' On Demand", alt: 'Slowed + Reverbed', views: 77000 },
    { id: 'PvtQYl7YX3A', title: 'Rapture', alt: 'Slowed + Reverbed',    views: 53000 },
    { id: 'LUT9xGDyCKM', title: 'Limbo', alt: 'Slowed + Reverbed',      views: 32000 },
    { id: '2msPhdT7-fk', title: 'MISA MISA!', alt: 'Slowed + Reverbed',  views: 21000 },
    { id: 'dkQFQ-iyBAU', title: 'Live Another Day', alt: 'Slowed + Reverbed', views: 20000 },
    { id: 'sCo2Wsn2nLQ', title: 'Devil Eyes', alt: 'Slowed',             views: 16000 },
    { id: 'pSgtuQdjK4A', title: 'METAMORPHOSIS - INTERWORLD', alt: 'Slowed + Reverbed', views: 16000 },
    { id: 'Iqk5TwOoaTk', title: 'The Perfect Phonk', alt: 'Slowed + Reverbed', views: 14000 },
    { id: '7NobM4vSDXg', title: 'Robot Rock Funk', alt: 'Slowed',         views: 12000 },
    { id: 'o6c8AaNNE1I', title: 'Untitled#13', alt: 'Slowed',            views: 11000 },
    { id: 'DW7UE0IWjCU', title: 'Vuk Vuk', alt: 'Slowed + Reverbed',    views: 11000 },
    { id: '6-L4D3ORtgc', title: 'COBRA TATE PHONK', alt: 'Slowed + Reverbed', views: 11000 },
    { id: 'hkT9z1hgV-I', title: 'MAZKO', alt: 'Slowed',                  views: 8200 },
    { id: 'RI15H4yjeMk', title: 'Tuca Donka', alt: 'Slowed',            views: 7200 },
    { id: '3FRdwE0FcSw', title: 'Beat Alucinante', alt: 'Slowed',        views: 7000 },
    { id: 'SJeIVRoVz9Y', title: 'Scary Garry', alt: 'Slowed',            views: 6000 },
    { id: '7jCUljY-Nno', title: 'KRUSHSEXX', alt: 'Slowed',              views: 5600 },
    { id: 'EyHSZc27FNQ', title: 'Dream Space', alt: 'Slowed',            views: 5400 },
    { id: 'a1TdVhFvchk', title: 'Meet Her At The Love Parade', alt: 'Slowed (Beuk Mix)', views: 5100 },
    { id: 'bKxvU3FdbA0', title: 'S.X.N.D. N.X.D.E.S.', alt: 'Little Bit Slowed', views: 4600 },
    { id: 'fJhCxlw0fQE', title: 'Dança Do Sonic', alt: 'Slowed',          views: 4200 },
    { id: 'mA7Hj-O2WMo', title: 'MurderCaust - Lord Lorenz', alt: 'Slowed + Reverbed', views: 3400 },
    { id: 'pkMsVZjz8yo', title: 'Brazilian Phonk Mano', alt: 'Slowed + Reverbed', views: 2900 },
    { id: 'ptBTvc9AtXY', title: 'BANKAI - DXNT L13', alt: 'Slowed + Reverbed', views: 2700 },
    { id: 'FXufpGY4Tv8', title: 'PROTECTION CHARM', alt: 'Slowed',        views: 2100 },
    { id: '2msqihTV07c', title: 'CHEGOU 3', alt: 'Slowed',                views: 2000 },
    { id: 'FlIl_-Q-9Ps', title: 'MONTAGEM - GLITCH', alt: 'Slowed',        views: 1600 },
    { id: 'H5o3Cmo9qlo', title: 'SimpsonWave1995', alt: 'Slowed',          views: 993 },
    { id: 'bbMbAaAFc40', title: 'New Jeans Jersey Remix', alt: 'Slowed',   views: 846 },
    { id: 'wyAl-8Jdx28', title: 'Vai Me Bota', alt: 'Slowed',             views: 797 },
    { id: '9idUvEtyP48', title: 'Montagem Lunar Diamante', alt: 'Slowed', views: 654 },
  ];

  const FEATURED = TRACKS[0];

  /* --------------------------------------------------------- dom */

  const $ = (s) => document.querySelector(s);
  const audio = $('#audio');
  const el = {
    play: $('#btn-play'), heroPlay: $('#hero-play'), prev: $('#btn-prev'), next: $('#btn-next'),
    loop: $('#btn-loop'), seek: $('#seek'), vol: $('#vol'),
    speed: $('#speed'), speedOut: $('#speed-out'),
    reverb: $('#reverb'), reverbOut: $('#reverb-out'),
    bass: $('#bass'), bassOut: $('#bass-out'),
    gradual: $('#gradual'), keepPitch: $('#keepPitch'),
    tCur: $('#t-cur'), tDur: $('#t-dur'),
    npTitle: $('#np-title'), npArtist: $('#np-artist'),
    viz: $('#viz'), heroViz: $('#hero-viz'), badge: $('#viz-badge'),
    tracklist: $('#tracklist'),
    desc: $('#desc-text'), copied: $('#copied'),
  };

  /* --------------------------------------------------------- state */

  const state = {
    idx: 0,
    ctx: null,
    nodes: null,
    ready: false,
    speed: 0.80,
    reverb: 0.45,
    bass: 5,
    gradual: false,
    keepPitch: true,
    looping: false,
    rampFrom: null,
    rampTo: 0.80,
    rampStart: 0,
    rampDur: 30,
    muted: false,
  };

  /* --------------------------------------------------------- audio graph */

  function buildGraph() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    const ctx = new Ctx();

    const src = ctx.createMediaElementSource(audio);

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 110;
    bassFilter.gain.value = state.bass;

    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const conv = ctx.createConvolver();
    conv.buffer = makeImpulse(ctx, 2.6, 2.4);

    const master = ctx.createGain();
    master.gain.value = 0.9;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.78;

    src.connect(bassFilter);
    bassFilter.connect(dry);  dry.connect(master);
    bassFilter.connect(conv); conv.connect(wet); wet.connect(master);
    master.connect(analyser);
    analyser.connect(ctx.destination);

    state.ctx = ctx;
    state.nodes = { src, bassFilter, dry, wet, conv, master, analyser };
    state.ready = true;
    applyMix();
    return true;
  }

  function makeImpulse(ctx, seconds, decay) {
    const rate = ctx.sampleRate;
    const len = Math.max(1, Math.floor(rate * seconds));
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // slightly dark tail: roll off highs with a one-pole lowpass
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return buf;
  }

  function applyMix() {
    if (!state.ready) return;
    const { dry, wet, bassFilter, master } = state.nodes;
    const t = state.ctx.currentTime;
    const r = state.reverb;
    wet.gain.setTargetAtTime(r * 0.85, t, 0.05);
    dry.gain.setTargetAtTime(1 - r * 0.30, t, 0.05);
    bassFilter.gain.setTargetAtTime(state.bass, t, 0.05);
    master.gain.setTargetAtTime(state.muted ? 0 : 0.9, t, 0.03);
  }

  function setPitchMode() {
    const v = state.keepPitch;
    if ('preservesPitch' in audio) audio.preservesPitch = v;
    if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = v;
    if ('webkitPreservesPitch' in audio) audio.webkitPreservesPitch = v;
  }

  /* --------------------------------------------------------- playback */

  function loadTrack(i, autoplay) {
    const t = TRACKS[i];
    state.idx = i;
    el.npTitle.textContent = `${t.title} ${t.alt}`;
    el.npArtist.textContent = t.orig ? `@vixerwaxe — org by ${t.orig}` : '@vixerwaxe';

    if (!t.local) {
      window.open(`https://www.youtube.com/watch?v=${t.id}`, '_blank', 'noopener');
      toast('Opening on YouTube');
      return;
    }

    audio.src = t.local;
    audio.load();
    state.rampStart = 0;
    state.rampFrom = null;
    applyRate();
    highlightTrack();
    if (autoplay) play();
  }

  function play() {
    if (!state.ready && !buildGraph()) { toast('Web Audio not supported'); return; }
    if (state.ctx.state === 'suspended') state.ctx.resume();
    audio.play().then(() => {
      el.play.innerHTML = '⏸';
      el.play.setAttribute('aria-label', 'Pause');
      el.badge.textContent = 'PLAYING';
      if (state.gradual && state.rampFrom === null) {
        state.rampFrom = 1.0;
        state.rampStart = audio.currentTime;
        state.rampTo = state.speed;
      }
    }).catch(() => toast('Press play again to start'));
  }

  function pause() {
    audio.pause();
    el.play.innerHTML = '▶';
    el.play.setAttribute('aria-label', 'Play');
    el.badge.textContent = 'PAUSED';
  }

  function toggle() { audio.paused ? play() : pause(); }

  function applyRate() {
    const rate = state.gradual && state.rampFrom !== null ? currentRampRate() : state.speed;
    audio.playbackRate = rate;
    el.speedOut.textContent = rate.toFixed(2) + '×';
  }

  function currentRampRate() {
    if (state.rampFrom === null) return state.speed;
    const t = Math.min(1, Math.max(0, (audio.currentTime - state.rampStart) / state.rampDur));
    const r = state.rampFrom + (state.rampTo - state.rampFrom) * t;
    return r;
  }

  /* --------------------------------------------------------- visualizer */

  function fitCanvas(cv) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr; cv.height = h * dpr;
    }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawBars(ctx, w, h, data, colorA, colorB) {
    const n = data.length;
    const bw = w / n;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, colorA); g.addColorStop(1, colorB);
    ctx.fillStyle = g;
    for (let i = 0; i < n; i++) {
      const v = data[i] / 255;
      const bh = Math.max(2, v * h * 0.92);
      const x = i * bw;
      ctx.globalAlpha = 0.35 + v * 0.65;
      ctx.fillRect(x + bw * 0.18, h - bh, bw * 0.64, bh);
    }
    ctx.globalAlpha = 1;
  }

  function drawRadial(ctx, w, h, data) {
    const cx = w / 2, cy = h / 2;
    const n = Math.min(96, data.length);
    const rMax = Math.min(w, h) * 0.42;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const v = data[i * Math.floor(data.length / n)] / 255;
      const r1 = rMax * 0.55;
      const r2 = r1 + v * rMax * 0.55;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.strokeStyle = `rgba(${37 + v * 218}, ${244 - v * 197}, ${238 - v * 163}, ${0.35 + v * 0.65})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
  }

  let rafId = null;
  function loop() {
    rafId = requestAnimationFrame(loop);

    const bw = el.viz.clientWidth, bh = el.viz.clientHeight;
    const ctx = fitCanvas(el.viz);
    ctx.clearRect(0, 0, bw, bh);

    let data = null;
    if (state.ready && state.nodes) {
      const an = state.nodes.analyser;
      data = new Uint8Array(an.frequencyBinCount);
      an.getByteFrequencyData(data);
    }
    if (!data) data = new Uint8Array(128).fill(6);

    if (!audio.paused && state.gradual) applyRate();

    drawBars(ctx, bw, bh, data, '#ff2f4d', 'rgba(37,244,238,0.55)');

    // reflection
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.translate(0, bh);
    ctx.scale(1, -0.42);
    ctx.filter = 'blur(1px)';
    drawBars(ctx, bw, bh, data, '#ff2f4d', 'rgba(37,244,238,0.55)');
    ctx.restore();
    ctx.filter = 'none';

    // hero ring
    const hw = el.heroViz.clientWidth, hh = el.heroViz.clientHeight;
    if (hw) {
      const hctx = fitCanvas(el.heroViz);
      hctx.clearRect(0, 0, hw, hh);
      drawRadial(hctx, hw, hh, data);
    }
  }

  /* --------------------------------------------------------- tracklist */

  function fmtViews(v) {
    if (v >= 1000000) return (v / 1000000).toFixed(v >= 10000000 ? 0 : 1).replace('.0', '') + 'M';
    if (v >= 1000) return Math.round(v / 1000) + 'K';
    return String(v);
  }

  function buildTracklist() {
    el.tracklist.innerHTML = '';
    TRACKS.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'track' + (i === 0 ? ' playing' : '');
      row.dataset.idx = i;
      row.innerHTML =
        `<span class="idx">${String(i + 1).padStart(2, '0')}</span>` +
        `<span class="t-name">${t.title} <em>${t.alt}${t.orig ? ' — org by ' + t.orig : ''}</em></span>` +
        `<span class="t-views">${fmtViews(t.views)} views</span>` +
        (t.local ? '<span class="tag-local">LOCAL</span>' : '<span class="tag-yt">YOUTUBE</span>');
      row.addEventListener('click', () => loadTrack(i, true));
      el.tracklist.appendChild(row);
    });
  }

  function highlightTrack() {
    [...el.tracklist.children].forEach((c, i) => c.classList.toggle('playing', i === state.idx));
  }

  /* --------------------------------------------------------- toast */

  let toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText =
        'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:999;' +
        'padding:11px 20px;border-radius:999px;background:rgba(20,12,16,.94);color:#f4eef1;' +
        'font:500 .85rem system-ui;border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(10px);' +
        'opacity:0;transition:opacity .25s,transform .25s;';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => { toastEl.style.opacity = '1'; toastEl.style.transform = 'translateX(-50%) translateY(-4px)'; });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.transform = 'translateX(-50%)'; }, 2200);
  }

  /* --------------------------------------------------------- description */

  function pageUrl() {
    const u = new URL(window.location.href);
    u.hash = '';
    u.search = '';
    return u.toString().replace(/\/$/, '');
  }

  function buildDescription() {
    const page = pageUrl();
    const mp3 = `${page}/audio/9mm-slowed.mp3`;
    return [
      `9mm (Slowed) — org by Memphis Cult, Groove Dealers, SPLYXER`,
      `Slowed + Reverbed by @vixerwaxe`,
      ``,
      `▶ Play it back with live slowed & reverb controls (speed, reverb, bass) — free, right in your browser:`,
      page,
      ``,
      `⬇ Free MP3:`,
      mp3,
      ``,
      `▶ Official video: https://www.youtube.com/watch?v=${FEATURED.id}`,
      `⚙ Player is open source (MIT): ${GH_REPO}`,
      ``,
      `No copyright infringement intended. All rights to the original production belong to Memphis Cult, Groove Dealers and SPLYXER.`,
      ``,
      `#slowed #reverb #graduallyslowed #slowedtoperfection #phonk #9mm #memphiscult #groovedealers #splyxer #tiktok #tiktoksong #vixerwaxe`,
    ].join('\n');
  }

  function refreshDescription() {
    el.desc.value = buildDescription();
    const page = pageUrl();
    $('#link-page').textContent = page;
    $('#link-gh').textContent = GH_REPO;
    $('#link-yt').textContent = `youtube.com/watch?v=${FEATURED.id}`;
  }

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    el.copied.hidden = false;
    el.copied.textContent = `✓ ${label} copied`;
    clearTimeout(copyText._t);
    copyText._t = setTimeout(() => { el.copied.hidden = true; }, 2200);
  }

  /* --------------------------------------------------------- presets */

  const PRESETS = {
    slowed:     { speed: 0.80, reverb: 0.45, bass: 5 },
    gradual:    { speed: 0.78, reverb: 0.55, bass: 6, gradual: true },
    extra:      { speed: 0.62, reverb: 0.60, bass: 7 },
    reverbonly: { speed: 0.90, reverb: 0.80, bass: 3 },
    original:   { speed: 1.00, reverb: 0.00, bass: 0 },
  };

  function applyPreset(name) {
    const p = PRESETS[name];
    if (!p) return;
    state.speed = p.speed; state.reverb = p.reverb; state.bass = p.bass;
    state.gradual = !!p.gradual;
    el.speed.value = Math.round(p.speed * 100);
    el.reverb.value = Math.round(p.reverb * 100);
    el.bass.value = p.bass;
    el.gradual.checked = state.gradual;
    el.speedOut.textContent = p.speed.toFixed(2) + '×';
    el.reverbOut.textContent = Math.round(p.reverb * 100) + '%';
    el.bassOut.textContent = (p.bass > 0 ? '+' : '') + p.bass + ' dB';
    if (!state.gradual) { state.rampFrom = null; }
    applyRate(); applyMix();
  }

  /* --------------------------------------------------------- wiring */

  function wire() {
    el.play.addEventListener('click', toggle);
    el.heroPlay.addEventListener('click', () => { loadTrack(0, true); document.getElementById('player').scrollIntoView({ behavior: 'smooth' }); });
    el.prev.addEventListener('click', () => loadTrack((state.idx - 1 + TRACKS.length) % TRACKS.length, true));
    el.next.addEventListener('click', () => loadTrack((state.idx + 1) % TRACKS.length, true));

    el.loop.addEventListener('click', () => {
      state.looping = !state.looping;
      audio.loop = state.looping;
      el.loop.classList.toggle('on', state.looping);
      toast(state.looping ? 'Loop on' : 'Loop off');
    });

    el.seek.addEventListener('input', () => {
      if (!audio.duration || !isFinite(audio.duration)) return;
      audio.currentTime = (el.seek.value / 1000) * audio.duration;
    });

    el.vol.addEventListener('input', () => {
      audio.volume = el.vol.value / 100;
      if (audio.volume > 0) state.muted = false;
    });

    el.speed.addEventListener('input', () => {
      state.speed = el.speed.value / 100;
      if (state.gradual) { state.rampTo = state.speed; if (state.rampFrom === null) state.rampFrom = 1.0; }
      applyRate();
    });

    el.reverb.addEventListener('input', () => {
      state.reverb = el.reverb.value / 100;
      el.reverbOut.textContent = el.reverb.value + '%';
      applyMix();
    });

    el.bass.addEventListener('input', () => {
      state.bass = +el.bass.value;
      el.bassOut.textContent = (state.bass > 0 ? '+' : '') + state.bass + ' dB';
      applyMix();
    });

    el.gradual.addEventListener('change', () => {
      state.gradual = el.gradual.checked;
      if (state.gradual) { state.rampFrom = 1.0; state.rampStart = audio.currentTime; state.rampTo = state.speed; }
      else { state.rampFrom = null; applyRate(); }
    });

    el.keepPitch.addEventListener('change', () => { state.keepPitch = el.keepPitch.checked; setPitchMode(); });

    document.querySelectorAll('.preset').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.preset').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        applyPreset(b.dataset.preset);
      });
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration || !isFinite(audio.duration)) return;
      el.seek.value = Math.round((audio.currentTime / audio.duration) * 1000);
      el.tCur.textContent = fmtTime(audio.currentTime);
      el.tDur.textContent = fmtTime(audio.duration);
    });
    audio.addEventListener('loadedmetadata', () => {
      el.tDur.textContent = fmtTime(audio.duration);
      applyRate();
    });
    audio.addEventListener('ended', () => {
      if (state.looping) return;
      if (state.idx < TRACKS.length - 1) loadTrack(state.idx + 1, true);
      else pause();
    });

    $('#copy-desc').addEventListener('click', () => copyText(el.desc.value, 'Description'));
    $('#copy-page').addEventListener('click', () => copyText(pageUrl(), 'Page link'));
    $('#copy-gh').addEventListener('click', () => copyText(GH_REPO, 'GitHub link'));
    el.desc.addEventListener('input', () => { /* user-edited, keep */ });

    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' && e.target.type !== 'range' && e.target !== el.seek) return;
      if (tag === 'textarea') return;
      switch (e.key) {
        case ' ': e.preventDefault(); toggle(); break;
        case 'ArrowLeft': if (audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 5); break;
        case 'ArrowRight': if (audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); break;
        case 'ArrowUp': e.preventDefault(); el.speed.value = Math.min(100, +el.speed.value + 2); el.speed.dispatchEvent(new Event('input')); break;
        case 'ArrowDown': e.preventDefault(); el.speed.value = Math.max(50, +el.speed.value - 2); el.speed.dispatchEvent(new Event('input')); break;
        case 'm': case 'M':
          state.muted = !state.muted; applyMix();
          toast(state.muted ? 'Muted' : 'Unmuted');
          break;
      }
    });

    window.addEventListener('resize', () => { /* canvas refits on next frame */ });
  }

  function fmtTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  /* --------------------------------------------------------- init */

  function init() {
    buildTracklist();
    wire();
    refreshDescription();
    setPitchMode();
    audio.volume = el.vol.value / 100;
    audio.src = TRACKS[0].local;
    applyRate();
    el.npTitle.textContent = `${TRACKS[0].title} ${TRACKS[0].alt}`;
    el.npArtist.textContent = `@vixerwaxe — org by ${TRACKS[0].orig}`;
    el.speedOut.textContent = state.speed.toFixed(2) + '×';
    el.reverbOut.textContent = Math.round(state.reverb * 100) + '%';
    el.bassOut.textContent = '+' + state.bass + ' dB';
    loop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
