/* ── THEME ── */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

let theme = localStorage.getItem("theme") || "dark";
root.setAttribute("data-theme", theme);
updateIcons();

themeBtn.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateIcons();
});

function updateIcons() {
  iconSun.style.display = theme === "dark" ? "block" : "none";
  iconMoon.style.display = theme === "dark" ? "none" : "block";
}

/* ── MOBILE NAV ── */
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

navToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
    mobileMenu.classList.remove("open");
    navToggle.classList.remove("active");
  }
});

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);

reveals.forEach((el) => observer.observe(el));

/* ── FOOTER YEAR ── */
document.getElementById("year").textContent = new Date().getFullYear();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ── HEADER SCROLL EFFECT ── */
const header = document.querySelector(".site-header");
window.addEventListener(
  "scroll",
  () => {
    header.style.borderBottomColor =
      window.scrollY > 50 ? "rgba(255,255,255,0.08)" : "var(--border)";
  },
  { passive: true },
);

/* ── FORCE PDF DOWNLOAD FOR GITHUB PAGES ── */
document.querySelectorAll("a[download]").forEach((link) => {
  try {
    const href = link.getAttribute("href");
    if (!href || !href.toLowerCase().endsWith(".pdf")) return;

    link.addEventListener("click", async (e) => {
      // Let ctrl/cmd+click or modifier open in new tab normally
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      try {
        const resp = await fetch(href, { cache: "no-cache" });
        if (!resp.ok) throw new Error("Network response was not ok");
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const filename = href.split("/").pop() || "download.pdf";
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
      } catch (err) {
        // Fallback: navigate to href so browser handles it
        window.location.href = href;
      }
    });
  } catch (err) {
    // ignore
  }
});
