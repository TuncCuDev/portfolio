let currentIndex = 0;
let translations = {};
const testimonials = [
    {
        textKey: "testimonial_1_text",
        authorKey: "testimonial_1_author"
    },
    {
        textKey: "testimonial_2_text",
        authorKey: "testimonial_2_author"
    },
    {
        textKey: "testimonial_3_text",
        authorKey: "testimonial_3_author"
    }
];


/**
 * Highlights the navigation link of the section currently visible in the viewport while scrolling.
 */
window.addEventListener("scroll", () => {
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2) {
            current = section.id;
        }
    });
        links.forEach(link => {
        link.classList.remove("active");

        if (link.hash === "#" + current) {
            link.classList.add("active");
        }
    });
});

/**
 * For scrolling through html sites.
 */
window.addEventListener("load", () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 100;
    setTimeout(() => {
        const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;
        window.scrollTo({
            top: y,
            behavior: "smooth"
        });
    }, 100);
});

/**
 * Checks whether the form is valid.
 * Enables the submit button.
 * @param {*} submitBtn 
 */
function enableSubmitButton(submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('disabled');
    submitBtn.classList.add('enabled');
}

/**
 * Disables the submit button.
 * @param {*} submitBtn 
 */
function disableSubmitButton(submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.classList.remove('enabled');
}

/**
 * Sets the selected language and updates the active button.
 * @param {*} lang 
 * @param {*} button 
 */
function setLanguage(lang, button) {
    loadLanguage(lang);

    document.querySelectorAll(".language-pill, .lang-text").forEach(btn => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
}

/**
 * Loads and applies translations.
 * @param {*} lang 
 */
async function loadLanguage(lang) {
    translations = await loadTranslations(lang);
    applyTextTranslations(translations);
    applyHtmlTranslations(translations);
    applyPlaceholderTranslations(translations);
    currentIndex = 0;
    renderTestimonial();
}

/**
 * Loads translation data from a JSON file.
 * @param {*} lang 
 */
async function loadTranslations(lang) {
    const jsonPath = window.location.pathname.includes('/html/')
        ? `../json/${lang}.json`
        : `./json/${lang}.json`;
    const response = await fetch(jsonPath);
    return await response.json();
}

/**
 *  Updates text translations.
 * @param {*} translations 
 */
function applyTextTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;

        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

/**
 * Updates HTML translations.
 * @param {*} translations 
 */
function applyHtmlTranslations(translations) {
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.dataset.i18nHtml;

        if (translations[key]) {
            element.innerHTML = translations[key];
        }
    });
}

/**
 * Applies translated placeholders.
 * @param {*} translations 
 */
function applyPlaceholderTranslations(translations) {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;

        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
}

/**
 * Tracks the active section on scroll.
 */
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });
});

/**
 * Toggles the mobile menu open/close.
 */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const body = document.body;

    menu.classList.toggle('active');
    body.classList.toggle('no-scroll');
}

/**
 * Sends the contact request.
 * @param {Object} data 
 */
async function sendContactRequest(data) {
    const response = await fetch('contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/**
 * Renders the current testimonial text, author, and active navigation dot.
 */
function renderTestimonial() {
    if (!document.getElementById("testimonialText")) return;
    const t = translations;
    document.getElementById("testimonialText").textContent =
        t[testimonials[currentIndex].textKey];
    document.getElementById("testimonialAuthor").textContent =
        t[testimonials[currentIndex].authorKey];
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

/**
 * Shows the next testimonial and loops back to the start if needed.
 */
function nextTestimonial() {
    currentIndex++;
    if (currentIndex >= testimonials.length) {
        currentIndex = 0;
    }
    renderTestimonial();
}

/**
 * This code waits until the HTML document is fully loaded and then loads the German language as the default.
 */
document.addEventListener("DOMContentLoaded", async () => {
    await loadLanguage("de");
});

/**
 * Smoothly scrolls the page back to the main section.
 */
function scrollToTop() {
    document.getElementById('main').scrollIntoView({
        behavior: 'smooth'
    });
}

/**
 * Shows the previous testimonial and loops back to the last item if needed.
 */
function prevTestimonial() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = testimonials.length - 1;
    }
    renderTestimonial();
}

/**
 * Displays a specific testimonial based on the given index.
 */
function showTestimonial(index) {
    currentIndex = index;
    renderTestimonial();
}

/**
 * Animation for scrolling through sections.
 */
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.2
    });
    sections.forEach(section => observer.observe(section));
});