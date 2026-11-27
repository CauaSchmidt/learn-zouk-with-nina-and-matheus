(function () {
  "use strict";

  var S = window.SITE;
  var doc = document.documentElement;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var debounce = function (fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Ano e WhatsApp ------------------------------------------------ */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + S.contact.whatsapp + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* Luz de palco: o tom da página segue a seção no centro da tela --- */
  var navLinks = $$(".nav a, .menu-links a");
  var toneObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      document.body.setAttribute("data-tone", entry.target.getAttribute("data-tone"));
      var id = entry.target.id;
      navLinks.forEach(function (a) {
        if (id && a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-48% 0px -51% 0px" });
  $$("[data-tone]").forEach(function (el) { if (el !== document.body) toneObserver.observe(el); });

  /* Cabeçalho: fundo ao rolar, some descendo e volta subindo -------- */
  var header = $("#header");
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    if (Math.abs(y - lastY) > 6) {
      var hide = y > lastY && y > window.innerHeight * 0.7 && !doc.classList.contains("menu-open");
      header.classList.toggle("is-hidden", hide);
      lastY = y;
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  onScroll();

  /* Menu no celular ---------------------------------------------- */
  var menu = $("#menu");
  var toggle = $(".menu-toggle");
  var toggleLabel = $(".menu-toggle-label");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggleLabel.textContent = open ? "Close" : "Menu";
    doc.classList.toggle("menu-open", open);
    if (open) header.classList.remove("is-hidden");
  }
  toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  /* Ajusta palavras gigantes à largura disponível ------------------ */
  function fitWidth(el, target) {
    var probe = el.cloneNode(true);
    probe.removeAttribute("data-fit");
    probe.style.cssText = "position:absolute;left:-99999px;top:0;visibility:hidden;animation:none;font-size:100px;display:inline-block;width:auto;white-space:nowrap";
    $$("*", probe).forEach(function (c) { c.style.display = "block"; c.style.width = "max-content"; });
    document.body.appendChild(probe);
    var w = 0;
    var kids = probe.children.length ? Array.prototype.slice.call(probe.children) : [probe];
    kids.forEach(function (k) { w = Math.max(w, k.getBoundingClientRect().width); });
    probe.remove();
    return w ? (target / w) * 100 : 0;
  }
  var giant = $(".giant");
  var contactTitle = $("[data-fit]");
  function fitAll() {
    var vw = doc.clientWidth;
    var g = fitWidth(giant, vw * 0.96);
    if (g) doc.style.setProperty("--giant", g.toFixed(1) + "px");
    if (contactTitle) {
      var box = contactTitle.parentElement.getBoundingClientRect().width;
      var pad = parseFloat(getComputedStyle(contactTitle.parentElement).paddingLeft) * 2;
      var c = fitWidth(contactTitle, (box - pad) * 0.86);
      if (c) contactTitle.style.setProperty("--fit", c.toFixed(1) + "px");
    }
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fitAll);
  window.addEventListener("resize", debounce(fitAll, 150));

  /* Faixa de palcos ---------------------------------------------- */
  var seen = {};
  var stages = S.events.filter(function (e) { return !e.isLocation; })
    .concat(S.extraStages || [])
    .filter(function (e) { if (seen[e.name]) return false; seen[e.name] = true; return true; });
  var ticker = $("#ticker");
  ticker.innerHTML =
    stages.map(function (e) { return "<li>" + esc(e.name) + "</li>"; }).join("") +
    stages.map(function (e) { return '<li aria-hidden="true">' + esc(e.name) + "</li>"; }).join("");
  ticker.style.setProperty("--ticker-duration", Math.max(40, stages.length * 4.5) + "s");

  /* Formas de aprender: acordeão + foto que acompanha ---------------- */
  var offers = $$(".offer");
  var media = $$(".learn-media img");
  function showMedia(i) { media.forEach(function (m, j) { m.classList.toggle("is-active", j === i); }); }
  function setOffer(target) {
    offers.forEach(function (o) {
      var open = o === target;
      o.classList.toggle("is-open", open);
      $(".offer-toggle", o).setAttribute("aria-expanded", String(open));
      $(".offer-panel", o).inert = !open;
    });
    if (target) showMedia(Number(target.getAttribute("data-media")));
  }
  offers.forEach(function (o) {
    $(".offer-toggle", o).addEventListener("click", function () {
      setOffer(o.classList.contains("is-open") ? null : o);
    });
    o.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse") showMedia(Number(o.getAttribute("data-media")));
    });
  });
  $("#offers").addEventListener("pointerleave", function () {
    var open = offers.filter(function (o) { return o.classList.contains("is-open"); })[0];
    if (open) showMedia(Number(open.getAttribute("data-media")));
  });
  setOffer(offers[0]);

  /* O que fazemos: painéis que expandem ---------------------------- */
  var panels = $$(".panel");
  function activatePanel(p) { panels.forEach(function (x) { x.classList.toggle("is-active", x === p); }); }
  panels.forEach(function (p) {
    p.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") activatePanel(p); });
    p.addEventListener("focus", function () { activatePanel(p); });
    p.addEventListener("click", function () { activatePanel(p); });
  });

  /* Agenda ------------------------------------------------------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WHO = { both: "Nina & Matheus", nina: "Nina", matheus: "Matheus" };
  function parse(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function dateLabel(e) {
    var a = parse(e.startDate), b = parse(e.endDate);
    var start = MONTHS[a.getMonth()] + " " + a.getDate();
    if (+a === +b) return start;
    return start + "–" + (a.getMonth() === b.getMonth() ? "" : MONTHS[b.getMonth()] + " ") + b.getDate();
  }
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var upcoming = S.events
    .filter(function (e) { return parse(e.endDate) >= today; })
    .sort(function (a, b) { return parse(a.startDate) - parse(b.startDate); });

  var list = $("#event-list");
  var empty = $("#event-empty");
  var filters = $(".filters");
  function renderEvents(filter) {
    var items = upcoming.filter(function (e) { return filter === "all" || e.instructor === filter; });
    list.innerHTML = items.map(function (e) {
      var action = "";
      if (e.link) action = '<a class="btn btn-ghost btn-sm" href="' + esc(e.link) + '" target="_blank" rel="noopener">Event info</a>';
      else if (e.isLocation) action = '<a class="btn btn-sm" href="' + esc(S.links.tidycal) + '" target="_blank" rel="noopener">Book a private</a>';
      return '<li class="tour-row">' +
        '<p class="tour-date">' + dateLabel(e) + "<small>" + parse(e.startDate).getFullYear() + "</small></p>" +
        '<div><p class="tour-name">' + esc(e.name) + '</p><p class="tour-place">' + esc(e.location) + "</p></div>" +
        '<p class="tour-who">' + WHO[e.instructor] + "</p>" +
        '<div class="tour-action">' + action + "</div>" +
        "</li>";
    }).join("");
    list.hidden = items.length === 0;
    empty.hidden = items.length > 0;
  }
  if (upcoming.length === 0) {
    filters.hidden = true;
  } else {
    $$(".filter", filters).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".filter", filters).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        renderEvents(btn.getAttribute("data-filter"));
      });
    });
  }
  renderEvents("all");

  /* Vídeos: player principal + lista ------------------------------ */
  var player = $("#player");
  var playlist = $("#playlist");
  var current = 0;
  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  function thumb(id, q) { return "https://i.ytimg.com/vi/" + id + "/" + q + ".jpg"; }

  function renderPlayer(i, autoplay) {
    var v = S.videos[i];
    var frame = autoplay
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) + '?autoplay=1&rel=0" title="' + esc(v.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
      : '<img src="' + thumb(v.id, "maxresdefault") + '" alt="" decoding="async">' +
        '<button class="player-play" type="button" aria-label="Play: ' + esc(v.title) + '"><span>' + PLAY_ICON + "Play</span></button>";
    player.innerHTML =
      '<div class="player-frame">' + frame + "</div>" +
      '<div class="player-caption"><h3>' + esc(v.title) + "</h3><p>" + esc(v.description) + "</p></div>";
    var img = $(".player-frame img", player);
    if (img) {
      var fallback = function () { if (img.src.indexOf("hqdefault") === -1) img.src = thumb(v.id, "hqdefault"); };
      img.addEventListener("error", fallback);
      img.addEventListener("load", function () { if (img.naturalWidth <= 120) fallback(); });
    }
  }
  function selectVideo(i, autoplay) {
    current = i;
    $$("button", playlist).forEach(function (b, j) { b.setAttribute("aria-current", String(j === i)); });
    renderPlayer(i, autoplay);
  }
  playlist.innerHTML = S.videos.map(function (v, i) {
    return '<li><button type="button" data-i="' + i + '" aria-current="' + (i === 0) + '">' +
      '<img src="' + thumb(v.id, "mqdefault") + '" alt="" loading="lazy" decoding="async">' +
      "<div><strong>" + esc(v.title) + "</strong><span>" + esc(v.description) + "</span></div>" +
      "</button></li>";
  }).join("");
  playlist.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var i = Number(btn.getAttribute("data-i"));
    if (i === current && $("iframe", player)) return;
    var swap = function () { selectVideo(i, true); };
    if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(swap);
    else swap();
  });
  player.addEventListener("click", function (e) {
    if (e.target.closest(".player-play")) renderPlayer(current, true);
  });
  selectVideo(0, false);
})();
