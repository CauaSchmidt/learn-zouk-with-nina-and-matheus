(function () {
  "use strict";

  var S = window.SITE;
  var I18N = window.I18N;
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

  /* ================= Idioma ================= */
  var LOCALES = { en: "en-US", pt: "pt-BR", es: "es-ES" };
  var lang = "en";
  try {
    var saved = localStorage.getItem("lz-lang");
    if (saved && LOCALES[saved]) lang = saved;
  } catch (e) { /* sem armazenamento: fica em inglês */ }

  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key]);
    if (s == null) s = I18N.en[key];
    if (s == null) s = key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }
  function loc(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] || v.en || "";
  }

  // Guarda o texto em inglês que está no HTML
  $$("[data-i18n]").forEach(function (el) { el._en = el.innerHTML; });
  $$("[data-i18n-attr]").forEach(function (el) {
    el._enAttr = {};
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var p = pair.split(":");
      el._enAttr[p[0]] = el.getAttribute(p[0]);
    });
  });

  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var v = lang === "en" ? el._en : (I18N[lang][key] != null ? I18N[lang][key] : el._en);
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        var v = lang === "en" ? el._enAttr[p[0]] : (I18N[lang][p[1]] != null ? I18N[lang][p[1]] : el._enAttr[p[0]]);
        el.setAttribute(p[0], v);
      });
    });
    doc.lang = LOCALES[lang].slice(0, 2) === "pt" ? "pt-BR" : lang;
    document.title = t("meta.title");
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
  }

  /* ================= WhatsApp ================= */
  function waLink(message) {
    return "https://wa.me/" + S.contact.whatsapp + "?text=" + encodeURIComponent(message);
  }
  var mentorCta = $("#mentor-cta");
  if (S.mentoring && S.mentoring.url) {
    mentorCta.removeAttribute("data-wa");
    mentorCta.href = S.mentoring.url;
    mentorCta.target = "_blank";
    mentorCta.rel = "noopener";
  }
  function applyWhatsApp() {
    $$("[data-wa]").forEach(function (a) {
      a.href = waLink(t(a.getAttribute("data-wa")));
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ================= Luz de palco ================= */
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

  /* ================= Cabeçalho ================= */
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

  /* ================= Menu no celular ================= */
  var menu = $("#menu");
  var toggle = $(".menu-toggle");
  var toggleLabel = $(".menu-toggle-label");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggleLabel.textContent = t(open ? "menu.close" : "menu.open");
    doc.classList.toggle("menu-open", open);
    if (open) header.classList.remove("is-hidden");
  }
  toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  $$(".menu-links a, .menu-foot a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  /* ================= Palavras gigantes ================= */
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
    var g = fitWidth(giant, doc.clientWidth * 0.96);
    if (g) doc.style.setProperty("--giant", g.toFixed(1) + "px");
    var box = contactTitle.parentElement;
    var inner = box.getBoundingClientRect().width - parseFloat(getComputedStyle(box).paddingLeft) * 2;
    var c = fitWidth(contactTitle, inner * 0.86);
    if (c) contactTitle.style.setProperty("--fit", Math.min(c, 320).toFixed(1) + "px");
  }
  window.addEventListener("resize", debounce(fitAll, 150));

  /* ================= Faixa de palcos ================= */
  var seen = {};
  var stages = S.events.filter(function (e) { return !e.isLocation; })
    .concat(S.extraStages || [])
    .filter(function (e) { if (seen[e.name]) return false; seen[e.name] = true; return true; });
  var ticker = $("#ticker");
  ticker.innerHTML =
    stages.map(function (e) { return "<li>" + esc(e.name) + "</li>"; }).join("") +
    stages.map(function (e) { return '<li aria-hidden="true">' + esc(e.name) + "</li>"; }).join("");
  ticker.style.setProperty("--ticker-duration", Math.max(40, stages.length * 4.5) + "s");

  /* ================= Formas de aprender ================= */
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
    $(".offer-toggle", o).addEventListener("click", function () { setOffer(o.classList.contains("is-open") ? null : o); });
    o.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") showMedia(Number(o.getAttribute("data-media"))); });
  });
  $("#offers").addEventListener("pointerleave", function () {
    var open = offers.filter(function (o) { return o.classList.contains("is-open"); })[0];
    if (open) showMedia(Number(open.getAttribute("data-media")));
  });
  setOffer(offers[0]);

  /* ================= Cursos ================= */
  var productsList = $("#products");
  function renderProducts() {
    productsList.innerHTML = (S.products || []).map(function (p) {
      return '<li class="product">' +
        '<a class="product-img" href="' + esc(p.url) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="' + esc(p.image) + '" alt="" loading="lazy" decoding="async"></a>' +
        '<div class="product-body">' +
          '<p class="product-tag">' + esc(loc(p.tag)) + "</p>" +
          '<h3 class="product-title">' + esc(p.title) + "</h3>" +
          '<p class="product-text">' + esc(loc(p.description)) + "</p>" +
          '<div class="product-foot">' +
            '<p class="product-price">' + esc(p.price) + "<span>" + esc(t("courses.once")) + "</span></p>" +
            '<a class="btn btn-sm" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(t("courses.view")) + "</a>" +
          "</div>" +
        "</div>" +
      "</li>";
    }).join("");
  }

  /* ================= O que fazemos ================= */
  var panels = $$(".panel");
  function activatePanel(p) { panels.forEach(function (x) { x.classList.toggle("is-active", x === p); }); }
  panels.forEach(function (p) {
    p.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") activatePanel(p); });
    p.addEventListener("focus", function () { activatePanel(p); });
    p.addEventListener("click", function () { activatePanel(p); });
  });

  /* ================= Calendário ================= */
  function parse(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2] || 1); }
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function monthShort(d) {
    return new Intl.DateTimeFormat(LOCALES[lang], { month: "short" }).format(d).replace(".", "");
  }
  function monthLong(d) {
    var s = new Intl.DateTimeFormat(LOCALES[lang], { month: "long" }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function rangeLabel(a, b) {
    var sameMonth = a.getMonth() === b.getMonth();
    if (lang === "en") {
      return monthShort(a) + " " + a.getDate() + "–" + (sameMonth ? "" : monthShort(b) + " ") + b.getDate();
    }
    return sameMonth
      ? a.getDate() + "–" + b.getDate() + " " + monthShort(b)
      : a.getDate() + " " + monthShort(a) + "–" + b.getDate() + " " + monthShort(b);
  }

  var events = S.events.slice().sort(function (a, b) { return parse(a.startDate) - parse(b.startDate); });
  var months = [];
  (function buildMonths() {
    var from = parse(S.calendar.from + "-01");
    var to = parse(S.calendar.to + "-01");
    for (var d = new Date(from); d <= to; d.setMonth(d.getMonth() + 1)) {
      var weekends = [];
      var f = new Date(d.getFullYear(), d.getMonth(), 1);
      while (f.getDay() !== 5) f.setDate(f.getDate() + 1);
      for (; f.getMonth() === d.getMonth(); f.setDate(f.getDate() + 7)) {
        var fri = new Date(f);
        var sun = new Date(f); sun.setDate(sun.getDate() + 2);
        weekends.push({
          fri: fri, sun: sun,
          past: sun < today,
          events: events.filter(function (e) { return parse(e.startDate) <= sun && parse(e.endDate) >= fri; })
        });
      }
      months.push({ date: new Date(d), key: d.getFullYear() + "-" + (d.getMonth() + 1), weekends: weekends });
    }
  })();

  var monthsEl = $("#months");
  var indexEl = $("#cal-index");
  var nextStopEl = $("#next-stop");

  function eventHtml(e) {
    var range = rangeLabel(parse(e.startDate), parse(e.endDate));
    var links = "";
    if (e.link) links += '<a href="' + esc(e.link) + '" target="_blank" rel="noopener">' + esc(t("cal.site")) + "</a>";
    if (e.instagram) links += '<a href="' + esc(e.instagram) + '" target="_blank" rel="noopener">' + esc(t("cal.instagram")) + "</a>";
    var more = links
      ? '<details class="wk-more"><summary>' + esc(t("cal.more")) + '</summary><div class="wk-more-links">' + links + "</div></details>"
      : "";
    var past = parse(e.endDate) < today;
    var where = e.name + (e.location ? " (" + e.location + ")" : "");
    var privateLink = past ? "" :
      '<a class="wk-private" href="' + esc(waLink(t("wa.privateAt", { event: where, date: range + (lang === "en" ? ", " : " ") + parse(e.endDate).getFullYear() }))) + '" target="_blank" rel="noopener">' + esc(t("cal.bookPrivate")) + "</a>";
    return '<div class="wk-event">' +
      '<p class="wk-name">' + esc(e.name) + "</p>" +
      (e.location ? '<p class="wk-place">' + esc(e.location) + "</p>" : "") +
      '<p class="wk-meta"><span class="wk-who">' + esc(t("who." + e.instructor)) + "</span>" +
      '<span class="wk-range">' + range + "</span></p>" +
      (privateLink || more ? '<div class="wk-actions">' + privateLink + more + "</div>" : "") +
      "</div>";
  }

  function renderCalendar() {
    var scrollLeft = monthsEl.scrollLeft;
    monthsEl.innerHTML = months.map(function (m) {
      var booked = m.weekends.filter(function (w) { return w.events.length; }).length;
      var rows = m.weekends.map(function (w) {
        var date = '<p class="wk-date">' + rangeLabel(w.fri, w.sun) + "</p>";
        if (w.events.length) {
          return '<li class="wk is-booked' + (w.past ? " is-past" : "") + '">' + date + '<div class="wk-body">' + w.events.map(eventHtml).join("") + "</div></li>";
        }
        if (w.past) return '<li class="wk is-past">' + date + '<div class="wk-body"><p class="wk-open">—</p></div></li>';
        var dateText = rangeLabel(w.fri, w.sun) + " " + w.sun.getFullYear();
        return '<li class="wk is-open">' + date + '<div class="wk-body"><p class="wk-open">' + esc(t("cal.open")) + "</p>" +
          '<a class="wk-invite" href="' + esc(waLink(t("wa.weekend", { date: dateText }))) + '" target="_blank" rel="noopener">' + esc(t("cal.invite")) + "</a></div></li>";
      }).join("");
      return '<article class="month" data-key="' + m.key + '">' +
        '<header class="month-head"><h3 class="month-name">' + monthLong(m.date) + '</h3><span class="month-year">' + m.date.getFullYear() + "</span></header>" +
        '<p class="month-count">' + esc(booked ? t("cal.count", { n: booked, t: m.weekends.length }) : t("cal.countNone")) + "</p>" +
        '<ol class="weekends">' + rows + "</ol>" +
        "</article>";
    }).join("");

    indexEl.innerHTML = months.map(function (m, i) {
      var y = m.date.getFullYear();
      var showYear = i === 0 || m.date.getMonth() === 0;
      var busy = m.weekends.some(function (w) { return w.events.length; });
      return '<button type="button" class="cal-chip' + (busy ? " has-events" : "") + '" data-i="' + i + '" aria-label="' + esc(monthLong(m.date) + " " + y) + '">' +
        esc(monthShort(m.date)) + (showYear ? "<small>" + String(y).slice(2) + "</small>" : "") + "</button>";
    }).join("");

    var next = events.filter(function (e) { return parse(e.endDate) >= today; })[0];
    if (next) {
      nextStopEl.hidden = false;
      nextStopEl.innerHTML = '<span class="next-label">' + esc(t("cal.nextStop")) + "</span>" +
        '<button type="button" class="next-event" data-month="' + parse(next.startDate).getFullYear() + "-" + (parse(next.startDate).getMonth() + 1) + '">' +
        "<strong>" + esc(next.name) + "</strong>" +
        (next.location ? "<span>" + esc(next.location) + "</span>" : "") +
        "<span>" + rangeLabel(parse(next.startDate), parse(next.endDate)) + "</span></button>";
    } else {
      nextStopEl.hidden = true;
    }
    monthsEl.scrollLeft = scrollLeft;
    updateActiveChip();
  }

  function cards() { return $$(".month", monthsEl); }
  function scrollToMonth(i) {
    var card = cards()[i];
    if (!card) return;
    var pad = parseFloat(getComputedStyle(monthsEl).scrollPaddingLeft) || 0;
    monthsEl.scrollTo({ left: card.offsetLeft - pad, behavior: reduceMotion.matches ? "auto" : "smooth" });
  }
  function activeIndex() {
    var list = cards();
    var left = monthsEl.getBoundingClientRect().left + (parseFloat(getComputedStyle(monthsEl).scrollPaddingLeft) || 0);
    for (var i = 0; i < list.length; i++) {
      if (list[i].getBoundingClientRect().right > left + 40) return i;
    }
    return 0;
  }
  function updateActiveChip() {
    var i = activeIndex();
    $$(".cal-chip", indexEl).forEach(function (c, j) {
      if (j === i) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current");
    });
  }
  indexEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".cal-chip");
    if (chip) scrollToMonth(Number(chip.getAttribute("data-i")));
  });
  $$(".cal-arrow").forEach(function (b) {
    b.addEventListener("click", function () {
      scrollToMonth(Math.max(0, Math.min(months.length - 1, activeIndex() + Number(b.getAttribute("data-dir")))));
    });
  });
  nextStopEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".next-event");
    if (!btn) return;
    var key = btn.getAttribute("data-month");
    var i = months.findIndex(function (m) { return m.key === key; });
    if (i >= 0) scrollToMonth(i);
  });
  var calTicking = false;
  monthsEl.addEventListener("scroll", function () {
    if (!calTicking) { calTicking = true; requestAnimationFrame(function () { updateActiveChip(); calTicking = false; }); }
  }, { passive: true });

  /* ================= Vídeos ================= */
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
        '<button class="player-play" type="button" aria-label="' + esc(t("video.playLabel", { title: v.title })) + '"><span>' + PLAY_ICON + esc(t("video.play")) + "</span></button>";
    player.innerHTML =
      '<div class="player-frame">' + frame + "</div>" +
      '<div class="player-caption"><h3>' + esc(v.title) + "</h3><p>" + esc(loc(v.description)) + "</p></div>";
    var img = $(".player-frame img", player);
    if (img) {
      var fallback = function () { if (img.src.indexOf("hqdefault") === -1) img.src = thumb(v.id, "hqdefault"); };
      img.addEventListener("error", fallback);
      img.addEventListener("load", function () { if (img.naturalWidth <= 120) fallback(); });
    }
  }
  function updatePlayerText() {
    var v = S.videos[current];
    var p = $(".player-caption p", player);
    if (p) p.textContent = loc(v.description);
    var btn = $(".player-play", player);
    if (btn) {
      btn.setAttribute("aria-label", t("video.playLabel", { title: v.title }));
      btn.querySelector("span").innerHTML = PLAY_ICON + esc(t("video.play"));
    }
  }
  function renderPlaylist() {
    playlist.innerHTML = S.videos.map(function (v, i) {
      return '<li><button type="button" data-i="' + i + '" aria-current="' + (i === current) + '">' +
        '<img src="' + thumb(v.id, "mqdefault") + '" alt="" loading="lazy" decoding="async">' +
        "<div><strong>" + esc(v.title) + "</strong><span>" + esc(loc(v.description)) + "</span></div>" +
        "</button></li>";
    }).join("");
  }
  function selectVideo(i, autoplay) {
    current = i;
    $$("button", playlist).forEach(function (b, j) { b.setAttribute("aria-current", String(j === i)); });
    renderPlayer(i, autoplay);
  }
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

  /* ================= Troca de idioma ================= */
  function setLang(next, save) {
    lang = next;
    applyStaticText();
    applyWhatsApp();
    toggleLabel.textContent = t(menu.classList.contains("is-open") ? "menu.close" : "menu.open");
    renderProducts();
    renderCalendar();
    renderPlaylist();
    updatePlayerText();
    fitAll();
    if (save) { try { localStorage.setItem("lz-lang", next); } catch (e) { /* ignora */ } }
  }
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = b.getAttribute("data-lang");
      if (next === lang) return;
      var run = function () { setLang(next, true); };
      if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(run);
      else run();
    });
  });

  /* ================= Início ================= */
  renderPlaylist();
  renderPlayer(0, false);
  setLang(lang, false);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fitAll);

  // Calendário começa no mês atual (ou no primeiro mês da lista)
  var startIndex = months.findIndex(function (m) {
    return m.date.getFullYear() === today.getFullYear() && m.date.getMonth() === today.getMonth();
  });
  if (startIndex > 0) requestAnimationFrame(function () { monthsEl.scrollLeft = cards()[startIndex].offsetLeft - (parseFloat(getComputedStyle(monthsEl).scrollPaddingLeft) || 0); updateActiveChip(); });
})();
