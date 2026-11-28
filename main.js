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
  // Transição interrompida (ex.: rolagem no meio) não deve virar erro no console
  var quiet = function (vt) { var noop = function () {}; vt.ready.catch(noop); vt.finished.catch(noop); vt.updateCallbackDone.catch(noop); };

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

  /* ================= Sobre: história na horizontal ================= */
  // No computador a seção trava e a rolagem vertical move os capítulos para o lado.
  var story = $("#story");
  var track = $("#story-track");
  var storyBar = $("#story-bar");
  var chapters = $$(".chapter", track);
  var pinMQ = window.matchMedia("(min-width: 801px) and (min-height: 520px)");
  var st = { on: false, dist: 0, cur: 0, raf: 0, items: [] };

  function storyApply(p) {
    var x = -p * st.dist;
    var vw = window.innerWidth;
    track.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
    storyBar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    st.items.forEach(function (it) {
      var off = (it.c + x - vw / 2) / vw;
      if (off < -1.4 || off > 1.4) return;
      if (it.img) it.img.style.transform = "translate3d(" + (off * -48).toFixed(1) + "px,0,0) scale(1.14)";
      if (it.mark) it.mark.style.transform = "translate3d(" + (off * 140).toFixed(1) + "px,0,0)";
    });
  }
  function storyTarget() {
    var r = story.getBoundingClientRect();
    return st.dist ? Math.min(1, Math.max(0, -r.top / st.dist)) : 0;
  }
  function storyFrame() {
    var target = storyTarget();
    st.cur += (target - st.cur) * 0.16;
    if (Math.abs(target - st.cur) * st.dist < 0.4) st.cur = target;
    storyApply(st.cur);
    st.raf = st.cur !== target ? requestAnimationFrame(storyFrame) : 0;
  }
  function measureStory() {
    var should = pinMQ.matches && !reduceMotion.matches;
    story.classList.toggle("is-pinned", should);
    st.on = should;
    if (!should) {
      story.style.height = "";
      track.style.transform = "";
      st.items.forEach(function (it) {
        if (it.img) it.img.style.transform = "";
        if (it.mark) it.mark.style.transform = "";
      });
      return;
    }
    var last = chapters[chapters.length - 1];
    st.dist = Math.max(0, last.offsetLeft + last.offsetWidth / 2 - track.parentNode.clientWidth / 2);
    story.style.height = (st.dist + window.innerHeight) + "px";
    st.items = chapters.map(function (c) {
      return { c: c.offsetLeft + c.offsetWidth / 2, img: $(".chapter-photo img", c), mark: $(".chapter-mark", c) };
    });
    st.cur = storyTarget();
    storyApply(st.cur);
  }
  window.addEventListener("scroll", function () {
    if (st.on && !st.raf) st.raf = requestAnimationFrame(storyFrame);
  }, { passive: true });
  window.addEventListener("resize", debounce(measureStory, 150));
  pinMQ.addEventListener("change", measureStory);
  reduceMotion.addEventListener("change", measureStory);

  /* ================= O que fazemos: foto que segue o mouse ================= */
  var workEl = $("#work");
  var skillsEl = $("#skills");
  var skills = $$(".skill", skillsEl);
  var floatEl = $("#skill-float");
  var floatImgs = $$("img", floatEl);
  var hoverMQ = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 801px)");
  var fl = { on: false, mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0, raf: 0, fresh: true };

  function setSkill(el) {
    skills.forEach(function (s) { s.classList.toggle("is-active", s === el); });
    var i = el ? Number(el.getAttribute("data-img")) : -1;
    floatImgs.forEach(function (img, j) { img.classList.toggle("is-active", j === i); });
  }
  function floatFrame() {
    var r = workEl.getBoundingClientRect();
    var tx = fl.mx - r.left;
    var ty = fl.my - r.top;
    if (fl.fresh) { fl.x = tx; fl.y = ty; fl.fresh = false; }
    var dx = tx - fl.x;
    fl.x += dx * 0.15;
    fl.y += (ty - fl.y) * 0.15;
    var rot = Math.max(-9, Math.min(9, dx * 0.05));
    floatEl.style.transform = "translate3d(" + (fl.x - fl.w / 2).toFixed(1) + "px," + (fl.y - fl.h / 2).toFixed(1) + "px,0) rotate(" + rot.toFixed(2) + "deg)";
    var moving = Math.abs(dx) > 0.3 || Math.abs(ty - fl.y) > 0.3;
    fl.raf = (fl.on || moving) ? requestAnimationFrame(floatFrame) : 0;
  }
  skills.forEach(function (s) {
    s.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse" || !hoverMQ.matches) return;
      setSkill(s);
    });
    s.addEventListener("focus", function () { setSkill(s); });
    s.addEventListener("blur", function () { if (!skillsEl.classList.contains("is-hovering")) setSkill(null); });
  });
  skillsEl.addEventListener("pointerenter", function (e) {
    if (e.pointerType !== "mouse" || !hoverMQ.matches) return;
    fl.on = true;
    fl.fresh = !floatEl.classList.contains("is-visible");
    fl.w = floatEl.offsetWidth;
    fl.h = floatEl.offsetHeight;
    fl.mx = e.clientX; fl.my = e.clientY;
    skillsEl.classList.add("is-hovering");
    floatEl.classList.add("is-visible");
    if (!fl.raf) fl.raf = requestAnimationFrame(floatFrame);
  });
  skillsEl.addEventListener("pointermove", function (e) {
    if (!fl.on) return;
    fl.mx = e.clientX; fl.my = e.clientY;
    if (!fl.raf) fl.raf = requestAnimationFrame(floatFrame);
  });
  skillsEl.addEventListener("pointerleave", function () {
    if (!fl.on) return;
    fl.on = false;
    skillsEl.classList.remove("is-hovering");
    floatEl.classList.remove("is-visible");
    setSkill(null);
  });
  window.addEventListener("scroll", function () {
    if (fl.on && !fl.raf) fl.raf = requestAnimationFrame(floatFrame);
  }, { passive: true });

  /* ================= Mapa da turnê ================= */
  var mapEl = $("#tour-map");
  var mapSvg = $("#tour-map-svg");
  var mapCard = $("#tour-map-card");
  var mapCanvas = $(".tour-map-canvas", mapEl);
  var SVGNS = "http://www.w3.org/2000/svg";
  var mapPins = {};
  var openPin = null;

  function project(place) {
    var c = S.places && S.places[place];
    if (!c) return null;
    return { x: (c[1] + 180) / 360 * 1000, y: (78 - c[0]) / 134 * 372 };
  }
  function arc(a, b) {
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var dx = b.x - a.x, dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var bend = Math.min(160, len * 0.28);
    return " Q" + (mx + dy / len * bend).toFixed(1) + " " + (my - dx / len * bend).toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
  }
  function rangeYear(e) {
    return rangeLabel(parse(e.startDate), parse(e.endDate)) + (lang === "en" ? ", " : " ") + parse(e.endDate).getFullYear();
  }

  function renderMap() {
    var home = S.home;
    var homePt = project(home);
    var upcoming = events.filter(function (e) { return parse(e.endDate) >= today && project(e.location); });
    var pastByPlace = {};
    var pastOrder = [];
    events.filter(function (e) { return !e.isLocation && parse(e.endDate) < today; })
      .concat(S.extraStages || [])
      .forEach(function (e) {
        if (!project(e.location)) return;
        if (!pastByPlace[e.location]) { pastByPlace[e.location] = []; pastOrder.push(e.location); }
        if (pastByPlace[e.location].indexOf(e.name) === -1) pastByPlace[e.location].push(e.name);
      });
    var upPlaces = upcoming.map(function (e) { return e.location; });

    mapPins = {};
    var html = "";
    var n = Math.max(1, upcoming.length);

    // Rota: de casa até cada próximo evento, em ordem
    if (homePt && upcoming.length) {
      var d = "M" + homePt.x.toFixed(1) + " " + homePt.y.toFixed(1);
      var prev = homePt;
      upcoming.forEach(function (e) { var p = project(e.location); d += arc(prev, p); prev = p; });
      html += '<path class="route-line" pathLength="1" d="' + d + '"/>';
      if (!reduceMotion.matches) {
        html += '<circle class="route-traveller" r="3.5" opacity="0"><animateMotion dur="' + (3.2 * n) + 's" repeatCount="indefinite" begin="indefinite" path="' + d + '"/></circle>';
      }
    }

    function pin(key, pt, cls, label, labelLeft, delay, ring) {
      mapPins[key] = { label: label };
      return '<g class="pin" tabindex="0" role="button" data-key="' + esc(key) + '" aria-label="' + esc(label) + '" style="--x:' + pt.x.toFixed(1) + "px;--y:" + pt.y.toFixed(1) + "px;--d:" + delay.toFixed(2) + 's">' +
        '<circle class="pin-hit" r="13"/>' +
        (ring ? '<circle class="pin-ring" r="7"/>' : "") +
        '<circle class="pin-dot ' + cls + '" r="' + (cls === "pin-past" ? 4.5 : 6) + '"/>' +
        (labelLeft == null ? "" : '<text class="pin-label' + (labelLeft ? " pin-label--left" : "") + '" x="' + (labelLeft ? -12 : 12) + '" y="4.5">' + esc(labelLeft ? label.split(",")[0] : label.split(",")[0]) + "</text>") +
        "</g>";
    }

    pastOrder.forEach(function (place, i) {
      if (place === home || upPlaces.indexOf(place) !== -1) return;
      html += pin("past:" + place, project(place), "pin-past", place, null, 0.2 + i * 0.05, false);
    });
    if (homePt) html += pin("home", homePt, "pin-home", home, true, 0.1, false);
    upcoming.forEach(function (e, i) {
      var key = "next:" + i;
      html += pin(key, project(e.location), "pin-next", e.location, false, 0.4 + (i + 1) / n * 2.2, true);
      mapPins[key].event = e;
    });
    Object.keys(mapPins).forEach(function (k) {
      if (k.indexOf("past:") === 0) mapPins[k].names = pastByPlace[k.slice(5)];
    });
    mapPins.home && (mapPins.home.names = pastByPlace[home] || []);

    mapSvg.innerHTML = html;
    scaleMap();
    if (mapEl.classList.contains("is-drawn")) startTraveller();
    if (openPin && mapPins[openPin]) showCard(openPin); else closeCard();
  }

  function scaleMap() {
    var w = mapSvg.getBoundingClientRect().width;
    if (w) mapSvg.style.setProperty("--k", (1000 / w).toFixed(3));
  }
  function startTraveller() {
    var anim = $("animateMotion", mapSvg);
    if (!anim || typeof anim.beginElement !== "function") return;
    var dot = anim.parentNode;
    setTimeout(function () { dot.setAttribute("opacity", "1"); anim.beginElement(); }, 2400);
  }

  function cardHtml(key) {
    var p = mapPins[key];
    var close = '<button class="tour-map-close" type="button" aria-label="' + esc(t("map.close")) + '">×</button>';
    if (p.event) {
      var e = p.event;
      var where = e.name + (e.location ? " (" + e.location + ")" : "");
      var links = "";
      if (e.link) links += '<a href="' + esc(e.link) + '" target="_blank" rel="noopener">' + esc(t("cal.site")) + "</a>";
      if (e.instagram) links += '<a href="' + esc(e.instagram) + '" target="_blank" rel="noopener">' + esc(t("cal.instagram")) + "</a>";
      return close + '<p class="card-kicker">' + esc(t("map.next")) + "</p>" +
        "<h4>" + esc(e.name) + "</h4>" +
        "<p>" + esc(e.location) + " · " + esc(rangeYear(e)) + "</p>" +
        '<div class="wk-actions"><a class="wk-private" href="' + esc(waLink(t("wa.privateAt", { event: where, date: rangeYear(e) }))) + '" target="_blank" rel="noopener">' + esc(t("cal.bookPrivate")) + "</a></div>" +
        (links ? '<div class="wk-links">' + links + "</div>" : "");
    }
    var list = (p.names || []).map(function (nm) { return "<li>" + esc(nm) + "</li>"; }).join("");
    if (key === "home") {
      return close + '<p class="card-kicker">' + esc(t("map.home")) + "</p>" +
        "<h4>" + esc(p.label) + "</h4><p>" + esc(t("map.homeCard")) + "</p>" + (list ? "<ul>" + list + "</ul>" : "");
    }
    return close + '<p class="card-kicker">' + esc(t("map.pastCard")) + "</p>" +
      "<h4>" + esc(p.label) + "</h4>" + (list ? "<ul>" + list + "</ul>" : "");
  }

  function showCard(key) {
    var p = mapPins[key];
    if (!p) return;
    openPin = key;
    $$(".pin", mapSvg).forEach(function (g) { g.classList.toggle("is-active", g.getAttribute("data-key") === key); });
    mapCard.innerHTML = cardHtml(key);
    mapCard.setAttribute("aria-label", p.event ? p.event.name : p.label);
    mapCard.hidden = false;
    mapCard.classList.remove("below");
    if (getComputedStyle(mapCard).position !== "absolute") return;
    var g = $('.pin[data-key="' + key.replace(/"/g, '\\"') + '"]', mapSvg);
    var cr = mapCanvas.getBoundingClientRect();
    var mr = mapEl.getBoundingClientRect();
    var pr = g.querySelector(".pin-dot").getBoundingClientRect();
    var px = pr.left + pr.width / 2 - mr.left;
    var py = pr.top + pr.height / 2 - mr.top;
    var cw = mapCard.offsetWidth;
    var ch = mapCard.offsetHeight;
    var left = Math.max(cw / 2 + 8, Math.min(cr.width - cw / 2 - 8, px));
    mapCard.style.left = left + "px";
    mapCard.style.top = py + "px";
    if (py - (cr.top - mr.top) < ch + 26) mapCard.classList.add("below");
  }
  function closeCard() {
    openPin = null;
    mapCard.hidden = true;
    $$(".pin.is-active", mapSvg).forEach(function (g) { g.classList.remove("is-active"); });
  }
  mapSvg.addEventListener("click", function (e) {
    var g = e.target.closest(".pin");
    if (!g) return;
    var key = g.getAttribute("data-key");
    if (openPin === key) closeCard(); else showCard(key);
  });
  mapSvg.addEventListener("keydown", function (e) {
    var g = e.target.closest(".pin");
    if (!g || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    showCard(g.getAttribute("data-key"));
    var btn = $(".tour-map-close", mapCard);
    if (btn) btn.focus();
  });
  mapCard.addEventListener("click", function (e) {
    if (!e.target.closest(".tour-map-close")) return;
    var key = openPin;
    closeCard();
    var g = key && $('.pin[data-key="' + key.replace(/"/g, '\\"') + '"]', mapSvg);
    if (g && e.detail === 0) g.focus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openPin) closeCard();
  });
  document.addEventListener("click", function (e) {
    if (openPin && !e.target.closest(".pin") && !e.target.closest("#tour-map-card")) closeCard();
  });
  window.addEventListener("resize", debounce(function () {
    scaleMap();
    if (openPin) showCard(openPin);
  }, 150));

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var mapObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      mapEl.classList.add("is-drawn");
      startTraveller();
      mapObserver.disconnect();
    }, { threshold: 0.35 });
    mapObserver.observe(mapEl);
  } else {
    mapEl.classList.add("is-drawn");
  }

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
    if (document.startViewTransition && !reduceMotion.matches) quiet(document.startViewTransition(swap));
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
    renderMap();
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
      if (document.startViewTransition && !reduceMotion.matches) quiet(document.startViewTransition(run));
      else run();
    });
  });

  /* ================= Início ================= */
  renderPlaylist();
  renderPlayer(0, false);
  setLang(lang, false);
  measureStory();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { fitAll(); measureStory(); });

  // Calendário começa no mês atual (ou no primeiro mês da lista)
  var startIndex = months.findIndex(function (m) {
    return m.date.getFullYear() === today.getFullYear() && m.date.getMonth() === today.getMonth();
  });
  if (startIndex > 0) requestAnimationFrame(function () { monthsEl.scrollLeft = cards()[startIndex].offsetLeft - (parseFloat(getComputedStyle(monthsEl).scrollPaddingLeft) || 0); updateActiveChip(); });
})();
