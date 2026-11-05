/* ==========================================================================
   Miau Bistró — Interacciones
   ========================================================================== */
(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     1. Navegación móvil
     ---------------------------------------------------------------------- */
  const navToggle = $("#nav-toggle");
  const nav = $("#primary-nav");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú de navegación");
  }

  function toggleNav() {
    if (!nav || !navToggle) return;
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleNav);
  }

  $$(".nav a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeNav();
  });

  /* ----------------------------------------------------------------------
     2. Header con sombra al hacer scroll
     ---------------------------------------------------------------------- */
  const header = $("#site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----------------------------------------------------------------------
     3. Enlace activo según la sección visible
     ---------------------------------------------------------------------- */
  const navLinks = $$(".nav-list a[href^='#']");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => activeObserver.observe(section));
  }

  /* ----------------------------------------------------------------------
     4. Animaciones de aparición
     ---------------------------------------------------------------------- */
  const revealItems = $$(".reveal");

  if (!prefersReducedMotion) {
    const groups = new Map();
    revealItems.forEach((item) => {
      const parent = item.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(item);
    });
    groups.forEach((items) => {
      items.forEach((item, index) => {
        item.style.transitionDelay = Math.min(index * 65, 320) + "ms";
      });
    });
  }

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ----------------------------------------------------------------------
     5. Contadores del hero
     ---------------------------------------------------------------------- */
  const counters = $$("[data-count]");

  function animateCounter(element) {
    const target = parseFloat(element.dataset.count || "0");
    const decimals = parseInt(element.dataset.decimals || "0", 10);
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => {
        const decimals = parseInt(counter.dataset.decimals || "0", 10);
        counter.textContent = decimals
          ? parseFloat(counter.dataset.count).toFixed(decimals)
          : counter.dataset.count;
      });
    }
  }

  /* ----------------------------------------------------------------------
     6. Pestañas del menú
     ---------------------------------------------------------------------- */
  const menuTabs = $$(".menu-tab");
  const menuCards = $$("#menu-grid .menu-item");
  const menuPanel = $("#panel-menu");

  function filterMenu(category) {
    menuCards.forEach((card) => {
      card.hidden = card.dataset.category !== category;
    });
    if (menuPanel) {
      const activeTab = menuTabs.find((tab) => tab.dataset.filter === category);
      if (activeTab) menuPanel.setAttribute("aria-labelledby", activeTab.id);
    }
  }

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((other) => {
        const isActive = other === tab;
        other.classList.toggle("is-active", isActive);
        other.setAttribute("aria-selected", String(isActive));
      });
      filterMenu(tab.dataset.filter);
    });

    tab.addEventListener("keydown", (event) => {
      const index = menuTabs.indexOf(tab);
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % menuTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
      if (nextIndex === null) return;
      event.preventDefault();
      menuTabs[nextIndex].focus();
      menuTabs[nextIndex].click();
    });
  });

  /* ----------------------------------------------------------------------
     7. Fichas de la gatoteca
     ---------------------------------------------------------------------- */
  const cats = {
    miso: {
      name: "Miso",
      age: "8 meses",
      role: "Aprendiz de siestas",
      bio: "Miso llegó a la casa siendo un bebé y aprendió todo lo que sabe de Tofu. Es el primero en saludar, el último en rendirse y el responsable de que ningún cordón de zapatos esté a salvo. Busca una familia con paciencia y muchas horas de juego.",
      traits: ["Juguetón", "Curioso", "Travieso"],
      arrived: "Enero de 2026",
      loves: "Pelotas de papel",
      adoptable: true,
      img: "assets/img/gato-2.jpg",
      alt: "Miso, gato atigrado"
    },
    mango: {
      name: "Mango",
      age: "3 años",
      role: "Rey del sol",
      bio: "Mango supervisa la terraza desde el mejor cojín de la casa. Le encanta saludar a los visitantes, probar un poco de salmón y dormir en cualquier superficie que reciba sol. Es sociable, tranquilo y, según él, el verdadero dueño del bistró.",
      traits: ["Sociable", "Glotón", "Tranquilo"],
      arrived: "Marzo de 2019",
      loves: "El sol de las 4 pm",
      adoptable: false,
      img: "assets/img/gato-3.jpg",
      alt: "Mango, gato naranja"
    },
    luna: {
      name: "Luna",
      age: "4 años",
      role: "Guardiana nocturna",
      bio: "Luna es elegante, independiente y selectiva con las personas. Toma su tiempo para confiar, pero cuando lo hace se convierte en una sombra que ronronea. Busca un hogar tranquilo, sin perros y con una ventana para mirar la noche.",
      traits: ["Independiente", "Elegante", "Reservada"],
      arrived: "Noviembre de 2022",
      loves: "Ventanas y altura",
      adoptable: true,
      img: "assets/img/gato-4.jpg",
      alt: "Luna, gata negra"
    },
    nube: {
      name: "Nube",
      age: "2 años",
      role: "Dama de algodón",
      bio: "Nube es pura suavidad. Le encanta que la cepillen, dormir en regazos y observar a los humanos sin hacer ruido. Se lleva bien con otros gatos y sería feliz en una casa donde haya alguien trabajando desde casa.",
      traits: ["Tranquila", "Mimosa", "Sociable"],
      arrived: "Mayo de 2024",
      loves: "Cepillos suaves",
      adoptable: true,
      img: "assets/img/gato-5.jpg",
      alt: "Nube, gata blanca"
    },
    bigotes: {
      name: "Bigotes",
      age: "5 años",
      role: "Director de ceremonias",
      bio: "Bigotes tiene opiniones y las comparte. Maúlla para saludar, para pedir comida y para recordarte que llegas tarde. Es el anfitrión oficial del bistró, experto en recibir visitas y en posar para las fotos.",
      traits: ["Carismático", "Charlatán", "Fotogénico"],
      arrived: "Julio de 2021",
      loves: "Ser el centro",
      adoptable: false,
      img: "assets/img/gato-6.jpg",
      alt: "Bigotes, gato de mirada curiosa"
    },
    tofu: {
      name: "Tofu",
      age: "6 años",
      role: "Embajador de siestas",
      bio: "Tofu es el alma zen de la casa. Duerme entre 18 y 20 horas diarias y considera que cualquier regazo es una cama válida. Es dulce, paciente y el mejor compañero para una tarde de lectura. No lo despiertes: es su trabajo.",
      traits: ["Dormilón", "Dulce", "Paciente"],
      arrived: "Febrero de 2020",
      loves: "Regazos y mantas",
      adoptable: false,
      img: "assets/img/gato-7.jpg",
      alt: "Tofu, gato dormilón"
    }
  };

  const catDialog = $("#cat-dialog");
  const catCards = $$(".cat-card");

  function openCat(catId) {
    const cat = cats[catId];
    if (!cat || !catDialog) return;

    $("#dialog-img").src = cat.img;
    $("#dialog-img").alt = cat.alt;
    $("#cat-dialog-name").textContent = cat.name;
    $("#dialog-role").textContent = cat.role;
    $("#dialog-bio").textContent = cat.bio;
    $("#dialog-age").textContent = cat.age;
    $("#dialog-arrived").textContent = cat.arrived;
    $("#dialog-loves").textContent = cat.loves;
    $("#dialog-status").textContent = cat.adoptable ? "En adopción" : "Residente permanente";
    $("#dialog-cta").textContent = cat.adoptable ? "Agendar visita" : "Visitar a " + cat.name;

    const traits = $("#dialog-traits");
    traits.innerHTML = "";
    cat.traits.forEach((trait) => {
      const span = document.createElement("span");
      span.textContent = trait;
      traits.appendChild(span);
    });

    if (typeof catDialog.showModal === "function") {
      catDialog.showModal();
    }
  }

  catCards.forEach((card) => {
    card.addEventListener("click", () => openCat(card.dataset.cat));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCat(card.dataset.cat);
      }
    });
  });

  if (catDialog) {
    const closeButton = $("#dialog-close");
    const dialogCta = $("#dialog-cta");

    const closeDialog = () => {
      if (catDialog.open) catDialog.close();
    };

    if (closeButton) closeButton.addEventListener("click", closeDialog);

    catDialog.addEventListener("click", (event) => {
      if (event.target === catDialog) closeDialog();
    });

    if (dialogCta) {
      dialogCta.addEventListener("click", closeDialog);
    }
  }

  /* ----------------------------------------------------------------------
     8. Formulario de reservas
     ---------------------------------------------------------------------- */
  const form = $("#reserva-form");
  const successPanel = $("#reserva-success");
  const newReservationButton = $("#new-reservation");

  const validators = {
    nombre: (value) => value.trim().length >= 3 || "Escribe tu nombre completo.",
    correo: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ||
      "Escribe un correo electrónico válido.",
    telefono: (value) =>
      (value.replace(/\D/g, "").length >= 7) ||
      "Escribe un teléfono con al menos 7 dígitos.",
    personas: (value) => value !== "" || "Selecciona cuántas personas vienen.",
    fecha: (value) => {
      if (!value) return "Selecciona una fecha.";
      const chosen = new Date(value + "T12:00:00");
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return chosen >= tomorrow || "Reserva con al menos 24 horas de anticipación.";
    },
    hora: (value) => value !== "" || "Selecciona una hora.",
    acepto: (value, field) => field.checked || "Debes aceptar las reglas de la casa."
  };

  function setFieldError(name, message) {
    const field = form ? form.elements[name] : null;
    const errorElement = form ? form.querySelector(`[data-error-for="${name}"]`) : null;
    if (errorElement) errorElement.textContent = message || "";

    if (!field) return;
    const wrapper = field.closest(".field");
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(name) {
    const field = form ? form.elements[name] : null;
    const validator = validators[name];
    if (!field || !validator) return true;
    const result = validator(field.value, field);
    const valid = result === true;
    setFieldError(name, valid ? "" : result);
    return valid;
  }

  function validateForm() {
    return Object.keys(validators)
      .map((name) => validateField(name))
      .every(Boolean);
  }

  if (form) {
    const dateInput = $("#fecha");
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, "0"),
        String(tomorrow.getDate()).padStart(2, "0")
      ].join("-");
      dateInput.min = minDate;
      dateInput.max = new Date(Date.now() + 1000 * 60 * 60 * 24 * 120)
        .toISOString()
        .slice(0, 10);
    }

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", () => validateField(name));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
      field.addEventListener("change", () => validateField(name));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm()) {
        const firstInvalid = form.querySelector('[aria-invalid="true"], .has-error input, .has-error select, .has-error textarea');
        if (firstInvalid) {
          firstInvalid.focus({ preventScroll: true });
          firstInvalid.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
        }
        showToast("Revisa los campos marcados para continuar.");
        return;
      }

      const data = {
        nombre: form.elements.nombre.value.trim(),
        correo: form.elements.correo.value.trim(),
        telefono: form.elements.telefono.value.trim(),
        personas: form.elements.personas.value,
        fecha: form.elements.fecha.value,
        hora: form.elements.hora.value,
        ocasion: form.elements.ocasion.value,
        gato: form.elements.gato.value,
        notas: form.elements.notas.value.trim()
      };

      const code = "MB-" + Date.now().toString(36).slice(-5).toUpperCase();
      const dateLabel = formatDate(data.fecha);
      const timeLabel = formatTime(data.hora);

      $("#success-name").textContent = data.nombre.split(" ")[0];
      $("#success-email").textContent = data.correo;
      $("#success-code").textContent = code;

      const details = $("#success-details");
      details.innerHTML = "";
      [
        ["Fecha", dateLabel],
        ["Hora", timeLabel],
        ["Personas", data.personas === "7+" ? "Más de 6" : data.personas],
        ["Gato favorito", data.gato],
        ["Ocasión", data.ocasion]
      ].forEach(([label, value]) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const strong = document.createElement("strong");
        span.textContent = label;
        strong.textContent = value;
        li.append(span, strong);
        details.appendChild(li);
      });

      try {
        const stored = JSON.parse(localStorage.getItem("miau-reservas") || "[]");
        stored.push({ ...data, code, createdAt: new Date().toISOString() });
        localStorage.setItem("miau-reservas", JSON.stringify(stored));
      } catch (error) {
        /* El demo funciona igual si localStorage no está disponible. */
      }

      form.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        successPanel.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
      }
      showToast("¡Solicitud enviada! Código " + code);
    });
  }

  if (newReservationButton) {
    newReservationButton.addEventListener("click", () => {
      if (!form || !successPanel) return;
      form.reset();
      $$(".has-error", form).forEach((element) => element.classList.remove("has-error"));
      $$(".error", form).forEach((element) => {
        element.textContent = "";
      });
      $$("[aria-invalid]", form).forEach((element) => element.removeAttribute("aria-invalid"));
      successPanel.hidden = true;
      form.hidden = false;
      form.elements.nombre.focus();
      form.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    });
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(value + "T12:00:00"));
    } catch (error) {
      return value;
    }
  }

  function formatTime(value) {
    const labels = {
      "09:00": "9:00 a. m.",
      "11:00": "11:00 a. m.",
      "13:00": "1:00 p. m.",
      "15:00": "3:00 p. m.",
      "17:00": "5:00 p. m.",
      "19:00": "7:00 p. m."
    };
    return labels[value] || value;
  }

  /* ----------------------------------------------------------------------
     9. Acordeón de preguntas frecuentes
     ---------------------------------------------------------------------- */
  const faqItems = $$(".faq-list details");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ----------------------------------------------------------------------
     10. Utilidades
     ---------------------------------------------------------------------- */
  let toastTimer = null;
  const toast = $("#toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 4600);
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* Pausa el marquee al pasar el mouse (mejor lectura). */
  const marquee = $(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => {
      marquee.style.animationPlayState = "paused";
    });
    marquee.addEventListener("mouseleave", () => {
      marquee.style.animationPlayState = "running";
    });
  }
})();
