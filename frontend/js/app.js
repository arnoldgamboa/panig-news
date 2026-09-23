const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, date: new Date(y, m - 1, d) };
}

function formatLong(iso, weekday) {
  const { m, d, y } = parseISODate(iso);
  return `${weekday}, ${MONTHS[m - 1]} ${d}, ${y}`;
}

function formatPill(iso) {
  const { m, d } = parseISODate(iso);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`;
}

function signalRow(key, value) {
  const meta = SIGNAL_META.find((s) => s.key === key);
  return `
    <div class="signal" title="${meta.name}: ${value}">
      <span class="signal__name">${meta.name}</span>
      <span class="signal__track"><span class="signal__fill" style="width:${value}%"></span></span>
      <span class="signal__val">${value}</span>
    </div>
  `;
}

function takeCard(take, clusterId) {
  const compact = ["evidence", "loaded", "certainty", "tone"];
  return `
    <article class="take take--${take.lane}" data-open-take="${clusterId}::${take.source}::${take.headline}" tabindex="0" role="button">
      <div class="take__top">
        <span class="take__source">${take.source}</span>
        <span class="take__tier">${take.tier}</span>
      </div>
      <h3>${take.headline}</h3>
      <p>${take.summary}</p>
      <span class="evidence-label ${take.label.key}">${take.label.text}</span>
      <div class="signals">
        ${compact.map((k) => signalRow(k, take.signals[k])).join("")}
      </div>
      <div class="take__footer">
        <span>Open comparison</span>
        <a href="${take.url}" target="_blank" rel="noopener">Original source ↗</a>
      </div>
    </article>
  `;
}

function clusterSection(cluster) {
  const newsrooms = cluster.takes.filter((t) => t.lane === "newsroom");
  const creators = cluster.takes.filter((t) => t.lane === "creator");
  return `
    <section class="cluster" id="${cluster.id}">
      <div class="cluster__head">
        <div>
          <p class="cluster__kicker">${cluster.kicker}</p>
          <h2>${cluster.title}</h2>
          <p class="cluster__lede">${cluster.lede}</p>
        </div>
        <aside class="cluster__aside">
          <h3>Primary evidence</h3>
          <ul>
            ${cluster.primary.map((p) => `<li><a href="${p.href}" target="_blank" rel="noopener">${p.label}</a></li>`).join("")}
          </ul>
          <h3 style="margin-top:14px">What your feed may have missed</h3>
          <p>${cluster.missed}</p>
        </aside>
      </div>
      <div class="lane-toggle" role="tablist">
        <button type="button" class="is-active" data-lane="newsroom" data-cluster="${cluster.id}">Newsrooms (${newsrooms.length})</button>
        <button type="button" data-lane="creator" data-cluster="${cluster.id}">Creators (${creators.length})</button>
      </div>
      <div class="takes" data-takes="${cluster.id}" data-active="newsroom">
        ${newsrooms.map((t) => takeCard(t, cluster.id)).join("")}
      </div>
      <div class="takes" data-takes="${cluster.id}-creator" hidden>
        ${creators.map((t) => takeCard(t, cluster.id)).join("")}
      </div>
    </section>
  `;
}

function render(iso) {
  const briefing = BRIEFINGS[iso];
  const long = formatLong(iso, briefing.weekday);
  document.getElementById("hero-date").dateTime = iso;
  document.getElementById("hero-date").textContent = long;
  document.getElementById("hero-meta").textContent =
    `${briefing.clusters.length} story clusters · newsrooms and creators scored on the same event, not as permanent brands.`;
  document.getElementById("coverage-note").textContent = briefing.coverage;
  document.getElementById("clusters").innerHTML = briefing.clusters.map(clusterSection).join("");
  renderTopicNav(briefing.clusters);

  document.querySelectorAll(".date-pill").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.date === iso);
  });

  bindLaneToggles();
  bindTakes(iso);
  bindTopicSpy();
}

function renderTopicNav(clusters) {
  const nav = document.getElementById("topic-nav");
  if (!nav) return;
  nav.innerHTML = `
    <p class="topic-rail__label">Topics</p>
    <ol>
      ${clusters.map((cluster, index) => `
        <li>
          <a href="#${cluster.id}" data-topic="${cluster.id}">
            <span class="topic-rail__index">${String(index + 1).padStart(2, "0")}</span>
            <span class="topic-rail__title">${cluster.title}</span>
            <span class="topic-rail__count">${cluster.takes.length}</span>
            <span class="topic-rail__kicker">${cluster.kicker}</span>
          </a>
        </li>
      `).join("")}
    </ol>
  `;
}

let topicObserver;

function bindTopicSpy() {
  const links = [...document.querySelectorAll(".topic-rail a")];
  if (topicObserver) topicObserver.disconnect();
  if (!links.length) return;

  links[0].classList.add("is-active");
  topicObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.topic === visible.target.id);
    });
  }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.4] });

  document.querySelectorAll(".cluster").forEach((section) => topicObserver.observe(section));
}

function bindLaneToggles() {
  document.querySelectorAll(".lane-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cluster = btn.dataset.cluster;
      const lane = btn.dataset.lane;
      btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const news = document.querySelector(`[data-takes="${cluster}"]`);
      const creators = document.querySelector(`[data-takes="${cluster}-creator"]`);
      if (lane === "newsroom") {
        news.hidden = false;
        creators.hidden = true;
      } else {
        news.hidden = true;
        creators.hidden = false;
      }
    });
  });
}

function bindTakes(iso) {
  document.querySelectorAll("[data-open-take]").forEach((card) => {
    const open = () => {
      const [clusterId, source, headline] = card.dataset.openTake.split("::");
      const take = BRIEFINGS[iso].clusters
        .find((c) => c.id === clusterId)
        .takes.find((t) => t.source === source && t.headline === headline);
      openDrawer(take, clusterId);
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      open();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

function openDrawer(take, clusterId) {
  const drawer = document.getElementById("item-drawer");
  document.getElementById("drawer-kicker").textContent = `${take.lane === "newsroom" ? "Newsroom" : "Creator"} · ${clusterId.replace(/-/g, " ")}`;
  document.getElementById("drawer-title").textContent = take.headline;
  document.getElementById("drawer-meta").textContent = `${take.source} · ${take.tier}`;
  document.getElementById("drawer-body").textContent = take.summary;
  document.getElementById("drawer-excerpt").textContent = `“${take.excerpt}”`;
  document.getElementById("drawer-signals").innerHTML = `
    <span class="evidence-label ${take.label.key}">${take.label.text}</span>
    <div class="signals" style="margin-top:12px">
      ${SIGNAL_META.map((s) => signalRow(s.key, take.signals[s.key])).join("")}
    </div>
  `;
  document.getElementById("drawer-alt").textContent = take.alt
    ? `Alternative reading: ${take.alt}`
    : "";
  const link = document.getElementById("drawer-source");
  link.href = take.url;
  drawer.hidden = false;
}

function closeDrawer() {
  document.getElementById("item-drawer").hidden = true;
}

function initRail() {
  const rail = document.getElementById("date-rail");
  rail.innerHTML = DATE_ORDER.map((iso, index) => {
    const b = BRIEFINGS[iso];
    const label = index === 0 ? `${formatPill(iso)} · Today` : formatPill(iso);
    return `<button class="date-pill" type="button" data-date="${iso}" aria-label="${formatLong(iso, b.weekday)}">${label}</button>`;
  }).join("");
  rail.addEventListener("click", (e) => {
    const btn = e.target.closest(".date-pill");
    if (!btn) return;
    render(btn.dataset.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll("[data-close-drawer]").forEach((el) => {
  el.addEventListener("click", closeDrawer);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

initRail();
render(DATE_ORDER[0]);
