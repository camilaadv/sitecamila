const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];

// Navbar ao rolar
function handleNavbar() {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMobileMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

function toggleMobileMenu() {
  if (!navLinks || !menuToggle) return;

  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
}

handleNavbar();
window.addEventListener("scroll", handleNavbar, { passive: true });

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", toggleMobileMenu);
}

navAnchors.forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMobileMenu();
});

// Animações de entrada
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -40px 0px"
});

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

// Link ativo na navegação
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navAnchors.forEach(link => {
      const id = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", id === entry.target.id);
    });
  });
}, {
  rootMargin: "-42% 0px -48% 0px",
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

// FAQ
document.querySelectorAll(".faq-item").forEach(item => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      openItem.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// Carrossel de depoimentos
const testimonials = [...document.querySelectorAll(".testimonial")];
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
const sliderDots = document.getElementById("sliderDots");

let currentTestimonial = 0;
let testimonialTimer;

testimonials.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = "slider-dot";
  dot.setAttribute("aria-label", `Ir para o depoimento ${index + 1}`);

  dot.addEventListener("click", () => {
    showTestimonial(index);
    restartAutoplay();
  });

  sliderDots.appendChild(dot);
});

const dots = [...document.querySelectorAll(".slider-dot")];

function showTestimonial(index) {
  testimonials[currentTestimonial].classList.remove("active");
  dots[currentTestimonial].classList.remove("active");

  currentTestimonial = (index + testimonials.length) % testimonials.length;

  testimonials[currentTestimonial].classList.add("active");
  dots[currentTestimonial].classList.add("active");
}

function restartAutoplay() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 5500);
}

prevBtn.addEventListener("click", () => {
  showTestimonial(currentTestimonial - 1);
  restartAutoplay();
});

nextBtn.addEventListener("click", () => {
  showTestimonial(currentTestimonial + 1);
  restartAutoplay();
});

dots[0]?.classList.add("active");
restartAutoplay();

// Efeito suave no hero com o mouse
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");

if (window.matchMedia("(pointer: fine)").matches && hero && heroVisual) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroVisual.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
  });

  hero.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "translate3d(0, 0, 0)";
  });
}

// Ano automático no rodapé
document.getElementById("currentYear").textContent = new Date().getFullYear();
