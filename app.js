const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

async function runTypewriters() {
  const heroLines = [...document.querySelectorAll(".hero .type-line")];
  for (const line of heroLines) {
    await typeText(line, line.dataset.type || "");
  }

  const cta = document.querySelector(".cta-section .type-line");
  const observer = new IntersectionObserver(
    async (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      await typeText(cta, cta.dataset.type || "", 50);
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
  bindLeadForm();
  bindNavHighlight();
  bindTopicOverlay();
});
