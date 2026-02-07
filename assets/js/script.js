const app = document.getElementById("app");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");
const themeBtn = document.getElementById("themeBtn");
const themeLabel = document.getElementById("themeLabel");
const toTopBtn = document.getElementById("toTopBtn");
const openFromHero = document.getElementById("openFromHero");
const navLinks = Array.from(document.querySelectorAll("[data-jump]"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const currentSectionElement = document.getElementById("currentSection");
const topbar = document.querySelector(".topbar");

// Set current year in footer
document.getElementById("yr").textContent = new Date().getFullYear();

// Drawer open/close functions
function openDrawer() {
    app.classList.add("isOpen");
    overlay.setAttribute("aria-hidden", "false");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Add opening animation
    drawer.style.transform = "translateX(-100%)";
    setTimeout(() => {
        drawer.style.transition =
            "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        drawer.style.transform = "translateX(0)";
    }, 10);
}

function closeDrawer() {
    app.classList.remove("isOpen");
    overlay.setAttribute("aria-hidden", "true");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Add closing animation
    drawer.style.transform = "translateX(-100%)";
    setTimeout(() => {
        drawer.style.transition = "";
    }, 500);
}

// Drawer event listeners
menuBtn.addEventListener("click", openDrawer);
openFromHero.addEventListener("click", openDrawer);
closeBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// Close drawer with Escape key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && app.classList.contains("isOpen")) {
        closeDrawer();
    }
});

// Smooth scroll with topbar offset
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = (topbar ? topbar.offsetHeight : 76) + 20;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: y,
        behavior: "smooth",
    });
}

// Navigation click handlers
navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("data-jump");
        if (!id) return;

        // Add click animation
        link.style.transform = "scale(0.95)";
        setTimeout(() => {
            link.style.transform = "";
        }, 150);

        closeDrawer();

        // Small delay for drawer to close before scrolling
        setTimeout(() => {
            scrollToSection(id);
        }, 300);
    });
});

// Back to top button
toTopBtn.addEventListener("click", () => {
    closeDrawer();
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Theme toggle
let tintMode = "ocean";

function applyTheme(mode) {
    // Remove previous theme class
    document.body.classList.remove("theme-deep");

    if (mode === "deep") {
        // Deep theme: indigo/violet
        document.body.classList.add("theme-deep");
        themeBtn.innerHTML =
            '<i class="fas fa-palette"></i><span>Theme: Deep</span>';
        themeLabel.textContent = "Deep";
    } else {
        // Ocean theme: blue/cyan (default)
        themeBtn.innerHTML =
            '<i class="fas fa-palette"></i><span>Theme: Ocean</span>';
        themeLabel.textContent = "Ocean";
    }

    // Add button animation
    themeBtn.animate(
        [
            { transform: "scale(1)" },
            { transform: "scale(1.1)" },
            { transform: "scale(1)" },
        ],
        {
            duration: 300,
            easing: "ease-out",
        }
    );
}

// Initialize with Ocean theme
applyTheme(tintMode);

// Theme toggle button
themeBtn.addEventListener("click", () => {
    tintMode = tintMode === "ocean" ? "deep" : "ocean";
    applyTheme(tintMode);
});

// Section name mapping for display
const sectionNames = {
    overview: "Overview",
    features: "Features",
    workflow: "Workflow",
    showcase: "Showcase",
    faq: "FAQ",
    contact: "Contact",
};

// Active link tracking
let currentActive = "overview";

function updateActiveLink(sectionId) {
    if (currentActive === sectionId) return;

    currentActive = sectionId;

    // Remove active class from all nav links
    navLinks.forEach((link) => {
        link.classList.remove("active");
    });

    // Find and activate the current link
    const currentLink = document.querySelector(
        `.navLink[data-jump="${sectionId}"]`
    );
    if (currentLink) {
        currentLink.classList.add("active");

        // Add subtle animation when becoming active
        currentLink.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(0)" },
            ],
            {
                duration: 300,
                easing: "ease-out",
            }
        );
    }

    // Update current section display
    if (currentSectionElement && sectionNames[sectionId]) {
        currentSectionElement.textContent = sectionNames[sectionId];
    }
}

// Intersection Observer for scroll spy
const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px", // Adjusted margins for better detection
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
};

const observer = new IntersectionObserver((entries) => {
    let mostVisible = null;
    let highestRatio = 0;

    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            mostVisible = entry.target;
        }
    });

    if (mostVisible) {
        const sectionId = mostVisible.getAttribute("data-section");
        updateActiveLink(sectionId);
    }
}, observerOptions);

// Observe all sections
sections.forEach((section) => observer.observe(section));

// Fallback: Update on scroll for edge cases
window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 100; // Add offset

    // Find which section is currently in view
    let currentSection = "overview";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150; // Adjusted offset
        const sectionHeight = section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("data-section");
        }
    });

    updateActiveLink(currentSection);
});

// Topbar scroll effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
        topbar.classList.add("scrolled");
    } else {
        topbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
});

// Initialize with first section active
window.addEventListener("load", () => {
    // Set initial active state
    updateActiveLink("overview");

    // Add loading animation
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// Manual scroll trigger for debugging
window.addEventListener("scroll", () => {
    // Force update on scroll end
    clearTimeout(window.scrollEndTimer);
    window.scrollEndTimer = setTimeout(() => {
        const currentScroll = window.scrollY;
        let closestSection = "overview";
        let minDistance = Infinity;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const distance = Math.abs(sectionTop - currentScroll);

            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section.getAttribute("data-section");
            }
        });

        updateActiveLink(closestSection);
    }, 150);
});

// Add click handlers for direct section activation
sections.forEach((section) => {
    section.addEventListener("click", () => {
        const sectionId = section.getAttribute("data-section");
        updateActiveLink(sectionId);
    });
});

// Ripple effect for buttons
document.querySelectorAll(".btn, .chip").forEach((button) => {
    button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 255, 255, 0.3)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple 0.6s linear";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.style.width = "100px";
        ripple.style.height = "100px";
        ripple.style.marginLeft = "-50px";
        ripple.style.marginTop = "-50px";
        ripple.style.pointerEvents = "none";

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
