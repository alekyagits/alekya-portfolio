"use strict";

// Mark that JS is running, so the scroll-reveal animation only hides content when it can show it again.
document.documentElement.classList.add("js");

// Apply the saved theme early to avoid a flash of the wrong colors.
const THEME_KEY = "alekya-theme";
const readTheme = () => {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
};
const saveTheme = (value) => {
  try { localStorage.setItem(THEME_KEY, value); } catch { /* storage blocked: ignore */ }
};
const initialTheme =
  readTheme() || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.dataset.theme = initialTheme;

document.addEventListener("DOMContentLoaded", () => {
  // ---- Theme toggle ----
  const themeBtn = document.querySelector(".theme-toggle");
  const syncThemeLabel = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };
  syncThemeLabel();
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    saveTheme(next);
    syncThemeLabel();
  });

  // ---- Mobile menu ----
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const menuLabel = menuBtn.querySelector(".visually-hidden");

  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("open", open);
    menuLabel.textContent = open ? "Close menu" : "Open menu";
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // ---- Header border on scroll ----
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Reveal sections as they scroll into view ----
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // After the entrance animation, switch to quick transitions so hover effects feel snappy.
            setTimeout(() => entry.target.classList.add("done"), 1300);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ---- Highlight the nav link for the section on screen ----
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll progress bar ----
  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ---- Typing effect: cycles through the words in data-words ----
  const typed = document.querySelector(".typed");
  if (typed && !reduceMotion) {
    const words = typed.dataset.words.split("|");
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    const tick = () => {
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1800; // pause on the full word
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  // ---- Count-up numbers in the stats strip ----
  const counters = document.querySelectorAll(".count");
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduceMotion && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      el.textContent = `0${el.dataset.suffix || ""}`;
      countObserver.observe(el);
    });
  }

  // ---- Gentle 3D tilt on project cards (mouse only) ----
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover && !reduceMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // ---- Profile photo: fall back to the monogram if the image is missing ----
  const photo = document.querySelector(".profile-photo");
  const monogram = document.querySelector(".photo-placeholder");
  const showMonogram = () => {
    photo.hidden = true;
    monogram.hidden = false;
  };
  if (photo) {
    photo.addEventListener("error", showMonogram);
    if (photo.complete && photo.naturalWidth === 0) showMonogram();
  }

  // ---- Links like "Request my resume" pre-select the topic in the form ----
  const topicSelect = document.getElementById("cf-topic");
  document.querySelectorAll("[data-topic]").forEach((link) => {
    link.addEventListener("click", () => {
      topicSelect.value = link.dataset.topic;
    });
  });

  // ---- Floating "Hire me" button: show after the hero, hide at the contact section ----
  const fab = document.querySelector(".fab");
  const heroSection = document.querySelector(".hero-section");
  const contactSection = document.getElementById("contact");
  if ("IntersectionObserver" in window) {
    let pastHero = false;
    let atContact = false;
    const updateFab = () => fab.classList.toggle("show", pastHero && !atContact);
    new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting;
      updateFab();
    }).observe(heroSection);
    new IntersectionObserver(([entry]) => {
      atContact = entry.isIntersecting;
      updateFab();
    }, { threshold: 0.15 }).observe(contactSection);
  }

  // ---- Contact form: sends to Alekya's inbox via Formspree, email never shown ----
  const form = document.getElementById("contact-form");
  const statusEl = form.querySelector(".form-status");
  const sendBtn = form.querySelector(".send-btn");
  const sendLabel = form.querySelector(".send-label");
  const success = document.getElementById("form-success");
  const LINKEDIN_URL = "https://www.linkedin.com/in/linga-alekya";

  const setFieldError = (input, message) => {
    const field = input.closest(".field");
    let error = field.querySelector(".field-error");
    if (message) {
      if (!error) {
        error = document.createElement("p");
        error.className = "field-error";
        error.id = `${input.id}-error`;
        field.append(error);
      }
      error.textContent = message;
      field.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", error.id);
    } else {
      error?.remove();
      field.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  };

  const validate = () => {
    const checks = [
      ["cf-name", (v) => (v.trim() ? "" : "Please enter your name.")],
      ["cf-email", (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address.")],
      ["cf-message", (v) => (v.trim().length >= 10 ? "" : "Please write a short message (at least 10 characters).")],
    ];
    let firstInvalid = null;
    checks.forEach(([id, rule]) => {
      const input = document.getElementById(id);
      const message = rule(input.value);
      setFieldError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    firstInvalid?.focus();
    return !firstInvalid;
  };

  // Clear a field's error as soon as the visitor fixes it
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.closest(".field")?.classList.contains("invalid")) setFieldError(input, "");
    });
  });

  const showError = (text) => {
    statusEl.className = "form-status error";
    statusEl.textContent = `${text} You can also reach me on `;
    const link = document.createElement("a");
    link.href = LINKEDIN_URL;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "LinkedIn";
    statusEl.append(link, ".");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.className = "form-status";
    statusEl.textContent = "";
    if (!validate()) return;

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      showError("The contact form isn't connected yet.");
      return;
    }

    const data = new FormData(form);
    data.append("_subject", `Portfolio: ${data.get("topic")} from ${data.get("name")}`);

    sendBtn.disabled = true;
    sendBtn.classList.add("sending");
    sendLabel.textContent = "Sending…";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error(err);
      showError("Sorry, your message couldn't be sent. Please try again in a moment.");
    } finally {
      sendBtn.disabled = false;
      sendBtn.classList.remove("sending");
      sendLabel.textContent = "Send message";
    }
  });

  document.getElementById("send-another").addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    document.getElementById("cf-name").focus();
  });

  // ---- Footer year ----
  document.getElementById("year").textContent = String(new Date().getFullYear());
});
