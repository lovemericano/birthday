/**
 * Birthday Website — script.js
 * For Restu Oktaviani, 22 October 2002
 *
 * TO CHANGE THE SONG:
 * Taruh file mp3 di assets/ lalu ganti src di <audio> tag di index.html
 * Cari: assets/first-love.mp3
 */

// ================================================================
// CONFIG
// ================================================================
const CHAPTERS = [
  { id: 's1', label: 'The Beginning' },
  { id: 's2', label: 'The Past' },
  { id: 's3', label: "What I Couldn't Find" },
  { id: 's4', label: '2026' },
  { id: 's5', label: 'First Love' },
  { id: 's6', label: 'Our Memories' },
  { id: 's7', label: 'Happy Birthday' },
  { id: 's8', label: 'A Letter' },
  { id: 's9', label: 'Keep Going' },
  { id: 's10', label: 'The End' },
];

// ================================================================
// DOM REFS
// ================================================================
const introScreen   = document.getElementById('intro');
const btnOpen       = document.getElementById('btnOpen');
const mainStory     = document.getElementById('mainStory');
const musicControl  = document.getElementById('musicControl');
const chapterLabel  = document.getElementById('chapterLabel');
const progressBar   = document.getElementById('progressBar');
const waveform      = document.getElementById('waveform');

// Audio
const audio         = document.getElementById('audioPlayer');
const btnPlaySong   = document.getElementById('btnPlaySong');
const playIcon      = document.getElementById('playIcon');
const playLabel     = document.getElementById('playLabel');
const audioBar      = document.getElementById('audioProgressBar');

// Floating button
const musicToggle   = document.getElementById('musicToggle');
const floatIcon     = document.getElementById('floatIcon');
const floatLabel    = document.getElementById('floatLabel');

// ================================================================
// INTRO → STORY TRANSITION
// ================================================================
btnOpen.addEventListener('click', openStory);
btnOpen.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openStory();
});

function openStory() {
  introScreen.classList.add('fade-out');
  setTimeout(() => {
    introScreen.style.display = 'none';
    mainStory.classList.remove('hidden');
    musicControl.style.opacity = '0';
    musicControl.style.transition = 'opacity 0.8s';
    initIntersectionObserver();
    initScrollProgress();
    setTimeout(() => { musicControl.style.opacity = '1'; }, 800);
  }, 1200);
}

// ================================================================
// HTML5 AUDIO CONTROLS
// ================================================================
function setPlayingUI(playing) {
  if (playIcon)   playIcon.textContent   = playing ? '❚❚' : '▶';
  if (playLabel)  playLabel.textContent  = playing ? 'Pause' : 'Play First Love';
  if (floatIcon)  floatIcon.textContent  = playing ? '❚❚' : '♪';
  if (floatLabel) floatLabel.textContent = playing ? 'Pause' : 'First Love';
  if (musicToggle) musicToggle.classList.toggle('is-playing', playing);
  if (waveform)   waveform.classList.toggle('animating', playing);
}

function toggleAudio() {
  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(() => {
      // Autoplay blocked — still update UI so user knows to try again
      console.warn('Audio play blocked by browser.');
    });
  } else {
    audio.pause();
  }
}

if (audio) {
  audio.addEventListener('play',  () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));
  audio.addEventListener('ended', () => setPlayingUI(false));

  // Update progress bar as song plays
  audio.addEventListener('timeupdate', () => {
    if (!audioBar || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    audioBar.style.width = pct + '%';
  });
}

if (btnPlaySong) btnPlaySong.addEventListener('click', toggleAudio);
if (musicToggle) musicToggle.addEventListener('click', toggleAudio);

// ================================================================
// INTERSECTION OBSERVER — fade-in sections
// ================================================================
function initIntersectionObserver() {
  const targets = document.querySelectorAll('.fade-in-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el) => observer.observe(el));
}

// ================================================================
// SCROLL PROGRESS + CHAPTER LABEL
// ================================================================
function initScrollProgress() {
  const sectionEls = CHAPTERS.map(c => document.getElementById(c.id)).filter(Boolean);

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;

    let current = CHAPTERS[0].label;
    sectionEls.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        current = CHAPTERS[i].label;
      }
    });
    chapterLabel.textContent = current;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ================================================================
// SUBTLE PARALLAX
// ================================================================
function initParallax() {
  const photos = document.querySelectorAll('.story-photo');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        photos.forEach((el) => {
          const rect   = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          const shift  = (center / window.innerHeight) * 6;
          el.style.transform = `translateY(${shift}px) scale(1.025)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    btnOpen.addEventListener('click', () => {
      setTimeout(initParallax, 1400);
    }, { once: true });
  }
});
