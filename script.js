// ---------- бургер-меню ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ---------- плавный скролл ----------
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

// ---------- parallax в hero ----------
const heroGlow = document.getElementById('heroGlow');
window.addEventListener('mousemove', e=>{
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});
window.addEventListener('touchmove', e=>{
  const t = e.touches[0];
  const x = (t.clientX / window.innerWidth - 0.5) * 40;
  const y = (t.clientY / window.innerHeight - 0.5) * 40;
  heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}, {passive:true});

// ---------- звук + вибрация ----------
const AC = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function initAudio(){
  if(!audioCtx && AC) audioCtx = new AC();
}
function beep(freq=520, dur=0.08, type='sine'){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime + dur);
}
function vibrate(ms){ if(navigator.vibrate) navigator.vibrate(ms); }

// ---------- слайдер скриншотов ----------
(function(){
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');
  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i)=>{
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Скриншот ' + (i+1));
    if(i === 0) b.classList.add('active');
    b.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di)=> d.classList.toggle('active', di === index));
  }

  prevBtn.addEventListener('click', ()=> goTo(index - 1));
  nextBtn.addEventListener('click', ()=> goTo(index + 1));

  let startX = 0, startY = 0, dragging = false;
  const slider = document.getElementById('screensSlider');
  slider.addEventListener('touchstart', e=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = true;
  }, {passive:true});
  slider.addEventListener('touchend', e=>{
    if(!dragging) return;
    dragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
      goTo(index + (dx < 0 ? 1 : -1));
    }
  }, {passive:true});

  slider.setAttribute('tabindex','0');
  slider.addEventListener('keydown', e=>{
    if(e.key === 'ArrowLeft') goTo(index - 1);
    if(e.key === 'ArrowRight') goTo(index + 1);
  });
})();

// ---------- Toast Catcher ----------
const canvas = document.getElementById('toastGame');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const startBtn = document.getElementById('startBtn');

let W = 0, H = 0;
let basketX = 0, basketW = 90, basketH = 24;
let toasts = [], score = 0, lives = 5, running = false, spawnTimer = 0;
let best = +(localStorage.getItem('toastBest') || 0);
bestEl.textContent = best;

function resize(){
  const rect = canvas.parentElement.getBoundingClientRect();
  W = rect.width;
  H = Math.min(rect.width * 0.75, window.innerHeight * 0.6);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(!running) basketX = W/2 - basketW/2;
  draw();
}
window.addEventListener('resize', resize);
resize();

function moveBasket(clientX){
  const r = canvas.getBoundingClientRect();
  const x = clientX - r.left;
  basketX = Math.max(0, Math.min(W - basketW, x - basketW/2));
  if(!running) draw();
}
canvas.addEventListener('touchmove', e=>{
  e.preventDefault();
  moveBasket(e.touches[0].clientX);
}, {passive:false});
canvas.addEventListener('touchstart', e=>{
  e.preventDefault();
  initAudio();
  moveBasket(e.touches[0].clientX);
}, {passive:false});
canvas.addEventListener('mousemove', e=>moveBasket(e.clientX));
canvas.addEventListener('mousedown', ()=>initAudio());

function startGame(){
  initAudio();
  score = 0; lives = 5; toasts = []; spawnTimer = 0; running = true;
  scoreEl.textContent = 0; livesEl.textContent = 5;
  overlay.classList.add('hidden');
  last = performance.now();
  requestAnimationFrame(loop);
}

function endGame(){
  running = false;
  if(score > best){ best = score; localStorage.setItem('toastBest', best); bestEl.textContent = best; }
  overlayTitle.textContent = 'Игра окончена';
  overlayText.textContent = `Счёт: ${score} · Рекорд: ${best}`;
  startBtn.textContent = 'Ещё раз';
  overlay.classList.remove('hidden');
  beep(180, 0.3, 'sawtooth');
  vibrate([60,40,60]);
}

let last = 0;
function loop(now){
  const dt = Math.min((now - last)/1000, 0.05);
  last = now;
  update(dt);
  draw();
  if(running) requestAnimationFrame(loop);
}

function update(dt){
  spawnTimer -= dt;
  if(spawnTimer <= 0){
    spawnTimer = Math.max(0.35, 0.9 - score*0.02);
    toasts.push({ x: 20 + Math.random()*(W-40), y: -20, r: 12, vy: 120 + Math.random()*80 });
  }
  for(let i = toasts.length-1; i>=0; i--){
    const t = toasts[i];
    t.y += t.vy * dt;
    if(t.y + t.r >= H - basketH - 10 && t.y - t.r <= H - 10 &&
       t.x > basketX && t.x < basketX + basketW){
      toasts.splice(i,1); score++; scoreEl.textContent = score;
      beep(560 + Math.min(score,20)*20, 0.07);
      vibrate(15);
      continue;
    }
    if(t.y - t.r > H){
      toasts.splice(i,1); lives--; livesEl.textContent = lives;
      beep(200, 0.12, 'triangle');
      vibrate(40);
      if(lives <= 0){ endGame(); return; }
    }
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#0f0f18';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#e8b06a';
  toasts.forEach(t=>{
    ctx.beginPath();
    ctx.roundRect(t.x - t.r, t.y - t.r*0.8, t.r*2, t.r*1.6, 4);
    ctx.fill();
  });
  ctx.fillStyle = '#ff8a00';
  ctx.beginPath();
  ctx.roundRect(basketX, H - basketH - 10, basketW, basketH, 8);
  ctx.fill();
}

startBtn.addEventListener('click', startGame);
