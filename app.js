/**
 * EloQuentia — Where Expression Finds Its Voice
 * A School Partnership for Student Development & Creative Excellence
 * Interactive Logic, Live DMX Stage Simulator, Dynamic Budget Calculator & Ambient Soundscape
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBudgetCalculator();
  initStageSimulator();
  initAmbientMotes();
  setCurrentYear();
  initScrollAnimations();
});

/* ==========================================================================
   Navigation & Scroll Effects
   ========================================================================== */
function initNavigation() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close on click link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   Empathy-Inspired Ambient Theater Audio Synthesizer (Web Audio API)
   Generates a lush, ethereal cinematic stage pad chord without external files
   ========================================================================== */
let audioCtx = null;
let soundNodes = [];
let isAudioPlaying = false;

function toggleAmbientSound() {
  const btn = document.getElementById('soundToggleBtn');
  const label = document.getElementById('soundStateLabel');

  if (!isAudioPlaying) {
    startAmbientSound();
    isAudioPlaying = true;
    if (btn) btn.classList.add('playing');
    if (label) label.textContent = 'Sound: On';
    showToast('♫ Ambient Theatre Soundscape Activated (Spatial Stage Drone)');
  } else {
    stopAmbientSound();
    isAudioPlaying = false;
    if (btn) btn.classList.remove('playing');
    if (label) label.textContent = 'Sound: Off';
    showToast('Soundscape paused.');
  }
}

function startAmbientSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // F Major 9 Ambient Theater Chord: F3, C4, E4, G4, A4
    const freqs = [174.61, 261.63, 329.63, 392.00, 440.00];
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2.5);

    // Warm Lowpass Filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.8, audioCtx.currentTime);

    // LFO for slow breath-like modulation
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(120, audioCtx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);

    soundNodes = [masterGain, filter, lfo];

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.18 / freqs.length, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      soundNodes.push(osc, oscGain);
    });
  } catch (e) {
    console.warn('Audio synthesis initialized with error:', e);
  }
}

function stopAmbientSound() {
  if (audioCtx && soundNodes.length > 0) {
    try {
      const master = soundNodes[0];
      if (master && master.gain) {
        master.gain.setValueAtTime(master.gain.value, audioCtx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        setTimeout(() => {
          soundNodes.forEach(node => {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
          });
          soundNodes = [];
        }, 1300);
      }
    } catch (e) {
      soundNodes = [];
    }
  }
}

function dismissSoundDock() {
  const dock = document.getElementById('soundDockBanner');
  if (dock) {
    dock.classList.add('hidden');
    stopAmbientSound();
    isAudioPlaying = false;
  }
}

/* ==========================================================================
   Ambient Studio Floating Motes
   ========================================================================== */
function initAmbientMotes() {
  const container = document.getElementById('ambientMotes');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const mote = document.createElement('div');
    const size = Math.random() * 5 + 3;
    mote.style.position = 'absolute';
    mote.style.width = `${size}px`;
    mote.style.height = `${size}px`;
    mote.style.borderRadius = '50%';
    mote.style.background = i % 2 === 0 
      ? 'rgba(139, 92, 246, 0.35)' 
      : 'rgba(251, 191, 36, 0.4)';
    mote.style.filter = 'blur(1px)';
    mote.style.left = `${Math.random() * 100}%`;
    mote.style.top = `${Math.random() * 100}%`;
    mote.style.opacity = (Math.random() * 0.5 + 0.2).toString();
    mote.style.animation = `floatMote ${12 + Math.random() * 16}s infinite alternate ease-in-out`;
    mote.style.animationDelay = `${Math.random() * 6}s`;
    container.appendChild(mote);
  }
}

/* ==========================================================================
   Pillar 1: Annual Day Theme Tabs
   ========================================================================== */
function switchThemeTab(themeKey) {
  // Update Tab buttons
  const buttons = document.querySelectorAll('.theme-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-${themeKey}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update Panes
  const panes = document.querySelectorAll('.theme-tab-pane');
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(`pane-${themeKey}`);
  if (targetPane) targetPane.classList.add('active');
}

/* ==========================================================================
   Pillar 3: Stagecraft & DMX Lighting Simulator
   ========================================================================== */
let activeLighting = 'royale';

function initStageSimulator() {
  setStageLighting('royale', 'Scene 04: The Royal Coronation', 'Lighting: Regal Burnished Amber • SFX: Low Fog Cloud • Audio: Royal Choral Fanfare');
}

function setStageLighting(themeClass, title, desc) {
  const viewport = document.getElementById('simViewport');
  const titleEl = document.getElementById('simCueTitle');
  const descEl = document.getElementById('simCueDesc');
  const buttons = document.querySelectorAll('.sim-btn-preset');

  if (!viewport) return;

  viewport.classList.remove('lighting-royale', 'lighting-drama', 'lighting-sapphire', 'lighting-emerald');
  viewport.classList.add(`lighting-${themeClass}`);

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  buttons.forEach(btn => {
    const attr = btn.getAttribute('onclick') || '';
    if (attr.includes(themeClass)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  activeLighting = themeClass;
}

function triggerSimulatorSFX() {
  const viewport = document.getElementById('simViewport');
  if (!viewport) return;

  // Create Cold Pyro Spark Particles
  for (let i = 0; i < 35; i++) {
    const spark = document.createElement('div');
    spark.className = 'pyro-spark-particle';
    spark.style.position = 'absolute';
    spark.style.bottom = '20px';
    spark.style.left = `${30 + Math.random() * 40}%`;
    spark.style.width = `${3 + Math.random() * 4}px`;
    spark.style.height = `${12 + Math.random() * 18}px`;
    spark.style.borderRadius = '3px';
    spark.style.background = activeLighting === 'drama' 
      ? 'linear-gradient(to top, #ffedd5, #f43f5e)' 
      : 'linear-gradient(to top, #ffffff, #f59e0b)';
    spark.style.boxShadow = '0 0 12px #f59e0b';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '10';
    spark.style.opacity = '1';
    spark.style.transition = 'all 0.85s cubic-bezier(0.25, 1, 0.5, 1)';

    viewport.appendChild(spark);

    setTimeout(() => {
      spark.style.transform = `translate(${(Math.random() - 0.5) * 140}px, -${160 + Math.random() * 190}px) rotate(${(Math.random() - 0.5) * 60}deg)`;
      spark.style.opacity = '0';
    }, 20);

    setTimeout(() => {
      spark.remove();
    }, 900);
  }

  showToast('✨ Cold Sparkular Pyrotechnics Fired! (Zero Flame & 100% Indoor Safe)');
}

/* ==========================================================================
   Pillar 4: Interactive Annual Function Budget Calculator
   ========================================================================== */
let selectedVenue = 'amphitheatre';
let selectedTier = 'heritage';

function initBudgetCalculator() {
  recalculateBudget();
}

function setVenue(venueKey) {
  selectedVenue = venueKey;
  const buttons = document.querySelectorAll('[data-venue]');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-venue') === venueKey) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  recalculateBudget();
}

function setTier(tierKey) {
  selectedTier = tierKey;
  const buttons = document.querySelectorAll('[data-tier]');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-tier') === tierKey) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  recalculateBudget();
}

function recalculateBudget() {
  const sliderStudents = document.getElementById('sliderStudents');
  const sliderAudience = document.getElementById('sliderAudience');
  const valStudentsEl = document.getElementById('valStudents');
  const valAudienceEl = document.getElementById('valAudience');

  if (!sliderStudents || !sliderAudience) return;

  const students = parseInt(sliderStudents.value, 10);
  const audience = parseInt(sliderAudience.value, 10);

  valStudentsEl.textContent = `${students.toLocaleString()} Students`;
  valAudienceEl.textContent = `${audience.toLocaleString()} Guests`;

  let tierMultiplier = 1.0;
  let tierName = 'Heritage Grandeur';
  if (selectedTier === 'executive') {
    tierMultiplier = 0.75;
    tierName = 'Executive Academy';
  } else if (selectedTier === 'royale') {
    tierMultiplier = 1.45;
    tierName = 'Signature Royale';
  }

  let venueBase = 2.5; // Lakhs
  let venueName = 'Open Amphitheatre';
  if (selectedVenue === 'auditorium') {
    venueBase = 2.0;
    venueName = 'Indoor Auditorium';
  } else if (selectedVenue === 'ground') {
    venueBase = 3.8;
    venueName = 'School Sports Ground';
  }

  const costPerStudent = 0.014;
  const studentTotal = students * costPerStudent;

  const costPerAudience = 0.0006;
  const audienceTotal = audience * costPerAudience;

  let activeModuleCount = 0;
  const modules = [
    'modScript', 'modMusic', 'modDance', 'modSound',
    'modLight', 'modLed', 'modCostumes', 'modBroadcast'
  ];

  modules.forEach(id => {
    const cb = document.getElementById(id);
    if (cb && cb.checked) activeModuleCount++;
  });

  const moduleRatio = activeModuleCount / 8;
  const totalRaw = (venueBase + studentTotal + audienceTotal) * tierMultiplier * (0.4 + 0.6 * moduleRatio);
  const minEstimate = Math.max(4.5, totalRaw * 0.92);
  const maxEstimate = Math.max(6.0, totalRaw * 1.18);

  const displayBracketEl = document.getElementById('displayBracket');
  const displaySummaryDetailsEl = document.getElementById('displaySummaryDetails');

  if (displayBracketEl) {
    displayBracketEl.textContent = `₹${minEstimate.toFixed(1)}L – ₹${maxEstimate.toFixed(1)}L`;
  }

  if (displaySummaryDetailsEl) {
    displaySummaryDetailsEl.textContent = `${students} students at an ${venueName} in ${tierName} tier`;
  }

  let pStage = 38;
  let pCostumes = 24;
  let pArt = 22;
  let pBackstage = 16;

  const hasSound = document.getElementById('modSound')?.checked ?? true;
  const hasLight = document.getElementById('modLight')?.checked ?? true;
  const hasLed = document.getElementById('modLed')?.checked ?? true;
  const hasCostumes = document.getElementById('modCostumes')?.checked ?? true;

  if (!hasLed || !hasLight || !hasSound) {
    pStage -= 8;
    pArt += 4;
    pCostumes += 4;
  }

  if (!hasCostumes) {
    pCostumes -= 12;
    pStage += 6;
    pArt += 6;
  }

  const sum = pStage + pCostumes + pArt + pBackstage;
  const normStage = Math.round((pStage / sum) * 100);
  const normCostumes = Math.round((pCostumes / sum) * 100);
  const normArt = Math.round((pArt / sum) * 100);
  const normBackstage = 100 - (normStage + normCostumes + normArt);

  const barStage = document.getElementById('barStage');
  const barCostumes = document.getElementById('barCostumes');
  const barArt = document.getElementById('barArt');
  const barBackstage = document.getElementById('barBackstage');

  if (barStage) barStage.style.width = `${normStage}%`;
  if (barCostumes) barCostumes.style.width = `${normCostumes}%`;
  if (barArt) barArt.style.width = `${normArt}%`;
  if (barBackstage) barBackstage.style.width = `${normBackstage}%`;

  const pctStageEl = document.getElementById('pctStage');
  const pctCostumesEl = document.getElementById('pctCostumes');
  const pctArtEl = document.getElementById('pctArt');
  const pctBackstageEl = document.getElementById('pctBackstage');

  if (pctStageEl) pctStageEl.textContent = `${normStage}%`;
  if (pctCostumesEl) pctCostumesEl.textContent = `${normCostumes}%`;
  if (pctArtEl) pctArtEl.textContent = `${normArt}%`;
  if (pctBackstageEl) pctBackstageEl.textContent = `${normBackstage}%`;
}

function transferEstimateToProposal() {
  const bracket = document.getElementById('displayBracket')?.textContent || '₹12.5L – ₹16.8L';
  const students = document.getElementById('valStudents')?.textContent || '450 Students';
  const venue = selectedVenue;
  const tier = selectedTier;

  openConsultationModal(`Budget Estimate: ${bracket} (${students}, ${tier} tier, ${venue})`);
}

/* ==========================================================================
   Consultation Modal & Form Handling
   ========================================================================== */
function openConsultationModal(contextText) {
  const modal = document.getElementById('consultationModal');
  const contextInput = document.getElementById('modalContext');
  const modalTag = document.getElementById('modalTag');

  if (contextInput && contextText) {
    contextInput.value = contextText;
  } else if (contextInput) {
    contextInput.value = 'Annual Function 360° Proposal Request';
  }

  if (modalTag && contextText) {
    modalTag.textContent = contextText.startsWith('Budget') ? 'Custom Budget Estimate' : 'Annual Function Proposal';
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeConsultationModal() {
  const modal = document.getElementById('consultationModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('consultationModal');
  if (e.target === modal) {
    closeConsultationModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeConsultationModal();
  }
});

function handleModalSubmit(e) {
  e.preventDefault();
  const school = document.getElementById('modalSchool')?.value || '';
  const name = document.getElementById('modalName')?.value || '';
  const phone = document.getElementById('modalPhone')?.value || '';
  const context = document.getElementById('modalContext')?.value || '';
  const notes = document.getElementById('modalNotes')?.value || '';

  closeConsultationModal();
  showToast(`Thank you, ${name}! Your proposal request for ${school} has been prepared.`);

  const subject = encodeURIComponent(`EloQuentia Annual Day Proposal: ${school}`);
  const body = encodeURIComponent(
    `School: ${school}\n` +
    `Contact Person: ${name}\n` +
    `Phone: ${phone}\n` +
    `Scope / Estimate: ${context}\n\n` +
    `Notes: ${notes}\n\n` +
    `Please send us the comprehensive draft proposal and date availability.`
  );

  setTimeout(() => {
    window.location.href = `mailto:productions@eloquentia.in?subject=${subject}&body=${body}`;
  }, 1200);
}

function handleMainFormSubmit(e) {
  e.preventDefault();
  const school = document.getElementById('schoolName')?.value || '';
  const contact = document.getElementById('contactPerson')?.value || '';
  const phone = document.getElementById('phone')?.value || document.getElementById('contactPhone')?.value || '';
  const season = document.getElementById('eventSeason')?.value || document.getElementById('targetMonth')?.value || 'Partnership Inquiry';
  const theme = document.getElementById('themeInterest')?.value || '';
  const notes = document.getElementById('notes')?.value || '';

  showToast(`RFP Received! Partnership inquiry for ${school} has been submitted.`);

  const subject = encodeURIComponent(`EloQuentia School Partnership RFP: ${school}`);
  const body = encodeURIComponent(
    `School Name: ${school}\n` +
    `Contact Person: ${contact}\n` +
    `Phone / WhatsApp: ${phone}\n` +
    `Partnership Scope: ${season}\n` +
    `Preferred Theme Direction: ${theme}\n\n` +
    `Notes & Requirements:\n${notes}\n\n` +
    `Direct Call Hotline: +91 98765 43210 / +91 98260 88210\n` +
    `Website: www.eloquentia.in`
  );

  setTimeout(() => {
    window.location.href = `mailto:info@eloquentia.in?cc=productions@eloquentia.in&subject=${subject}&body=${body}`;
  }, 1200);
}

function handleProposalSubmit(e) {
  handleMainFormSubmit(e);
}


/* ==========================================================================
   Toast Notification System
   ========================================================================== */
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   Splash Screen Controller
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById('splashScreen');
  if (!splash) return;

  document.body.classList.add('splash-active');

  const autoDismissTimer = setTimeout(() => {
    dismissSplashScreen();
  }, 2400);

  window.dismissSplashScreen = function() {
    clearTimeout(autoDismissTimer);
    if (!splash.classList.contains('splash-fade-out')) {
      splash.classList.add('splash-fade-out');
      document.body.classList.remove('splash-active');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 750);
    }
  };

  // Allow clicking anywhere outside buttons to dismiss immediately
  splash.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      dismissSplashScreen();
    }
  });
}

/* ==========================================================================
   Scroll-Driven Text & Element Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  document.documentElement.classList.add('js-scroll-active');

  // Hero content smooth entry
  const heroItems = document.querySelectorAll('.hero-content > *');
  heroItems.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${0.1 + index * 0.12}s`;
    setTimeout(() => {
      el.classList.add('is-revealed');
    }, 120);
  });

  const textSelectors = [
    '.section-header .section-tag',
    '.section-header .section-title',
    '.section-header .section-subtitle',
    '.quote-editorial-box',
    '.vision-mission-card',
    '.pillars-5-grid > *',
    '.concept-stage-card',
    '.service-card-premium',
    '.themes-showcase-box',
    '.process-step-box',
    '.why-card',
    '.testimonial-card',
    '.cta-info-col > *',
    '.metric-item',
    '.stage-card-body > *',
    '.breakdown-card',
    '.bottom-hotlines-strip'
  ];

  const elementsToReveal = document.querySelectorAll(textSelectors.join(', '));

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        if (entry.target.classList.contains('metric-item')) {
          animateMetricNumber(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach((el) => {
    el.classList.add('reveal-on-scroll');

    // Add staggered delay for grid siblings
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal-on-scroll'));
      const index = siblings.indexOf(el);
      if (index > 0) {
        el.style.transitionDelay = `${Math.min(index * 0.08, 0.45)}s`;
      }
    }

    revealObserver.observe(el);
  });
}

function animateMetricNumber(metricEl) {
  const numEl = metricEl.querySelector('.metric-number');
  if (!numEl || numEl.dataset.animated) return;
  numEl.dataset.animated = 'true';

  const originalText = numEl.textContent.trim();
  const match = originalText.match(/^([\d,]+)(\+?%?)$/);
  if (!match) return;

  const rawNum = parseInt(match[1].replace(/,/g, ''), 10);
  const suffix = match[2];
  const duration = 1600;
  const startTime = performance.now();

  function updateNum(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(rawNum * ease);
    numEl.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNum);
    } else {
      numEl.textContent = originalText;
    }
  }

  requestAnimationFrame(updateNum);
}
