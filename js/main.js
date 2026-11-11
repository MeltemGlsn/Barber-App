// =========================================================
// Sharp Mobile Barber — main.js
// =========================================================

// International format without "+" or leading zero (07000 000000 -> 447000000000)
const WHATSAPP_NUMBER = "447000000000";

document.documentElement.classList.remove("no-js");

// ---------- Header background on scroll ----------
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu ----------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- Reveal on scroll ----------
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

// ---------- Booking form -> WhatsApp message ----------
const form = document.getElementById("bookingForm");
const formError = document.getElementById("formError");
const dateInput = form.elements.date;

// Prevent past dates
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const required = [...form.querySelectorAll("[required]")];
  let valid = true;
  required.forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("is-invalid", empty);
    if (empty) valid = false;
  });

  formError.hidden = valid;
  if (!valid) {
    required.find((f) => !f.value.trim()).focus();
    return;
  }

  const data = new FormData(form);
  const date = new Date(`${data.get("date")}T12:00`).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const lines = [
    "Hi, I'd like to book a cut:",
    `Name: ${data.get("name")}`,
    `Service: ${data.get("service")}`,
    `Date: ${date}`,
    `Time: ${data.get("time")}`,
    `Postcode: ${data.get("postcode").toUpperCase()}`,
  ];
  if (data.get("notes").trim()) lines.push(`Notes: ${data.get("notes").trim()}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
});

form.addEventListener("input", (e) => {
  if (e.target.value.trim()) e.target.classList.remove("is-invalid");
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();


// =========================================================
// Visual effects
// =========================================================

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scissorsTpl = document.getElementById("scissorsTpl");
const makeScissors = () => scissorsTpl.content.firstElementChild.cloneNode(true);

// ---------- 1) Intro: remove overlay when finished ----------
const intro = document.getElementById("intro");
const root = document.documentElement;

function endIntro() {
  root.classList.remove("play-intro");
  intro.remove();
}

if (root.classList.contains("play-intro")) {
  try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
  intro.querySelector(".intro__half--bottom").addEventListener("animationend", endIntro, { once: true });
  setTimeout(() => intro.isConnected && endIntro(), 2600); // fallback if animationend never fires
} else {
  intro.remove();
}

// ---------- 2) Scissors cursor over interactive elements (pointer devices only) ----------
const clickable = "a, button, summary, [role='button'], .gallery img";
const hasMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
let cursor = null;

if (hasMouse) {
  cursor = document.createElement("div");
  cursor.className = "scissor-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.appendChild(makeScissors());
  document.body.appendChild(cursor);
  root.classList.add("has-scissor-cursor");

  // Offset so the blade tip sits on the actual pointer hotspot
  const TIP_X = 1.9;
  const TIP_Y = 20;

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX - TIP_X}px, ${e.clientY - TIP_Y}px)`;
    cursor.classList.toggle("is-active", !!e.target.closest(clickable));
  });

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
}

// ---------- Hair clippings on click (mouse, touch and keyboard) ----------
document.addEventListener("click", (e) => {
  if (!e.target.closest(clickable)) return;
  // Keyboard activation reports (0, 0): fall back to the element's centre
  let { clientX: x, clientY: y } = e;
  if (!x && !y) {
    const r = e.target.closest(clickable).getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top + r.height / 2;
  }
  scatterHair(x, y);
});

const HAIR_COLORS = [
  { color: "#e3c27a" },                 // blonde
  { color: "#c9a45c" },                 // golden
  { color: "#8a5a2b" },                 // light brown
  { color: "#5b3a1f" },                 // dark brown
  { color: "#151515", dark: true },     // black
  { color: "#151515", dark: true },
];

function scatterHair(x, y) {
  // Render inside the lightbox when open (it sits in the top layer)
  const layer = lightbox.open ? lightbox : document.body;
  const count = 18;

  for (let i = 0; i < count; i++) {
    const { color, dark } = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
    const hair = document.createElement("span");
    hair.className = dark ? "clipping clipping--dark" : "clipping";
    hair.style.background = color;
    hair.style.width = `${2 + Math.random() * 1.5}px`;
    hair.style.height = `${8 + Math.random() * 12}px`;
    layer.appendChild(hair);

    // Burst outwards (biased upwards), then fall with gravity
    const angle = Math.random() * Math.PI * 2;
    const burst = 22 + Math.random() * 45;
    const bx = x + Math.cos(angle) * burst;
    const by = y + Math.sin(angle) * burst - 18;
    const fx = bx + (Math.random() - 0.5) * 50;
    const fy = by + 80 + Math.random() * 90;
    const r0 = Math.random() * 360;
    const r1 = r0 + (Math.random() - 0.5) * 300;
    const r2 = r1 + (Math.random() - 0.5) * 540;

    hair.animate(
      [
        { transform: `translate(${x}px, ${y}px) rotate(${r0}deg) scale(.4)`, opacity: 1, easing: "cubic-bezier(.15, .8, .35, 1)" },
        { transform: `translate(${bx}px, ${by}px) rotate(${r1}deg) scale(1)`, opacity: 1, offset: 0.3, easing: "cubic-bezier(.45, 0, .85, .55)" },
        { transform: `translate(${fx}px, ${fy}px) rotate(${r2}deg) scale(1)`, opacity: 0 },
      ],
      { duration: 1000 + Math.random() * 600, fill: "forwards" }
    ).onfinish = () => hair.remove();
  }
}

// ---------- 3) Scissors sweep on in-page navigation ----------
const sweep = document.getElementById("sweep");
sweep.querySelector(".sweep__scissors").appendChild(makeScissors());

document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
  link.addEventListener("click", () => {
    if (reduceMotion) return;
    sweep.classList.remove("is-running");
    void sweep.offsetWidth; // force reflow to restart the animation
    sweep.classList.add("is-running");
  });
});
sweep.querySelector(".sweep__line").addEventListener("animationend", (e) => {
  if (e.animationName === "fadeOut") sweep.classList.remove("is-running");
});

// ---------- 4) "Cut line" divider under section headings ----------
document.querySelectorAll(".section__head h2").forEach((title) => {
  const divider = document.createElement("span");
  divider.className = "cut-divider";
  divider.setAttribute("aria-hidden", "true");
  divider.appendChild(makeScissors());
  title.after(divider);
});

// ---------- 5) Gallery lightbox ----------
const gallery = document.querySelector(".gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
let current = 0;

const galleryImages = () => [...gallery.querySelectorAll("img")];

function showImage(index) {
  const images = galleryImages();
  current = (index + images.length) % images.length;
  const img = images[current];
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightboxImg.style.animation = "none";
  void lightboxImg.offsetWidth;
  lightboxImg.style.animation = "";
}

function openLightbox(img) {
  showImage(galleryImages().indexOf(img));
  lightbox.showModal();
  // The modal dialog renders in the top layer, so move the custom cursor inside it
  if (cursor) lightbox.appendChild(cursor);
}

lightbox.addEventListener("close", () => {
  if (cursor) document.body.appendChild(cursor);
});

// Event delegation, so images added later work without extra wiring
gallery.querySelectorAll("img").forEach((img) => {
  img.tabIndex = 0;
  img.setAttribute("role", "button");
});
gallery.addEventListener("click", (e) => {
  const img = e.target.closest("img");
  if (img) openLightbox(img);
});
gallery.addEventListener("keydown", (e) => {
  const img = e.target.closest("img");
  if (img && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openLightbox(img);
  }
});

document.getElementById("lightboxClose").addEventListener("click", () => lightbox.close());
document.getElementById("lightboxPrev").addEventListener("click", () => showImage(current - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showImage(current + 1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showImage(current - 1);
  if (e.key === "ArrowRight") showImage(current + 1);
});
