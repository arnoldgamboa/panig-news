const dateButtons = [...document.querySelectorAll('.date-pill')];
const drawer = document.getElementById('item-drawer');
let topicObserver;
let previousFocus;

function bindTopicSpy(date) {
  topicObserver?.disconnect();
  const links = [...document.querySelectorAll(`[data-topic-day="${date}"] a`)];
  if (!links.length) return;

  topicObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle('is-active', link.dataset.topic === visible.target.id));
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.4] });

  document.querySelectorAll(`[data-day="${date}"] .cluster`).forEach((section) => topicObserver.observe(section));
}

function showDate(button) {
  const date = button.dataset.date;
  document.getElementById('hero-date').dateTime = date;
  document.getElementById('hero-date').textContent = button.dataset.longDate;
  document.getElementById('hero-meta').textContent = button.dataset.meta;

  dateButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-day]').forEach((day) => { day.hidden = day.dataset.day !== date; });
  document.querySelectorAll('[data-topic-day]').forEach((nav) => { nav.hidden = nav.dataset.topicDay !== date; });
  bindTopicSpy(date);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function spotlightPerspective(button) {
  if (button.disabled) return;
  const section = document.getElementById(button.dataset.cluster);
  const strip = section.querySelector('[data-perspective-strip]');
  const selected = button.getAttribute('aria-pressed') !== 'true';
  strip.querySelectorAll('[data-perspective]').forEach((choice) => {
    choice.setAttribute('aria-pressed', String(selected && choice === button));
  });
  const postsWrap = section.querySelector('[data-creator-posts]');
  const posts = [...postsWrap.querySelectorAll('[data-perspective-lens]')];
  postsWrap.classList.toggle('is-filtering', selected);
  posts.forEach((post) => post.classList.toggle('is-spotlight', selected && post.dataset.perspectiveLens === button.dataset.perspective));
  const status = strip.querySelector('.perspective-strip__status');
  const label = button.querySelector('.perspective-choice__label').textContent;
  status.textContent = selected
    ? `Showing ${button.dataset.countLabel}: ${label}.`
    : 'Showing all sampled posts.';
  status.classList.toggle('is-active', selected);
  if (selected) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    posts.find((post) => post.classList.contains('is-spotlight'))?.scrollIntoView({ behavior: motion, block: 'start' });
  }
}

function openDrawer(card) {
  previousFocus = card;
  const source = card.querySelector('.take__source').textContent;
  const kind = card.dataset.lane === 'newsroom' ? 'Newsroom article' : 'Creator post';

  document.getElementById('drawer-kicker').textContent = `${kind} · ${card.dataset.clusterTitle}`;
  document.getElementById('drawer-title').textContent = card.querySelector('h3').textContent;
  document.getElementById('drawer-meta').textContent = source;
  const summary = document.getElementById('drawer-body');
  summary.textContent = card.dataset.summary || '';
  summary.hidden = !card.dataset.summary;
  const excerpt = document.getElementById('drawer-excerpt');
  excerpt.hidden = false;
  excerpt.textContent = `“${card.dataset.excerpt}”`;
  document.getElementById('drawer-alt').textContent = card.dataset.alt ? `Alternative reading: ${card.dataset.alt}` : '';
  const sourceLink = document.getElementById('drawer-source');
  sourceLink.hidden = !card.dataset.permalink;
  if (card.dataset.permalink) sourceLink.href = card.dataset.permalink;
  drawer.querySelector('.drawer__sample').hidden = Boolean(card.dataset.permalink);
  const details = document.getElementById('drawer-reading');
  details.replaceChildren();
  const lensRow = card.querySelector('.lens-row');
  const storyFrame = card.querySelector('.story-frame');
  const angle = card.querySelector('.take__angle');
  const readingList = card.querySelector('.reading-list');
  if (lensRow) details.append(lensRow.cloneNode(true));
  if (storyFrame) details.append(storyFrame.cloneNode(true));
  if (angle) details.append(angle.cloneNode(true));
  if (readingList) details.append(readingList.cloneNode(true));
  const label = card.querySelector('.evidence-label');
  if (label) details.append(label.cloneNode(true));

  drawer.hidden = false;
  drawer.querySelector('.drawer__close').focus();
}

function closeDrawer() {
  if (drawer.hidden) return;
  drawer.hidden = true;
  previousFocus?.focus();
}

document.getElementById('date-rail').addEventListener('click', (event) => {
  const button = event.target.closest('.date-pill');
  if (button) showDate(button);
});

document.getElementById('briefing').addEventListener('click', (event) => {
  const perspective = event.target.closest('[data-perspective]');
  if (perspective) {
    spotlightPerspective(perspective);
    return;
  }
  const card = event.target.closest('[data-open-take]');
  if (card) openDrawer(card);
});

document.getElementById('briefing').addEventListener('keydown', (event) => {
  const card = event.target.closest('[data-open-take]');
  if (card && event.target === card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openDrawer(card);
  }
});

document.querySelectorAll('[data-close-drawer]').forEach((element) => element.addEventListener('click', closeDrawer));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});

bindTopicSpy(dateButtons[0].dataset.date);
