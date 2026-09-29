/* =========================
   Beauty Queen — script.js
   ========================= */

/*
  IMPORTANT:
  Paste your deployed Google Apps Script Web App URL into GAS_WEB_APP_URL.
  The Apps Script should accept POST requests and append:
  id, تاریخ, نام و نام خانوادگی, شماره تماس, ایمیل, تایتل, توضیحات, بررسی وضعیت
*/
const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbw3mR6PqaSBUsc0KZssBnXkrLM8DhjQpJuvIS3VztK8cTIeAf7pIZWXGUIasFzonbcS/exec";

// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// Light / Dark mode
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("beauty-queen-theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle?.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";

  if (dark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("beauty-queen-theme", "light");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("beauty-queen-theme", "dark");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
});

// Scroll reveal
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal, .scale-in").forEach((el) => {
  revealObserver.observe(el);
});

// Lead form -> Google Apps Script
const form = document.getElementById("leadForm");
const statusEl = document.getElementById("formStatus");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (GAS_WEB_APP_URL.includes("PASTE_YOUR")) {
    statusEl.textContent =
      "اتصال Google Sheets هنوز تنظیم نشده است. ابتدا URL وب‌اپ را در script.js قرار بده.";
    statusEl.className = "form-status error";
    return;
  }

  const submitButton = form.querySelector(".submit-btn");
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> در حال ارسال...';
  statusEl.textContent = "";

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name")?.trim(),
    phone: formData.get("phone")?.trim(),
    email: formData.get("email")?.trim(),
    title: formData.get("title")?.trim(),
    description: formData.get("description")?.trim(),
  };

  try {
    /*
      no-cors is intentional for a static GitHub Pages frontend.
      Google Apps Script will receive the POST, but the browser cannot
      read the response body.
    */
    await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    statusEl.textContent =
      "درخواستت ثبت شد ✨ مهتاب محمدی به‌زودی برای هماهنگی با تو تماس می‌گیرد.";
    statusEl.className = "form-status success";
    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.textContent =
      "ارسال درخواست انجام نشد. لطفاً دوباره تلاش کن یا با مهتاب تماس بگیر.";
    statusEl.className = "form-status error";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

// Small parallax effect for hero visual
const heroVisual = document.querySelector(".hero-visual");
window.addEventListener("mousemove", (event) => {
  if (!heroVisual || window.innerWidth < 900) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 8;
  const y = (event.clientY / window.innerHeight - 0.5) * 8;

  heroVisual.style.transform = `translate(${x}px, ${y}px)`;
});
