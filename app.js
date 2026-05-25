const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function typeText(el, text, speed = 58) {
  if (!el) return Promise.resolve();
  if (prefersReducedMotion) {
    el.textContent = text;
    return Promise.resolve();
  }
  el.textContent = "";
  el.classList.add("typing");
  return new Promise((resolve) => {
    let index = 0;
    const timer = window.setInterval(() => {
      el.textContent += text[index] || "";
      index += 1;
      if (index > text.length) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          el.classList.remove("typing");
          resolve();
        }, 520);
      }
    }, speed);
  });
}

function eraseText(el, speed = 34) {
  if (!el || prefersReducedMotion) return Promise.resolve();
  el.classList.add("typing");
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (!el.textContent) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          el.classList.remove("typing");
          resolve();
        }, 160);
      }
    }, speed);
  });
}

async function loopTypewriter(lines, options = {}) {
  const items = lines.filter(Boolean).map((line) => ({
    el: line,
    text: line.dataset.type || line.textContent || ""
  }));
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach(({ el, text }) => {
      el.textContent = text;
    });
    return;
  }

  const typeSpeed = options.typeSpeed || 58;
  const eraseSpeed = options.eraseSpeed || 34;
  const hold = options.hold || 1800;
  const restartPause = options.restartPause || 420;

  while (true) {
    for (const { el, text } of items) {
      await typeText(el, text, typeSpeed);
      await wait(170);
    }
    await wait(hold);
    for (const { el } of [...items].reverse()) {
      await eraseText(el, eraseSpeed);
    }
    await wait(restartPause);
  }
}

async function runTypewriters() {
  const heroLines = [...document.querySelectorAll(".hero .type-line")];
  loopTypewriter(heroLines, { typeSpeed: 58, eraseSpeed: 32, hold: 1900 });

  const cta = document.querySelector(".cta-section .type-line");
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loopTypewriter([cta], { typeSpeed: 50, eraseSpeed: 30, hold: 1800 });
    },
    { threshold: 0.45 }
  );
  if (cta) observer.observe(cta);
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const duration = 1100;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = value.toLocaleString("zh-CN");
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((counter) => observer.observe(counter));
}

function bindNewsTabs() {
  const tabs = document.querySelectorAll("[data-news]");
  const items = document.querySelectorAll("[data-kind]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const kind = tab.dataset.news;
      items.forEach((item) => {
        const visible = kind === "all" || item.dataset.kind === kind;
        item.classList.toggle("fade-out", !visible);
      });
    });
  });
}

function bindFilterChips() {
  document.querySelectorAll(".chip, .tabs.small .tab").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.parentElement;
      group.querySelectorAll(".chip, .tab").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}

const heatmapTrainingData = {
  "全部": {
    "广东": 5281,
    "浙江": 4126,
    "重庆": 3562,
    "江苏": 2987,
    "山东": 2104,
    "北京": 1865,
    "上海": 1742,
    "四川": 1530,
    "河南": 1396,
    "湖北": 1268,
    "福建": 1182,
    "湖南": 1045,
    "安徽": 926,
    "陕西": 820,
    "河北": 764,
    "江西": 692,
    "广西": 608,
    "天津": 536
  },
  "2026年": {
    "广东": 1962,
    "浙江": 1588,
    "重庆": 1426,
    "江苏": 1184,
    "山东": 802,
    "北京": 756,
    "上海": 690,
    "四川": 612,
    "河南": 548,
    "湖北": 486,
    "福建": 435,
    "湖南": 396,
    "安徽": 342,
    "陕西": 306,
    "河北": 284,
    "江西": 251,
    "广西": 218,
    "天津": 194
  },
  "2025年": {
    "广东": 1848,
    "浙江": 1395,
    "重庆": 1186,
    "江苏": 1012,
    "山东": 736,
    "北京": 618,
    "上海": 584,
    "四川": 512,
    "河南": 458,
    "湖北": 425,
    "福建": 388,
    "湖南": 341,
    "安徽": 306,
    "陕西": 270,
    "河北": 248,
    "江西": 225,
    "广西": 204,
    "天津": 176
  },
  "2024年": {
    "广东": 1471,
    "浙江": 1143,
    "重庆": 950,
    "江苏": 791,
    "山东": 566,
    "北京": 491,
    "上海": 468,
    "四川": 406,
    "河南": 390,
    "湖北": 357,
    "福建": 359,
    "湖南": 308,
    "安徽": 278,
    "陕西": 244,
    "河北": 232,
    "江西": 216,
    "广西": 186,
    "天津": 166
  }
};

function normalizeProvinceName(name) {
  return String(name || "")
    .replace(/特别行政区|维吾尔自治区|壮族自治区|回族自治区|自治区|省|市/g, "")
    .trim();
}

function getGeometryPoints(geometry) {
  const points = [];
  const walk = (coords) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      points.push(coords);
      return;
    }
    coords.forEach(walk);
  };
  walk(geometry?.coordinates);
  return points;
}

function interpolateColor(start, end, amount) {
  const from = start.match(/\w\w/g).map((value) => parseInt(value, 16));
  const to = end.match(/\w\w/g).map((value) => parseInt(value, 16));
  const mixed = from.map((value, index) => Math.round(value + (to[index] - value) * amount));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

const heatmapLabelOffsets = {
  "北京": [26, -24],
  "天津": [34, -4],
  "河北": [20, -30],
  "山东": [36, -4],
  "江苏": [28, -18],
  "上海": [31, 7],
  "浙江": [25, 14],
  "福建": [29, 18],
  "广东": [4, 24],
  "安徽": [22, -8],
  "湖北": [18, 8],
  "湖南": [-4, 24],
  "江西": [24, 10],
  "河南": [22, -9],
  "陕西": [-18, -14],
  "四川": [-28, -3],
  "重庆": [10, 14],
  "广西": [-8, 18]
};

function bindTrainingHeatmap() {
  const svg = document.querySelector(".china-heatmap");
  const tooltip = document.querySelector(".heatmap-tooltip");
  const rankCard = document.querySelector(".rank-card ol");
  const tabs = document.querySelectorAll(".map-panel .tabs.small .tab");
  const geo = window.CHINA_PROVINCES;
  if (!svg || !geo?.features?.length) return;

  const shell = svg.closest(".heatmap-shell");
  const width = Math.round(shell?.clientWidth || 730);
  const height = Math.round(shell?.clientHeight || 355);
  const padding = { top: 18, right: 18, bottom: 24, left: 18 };
  const allPoints = geo.features.flatMap((feature) => getGeometryPoints(feature.geometry));
  const bounds = allPoints.reduce(
    (acc, point) => ({
      minLng: Math.min(acc.minLng, point[0]),
      maxLng: Math.max(acc.maxLng, point[0]),
      minLat: Math.min(acc.minLat, point[1]),
      maxLat: Math.max(acc.maxLat, point[1])
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
  );
  const scale = Math.min(
    (width - padding.left - padding.right) / (bounds.maxLng - bounds.minLng),
    (height - padding.top - padding.bottom) / (bounds.maxLat - bounds.minLat)
  );
  const mapWidth = (bounds.maxLng - bounds.minLng) * scale;
  const mapHeight = (bounds.maxLat - bounds.minLat) * scale;
  const offsetX = (width - mapWidth) / 2;
  const offsetY = (height - mapHeight) / 2;
  const project = ([lng, lat]) => [
    offsetX + (lng - bounds.minLng) * scale,
    offsetY + (bounds.maxLat - lat) * scale
  ];

  const pathFromCoordinates = (geometry) => {
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    return polygons
      .map((polygon) =>
        polygon
          .map((ring) =>
            ring
              .map((point, index) => {
                const [x, y] = project(point);
                return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
              })
              .join(" ") + "Z"
          )
          .join(" ")
      )
      .join(" ");
  };

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <title id="heatmapTitle">全国省级培训热力图</title>
    <desc id="heatmapDesc">基于省级行政区围栏绘制，颜色越深表示参训教师数量越多。</desc>
    <defs>
      <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#d06700" flood-opacity="0.18" />
      </filter>
    </defs>
    <g class="heatmap-viewport">
      <g class="heatmap-layer" filter="url(#mapGlow)"></g>
      <g class="heatmap-label-layer"></g>
    </g>
  `;

  const viewport = svg.querySelector(".heatmap-viewport");
  const layer = svg.querySelector(".heatmap-layer");
  const labelLayer = svg.querySelector(".heatmap-label-layer");
  const featureByProvince = new Map();
  const zoomState = { scale: 1, x: 0, y: 0 };
  const zoomLimits = { min: 1, max: 4 };
  let dragStart = null;

  const applyZoom = () => {
    viewport?.setAttribute("transform", `translate(${zoomState.x.toFixed(1)} ${zoomState.y.toFixed(1)}) scale(${zoomState.scale.toFixed(3)})`);
  };

  const clampPan = () => {
    const minX = width - width * zoomState.scale;
    const minY = height - height * zoomState.scale;
    zoomState.x = Math.min(0, Math.max(minX, zoomState.x));
    zoomState.y = Math.min(0, Math.max(minY, zoomState.y));
  };

  const zoomAt = (nextScale, clientX = width / 2, clientY = height / 2) => {
    const previousScale = zoomState.scale;
    const clampedScale = Math.max(zoomLimits.min, Math.min(zoomLimits.max, nextScale));
    if (clampedScale === previousScale) return;

    const rect = svg.getBoundingClientRect();
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    const worldX = (pointerX - zoomState.x) / previousScale;
    const worldY = (pointerY - zoomState.y) / previousScale;
    zoomState.scale = clampedScale;
    zoomState.x = pointerX - worldX * clampedScale;
    zoomState.y = pointerY - worldY * clampedScale;
    clampPan();
    applyZoom();
  };

  const resetZoom = () => {
    zoomState.scale = 1;
    zoomState.x = 0;
    zoomState.y = 0;
    applyZoom();
  };

  const paths = geo.features.map((feature) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const fullName = feature.properties?.name || "";
    const shortName = normalizeProvinceName(fullName);
    featureByProvince.set(shortName, feature);
    path.setAttribute("d", pathFromCoordinates(feature.geometry));
    path.setAttribute("data-province", shortName);
    path.setAttribute("data-full-name", fullName);
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "img");
    path.setAttribute("aria-label", fullName);
    layer.append(path);
    return path;
  });

  const formatNumber = (value) => Number(value || 0).toLocaleString("zh-CN");

  const updateRanks = (dataset) => {
    if (!rankCard) return;
    const rows = Object.entries(dataset)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const max = rows[0]?.[1] || 1;
    rankCard.innerHTML = rows
      .map(([name, value]) => `<li><span>${name}</span><i style="--w: ${(value / max) * 100}%"></i><b>${formatNumber(value)}</b></li>`)
      .join("");
  };

  const createSvgElement = (tag, attrs = {}) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };

  const updateMapLabels = () => {
    if (!labelLayer) return;
    labelLayer.innerHTML = "";
    const labels = [...featureByProvince.entries()]
      .map(([name, feature]) => {
        const coordinate = feature?.properties?.centroid || feature?.properties?.center;
        if (!coordinate) return null;

        const [projectedX, projectedY] = project(coordinate);
        const [dx, dy] = heatmapLabelOffsets[name] || [0, 0];
        const offsetScale = width / 730;
        const x = Math.max(12, Math.min(width - 24, projectedX + dx * offsetScale * 0.45));
        const y = Math.max(12, Math.min(height - 12, projectedY + dy * offsetScale * 0.45));
        const labelWidth = Math.max(16, name.length * 8);
        const labelHeight = 10;

        return { name, x, y, labelWidth, labelHeight };
      })
      .filter(Boolean);

    for (let iteration = 0; iteration < 50; iteration += 1) {
      labels.forEach((label) => {
        label.x = Math.max(label.labelWidth / 2 + 2, Math.min(width - label.labelWidth / 2 - 2, label.x));
        label.y = Math.max(label.labelHeight / 2 + 2, Math.min(height - label.labelHeight / 2 - 2, label.y));
      });

      for (let i = 0; i < labels.length; i += 1) {
        for (let j = i + 1; j < labels.length; j += 1) {
          const a = labels[i];
          const b = labels[j];
          const dx = a.x - b.x || 0.1;
          const dy = a.y - b.y || 0.1;
          const overlapX = (a.labelWidth + b.labelWidth) / 2 + 2 - Math.abs(dx);
          const overlapY = (a.labelHeight + b.labelHeight) / 2 + 2 - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;

          if (overlapX < overlapY) {
            const push = (overlapX / 2) * Math.sign(dx);
            a.x += push;
            b.x -= push;
          } else {
            const push = (overlapY / 2) * Math.sign(dy);
            a.y += push;
            b.y -= push;
          }
        }
      }
    }

    labels.forEach(({ name, x, y }) => {
      const label = createSvgElement("text", {
        class: "heatmap-label",
        x: x.toFixed(1),
        y: y.toFixed(1),
        "text-anchor": "middle",
        "aria-label": name
      });
      label.textContent = name;
      labelLayer.append(label);
    });
  };

  const showTooltip = (event, path, dataset) => {
    if (!tooltip) return;
    const province = path.dataset.province || "";
    const value = dataset[province] || 0;
    tooltip.innerHTML = `<strong>${province}</strong><span>${value ? `${formatNumber(value)} 人` : "暂无数据"}</span>`;
    tooltip.classList.add("show");
    const shell = tooltip.closest(".heatmap-shell").getBoundingClientRect();
    tooltip.style.left = `${event.clientX - shell.left + 12}px`;
    tooltip.style.top = `${event.clientY - shell.top + 12}px`;
  };

  const render = (label = "全部") => {
    const dataset = heatmapTrainingData[label] || heatmapTrainingData["全部"];
    const values = Object.values(dataset);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);

    paths.forEach((path) => {
      const value = dataset[path.dataset.province] || 0;
      const ratio = value ? Math.max((value - min) / (max - min || 1), 0.12) : 0;
      path.style.fill = value ? interpolateColor("efdba0", "b53912", ratio) : "#f6efd7";
      path.style.stroke = value ? "#55a8ff" : "#b9d3f6";
      path.style.strokeWidth = value ? "1.05" : "0.8";
      path.setAttribute("aria-label", `${path.dataset.fullName}，参训教师 ${formatNumber(value)} 人`);
    });
    updateMapLabels();
    updateRanks(dataset);
  };

  paths.forEach((path) => {
    path.addEventListener("pointerenter", (event) => {
      const activeLabel = document.querySelector(".map-panel .tabs.small .tab.active")?.textContent.trim() || "全部";
      showTooltip(event, path, heatmapTrainingData[activeLabel] || heatmapTrainingData["全部"]);
    });
    path.addEventListener("pointermove", (event) => {
      const activeLabel = document.querySelector(".map-panel .tabs.small .tab.active")?.textContent.trim() || "全部";
      showTooltip(event, path, heatmapTrainingData[activeLabel] || heatmapTrainingData["全部"]);
    });
    path.addEventListener("pointerleave", () => tooltip?.classList.remove("show"));
    path.addEventListener("focus", (event) => {
      const activeLabel = document.querySelector(".map-panel .tabs.small .tab.active")?.textContent.trim() || "全部";
      const rect = path.getBoundingClientRect();
      showTooltip({ clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }, event.target, heatmapTrainingData[activeLabel] || heatmapTrainingData["全部"]);
    });
    path.addEventListener("blur", () => tooltip?.classList.remove("show"));
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => render(tab.textContent.trim()));
  });

  shell?.querySelectorAll("[data-map-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mapZoom;
      if (action === "reset") {
        resetZoom();
      } else {
        const direction = action === "in" ? 1.25 : 0.8;
        const rect = svg.getBoundingClientRect();
        zoomAt(zoomState.scale * direction, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
  });

  shell?.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const direction = event.deltaY < 0 ? 1.14 : 0.88;
      zoomAt(zoomState.scale * direction, event.clientX, event.clientY);
    },
    { passive: false }
  );

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || zoomState.scale <= 1) return;
    dragStart = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      x: zoomState.x,
      y: zoomState.y
    };
    shell?.classList.add("dragging");
    svg.setPointerCapture(event.pointerId);
    tooltip?.classList.remove("show");
  });

  svg.addEventListener("pointermove", (event) => {
    if (!dragStart) return;
    zoomState.x = dragStart.x + event.clientX - dragStart.clientX;
    zoomState.y = dragStart.y + event.clientY - dragStart.clientY;
    clampPan();
    applyZoom();
  });

  const endDrag = (event) => {
    if (!dragStart) return;
    if (event.pointerId === dragStart.pointerId && svg.hasPointerCapture(event.pointerId)) {
      svg.releasePointerCapture(event.pointerId);
    }
    dragStart = null;
    shell?.classList.remove("dragging");
  };

  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
  svg.addEventListener("lostpointercapture", () => {
    dragStart = null;
    shell?.classList.remove("dragging");
  });

  applyZoom();
  render();
}

function bindLeadForm() {
  const form = document.querySelector(".lead-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const button = form.querySelector("button");
    const oldText = button.textContent;
    if (!input.value.trim()) {
      input.focus();
      input.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 260 }
      );
      return;
    }
    button.textContent = "已提交";
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = oldText;
      button.disabled = false;
      input.value = "";
    }, 1600);
  });
}

function bindNavHighlight() {
  const links = [...document.querySelectorAll(".nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${active.target.id}`);
      });
    },
    { rootMargin: "-18% 0px -70% 0px", threshold: [0.1, 0.3, 0.6] }
  );
  sections.forEach((section) => observer.observe(section));
}

function bindTopicOverlay() {
  const switcher = document.querySelector(".topic-switch");
  const overlay = document.querySelector(".topic-overlay");
  const closeBtn = document.querySelector(".topic-close");
  const categories = document.querySelectorAll(".topic-cat");
  const audiences = document.querySelectorAll(".audience");
  const cards = document.querySelectorAll(".topic-card");
  const empty = document.querySelector(".topic-empty");
  if (!switcher || !overlay) return;

  let activeCat = "recommend";
  let activeAudience = "all";

  const openOverlay = () => {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    switcher.classList.add("is-open");
    switcher.setAttribute("aria-expanded", "true");
    document.body.classList.add("topic-locked");
  };

  const closeOverlay = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    switcher.classList.remove("is-open");
    switcher.setAttribute("aria-expanded", "false");
    document.body.classList.remove("topic-locked");
  };

  const applyFilters = () => {
    let visibleCount = 0;
    cards.forEach((card) => {
      const cats = (card.dataset.cats || "").split(/\s+/);
      const cardAudiences = (card.dataset.audience || "").split(/\s+/);
      const catMatched = activeCat === "recommend" ? cats.includes("recommend") : cats.includes(activeCat);
      const audienceMatched = activeAudience === "all" || cardAudiences.includes(activeAudience);
      const visible = catMatched && audienceMatched;
      card.classList.toggle("show", visible);
      if (visible) visibleCount += 1;
    });
    if (empty) empty.classList.toggle("show", visibleCount === 0);
  };

  switcher.addEventListener("click", () => {
    if (overlay.classList.contains("open")) {
      closeOverlay();
    } else {
      openOverlay();
      applyFilters();
    }
  });

  closeBtn?.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("open")) closeOverlay();
  });

  categories.forEach((cat) => {
    cat.addEventListener("click", () => {
      categories.forEach((item) => item.classList.remove("active"));
      cat.classList.add("active");
      activeCat = cat.dataset.topicCat || "recommend";
      applyFilters();
    });
  });

  audiences.forEach((audience) => {
    audience.addEventListener("click", () => {
      audiences.forEach((item) => item.classList.remove("active"));
      audience.classList.add("active");
      activeAudience = audience.dataset.audience || "all";
      applyFilters();
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  runTypewriters();
  animateCounters();
  bindNewsTabs();
  bindFilterChips();
  bindTrainingHeatmap();
  bindLeadForm();
  bindNavHighlight();
  bindTopicOverlay();
});
