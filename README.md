# Miau Bistró 🐾

Sitio web de **Miau Bistró**, un restaurante / cat café ficticio en Medellín donde los gatos son los anfitriones. Incluye carta para humanos, menú felino, fichas de los gatos residentes, reservas y preguntas frecuentes.

Proyecto desarrollado como pieza de portafolio por **OntoByte**.

> **Demo en vivo:** https://felipeboom3000.github.io/restaurante-gatos/
>
> **Repositorio:** https://github.com/FELIPEBOOM3000/restaurante-gatos

![Estado](https://img.shields.io/badge/estado-listo%20para%20publicar-3f5b4a)
![HTML](https://img.shields.io/badge/HTML5-sem%C3%A1ntico-e34f26)
![CSS](https://img.shields.io/badge/CSS3-sin%20frameworks-1572b6)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e)

## ✨ Qué incluye

- Diseño responsive (móvil, tablet y escritorio).
- Identidad visual propia: tipografía editorial, paleta cálida y texturas sutiles.
- Navegación fija con enlace activo según la sección visible.
- Menú filtrable por categorías: para humanos, menú felino y postres & café.
- Gatoteca interactiva con fichas ampliadas de cada gato en un `<dialog>`.
- Formulario de reservas con validación en tiempo real, resumen y código de reserva.
- Las reservas se guardan en `localStorage` (modo demostración, sin backend).
- Acordeón de preguntas frecuentes, animaciones al hacer scroll y respeto por `prefers-reduced-motion`.
- Metadatos SEO, Open Graph y datos estructurados `Restaurant` (JSON-LD).
- Página 404 personalizada para GitHub Pages.

## 🗂 Estructura

```text
restaurante-gatos/
├── index.html
├── 404.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── logo.svg
│       ├── favicon.svg
│       ├── gato-1.jpg … gato-8.jpg
│       └── CREDITOS.md
├── .gitignore
└── README.md
```

## 🚀 Cómo verlo en local

No necesita instalación ni servidor especial:

1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador.
3. Opcional: en VS Code usa la extensión **Live Server** y abre `index.html` con *Open with Live Server*.

También puedes iniciar un servidor estático desde la terminal:

```bash
# Python 3
python -m http.server 5500

# Node.js (si tienes npx)
npx serve .
```

Luego visita `http://localhost:5500`.

## 🌐 Publicación en GitHub Pages

El sitio es 100 % estático, así que se publica directo desde la rama `main`:

1. En GitHub entra a **Settings → Pages**.
2. En *Build and deployment* elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda y espera uno o dos minutos.

La URL quedará con este formato:

```text
https://TU-USUARIO.github.io/restaurante-gatos/
```

## 🔧 Flujo de trabajo con Git (guía de clase)

```bash
# 1. Configuración inicial (solo una vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@email.com"

# 2. Inicializar el proyecto
git init
git status
git add .
git commit -m "Primer commit: sitio web de Miau Bistró"

# 3. Conectar con GitHub y subir
git branch -M main
git remote add origin https://github.com/TU-USUARIO/restaurante-gatos.git
git push -u origin main

# 4. Día a día
git status
git add .
git commit -m "Describe el cambio"
git pull
git push
```

### Buenas prácticas aplicadas

- Commits pequeños y con mensajes claros.
- `README.md` y `.gitignore` desde el primer commit.
- Rama `main` como rama principal.
- Revisión de `git status` antes de cada commit.
- `git pull` antes de trabajar si el repositorio es compartido.

## 🎨 Personalización rápida

- **Colores y tipografías:** variables al inicio de `assets/css/styles.css`.
- **Textos y precios:** directamente en `index.html`.
- **Gatos y fichas:** el objeto `cats` en `assets/js/main.js`.
- **Fotos:** reemplaza los archivos de `assets/img/` conservando los nombres o actualiza las rutas.
- **Redes y contacto:** los enlaces de Instagram y TikTok son marcadores de posición (`#`); el teléfono, correo y dirección son datos de ejemplo.

## 📸 Créditos de imágenes

Las fotografías de gatos son **imágenes de demostración** obtenidas de [cataas.com](https://cataas.com) y se usan solo como marcadores de posición. Para un proyecto real, reemplázalas por fotografía propia o por imágenes con licencia verificada. Más detalle en [`assets/img/CREDITOS.md`](assets/img/CREDITOS.md).

## ⚠️ Nota

Miau Bistró es una marca ficticia creada para este ejercicio académico. La dirección, teléfono, correo y precios son de ejemplo.

---

Hecho con cariño (y varios ronroneos) por **OntoByte**.
