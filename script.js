/* ==========================================================================
   Dr. Satveer Singh - Portfolio Interactive JavaScript logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // Theme Toggler Logic (Dark / Light Mode)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;

    // Check localStorage or system preference for theme selection
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme) {
            return savedTheme;
        }
        // Use system settings default if no user selection is saved
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem("portfolio-theme", theme);
    };

    // Apply theme on load
    setTheme(getSavedTheme());

    // Toggle theme on button click
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    });

    // --------------------------------------------------------------------------
    // Mobile Drawer Navigation Toggler
    // --------------------------------------------------------------------------
    const mobileToggleBtn = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle menu visibility
    mobileToggleBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        
        // Toggle mobile menu icon between Menu and X if needed
        const icon = mobileToggleBtn.querySelector("i");
        if (icon) {
            const currentIcon = icon.getAttribute("data-lucide");
            if (currentIcon === "menu") {
                icon.setAttribute("data-lucide", "x");
            } else {
                icon.setAttribute("data-lucide", "menu");
            }
            lucide.createIcons();
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = mobileToggleBtn.querySelector("i");
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!mobileToggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = mobileToggleBtn.querySelector("i");
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            }
        }
    });

    // --------------------------------------------------------------------------
    // Publications Filter and Search System
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll(".pub-tab-btn");
    const pubSearchInput = document.getElementById("pubSearch");
    const pubItems = document.querySelectorAll(".pub-item");
    const pubListContainer = document.getElementById("pubList");

    // Create a "No results found" feedback element
    const noResultsEl = document.createElement("div");
    noResultsEl.className = "pub-item no-results-placeholder hidden";
    noResultsEl.style.justifyContent = "center";
    noResultsEl.style.textAlign = "center";
    noResultsEl.style.padding = "40px";
    noResultsEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-tertiary);">
            <i data-lucide="info" style="width: 32px; height: 32px;"></i>
            <p style="font-weight: 500;">No publications match your filter or search query.</p>
        </div>
    `;
    pubListContainer.appendChild(noResultsEl);
    lucide.createIcons();

    let currentFilter = "all";
    let searchQuery = "";

    const filterPublications = () => {
        let visibleCount = 0;

        pubItems.forEach(item => {
            const itemType = item.getAttribute("data-type");
            const itemTitle = item.querySelector(".pub-title").textContent.toLowerCase();
            const itemAuthors = item.querySelector(".pub-authors").textContent.toLowerCase();
            const itemVenue = item.querySelector(".pub-venue").textContent.toLowerCase();
            
            // Match Filter Type
            const matchesFilter = currentFilter === "all" || itemType === currentFilter;
            
            // Match Search Query
            const matchesSearch = searchQuery === "" || 
                                  itemTitle.includes(searchQuery) || 
                                  itemAuthors.includes(searchQuery) || 
                                  itemVenue.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                item.classList.remove("hidden");
                visibleCount++;
            } else {
                item.classList.add("hidden");
            }
        });

        // Toggle "No results" message
        if (visibleCount === 0) {
            noResultsEl.classList.remove("hidden");
        } else {
            noResultsEl.classList.add("hidden");
        }
    };

    // Filter Button Handler
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active status from sibling buttons
            filterButtons.forEach(button => button.classList.remove("active"));
            
            // Set current active button
            btn.classList.add("active");
            
            // Update filter value and process list
            currentFilter = btn.getAttribute("data-filter");
            filterPublications();
        });
    });

    // Search Input Handler
    pubSearchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterPublications();
    });

    // --------------------------------------------------------------------------
    // Scroll Spy: Highlight nav menu links on scroll
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll("section.scroll-margin");

    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 150; // offset for nav trigger height

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    window.addEventListener("scroll", scrollSpy);
    // Trigger scroll spy on page load to set correct initial active link
    scrollSpy();

    // Typewriter Effect
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        const words = ["Cloud Computing", "Fog Computing", "Internet of Things (IoT)", "Machine Learning"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typeSpeed);
        };
        
        // Start typing
        type();
    }
});

// --------------------------------------------------------------------------
// Contact Form Submission Handler
// --------------------------------------------------------------------------
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById("formName").value;
    const email = document.getElementById("formEmail").value;
    const subject = document.getElementById("formSubject").value;
    const message = document.getElementById("formMessage").value;
    const statusMsg = document.getElementById("formStatus");
    const submitBtn = event.target.querySelector(".submit-btn");
    
    // Disable submit button and show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i data-lucide="loader" class="spin-icon"></i>`;
    lucide.createIcons();

    // Style loader spinning action
    const spinIcon = submitBtn.querySelector(".spin-icon");
    if (spinIcon) {
        spinIcon.style.animation = "spinPulse 1.2s linear infinite";
    }

    // Mock API call transition (1.5 seconds)
    setTimeout(() => {
        // Build email mailto link trigger in background to assist direct communication
        const mailtoLink = `mailto:satveersingh.1339@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        
        // Show success message
        statusMsg.classList.remove("hidden");
        statusMsg.className = "form-status-message success";
        statusMsg.innerHTML = `<strong>Thank you, ${name}!</strong> Your message is ready. Opening your default mail client...`;
        
        // Reset Form
        document.getElementById("contactForm").reset();
        
        // Restore submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();

        // Launch mail application after message display
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            statusMsg.classList.add("hidden");
        }, 6000);
    }, 1500);
}

// Global keyframe for submit button spin loading
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spinPulse {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

// Expandable Abstract Handler for Patents
function toggleAbstract(button) {
    button.classList.toggle("active");
    const content = button.nextElementSibling;
    const isHidden = content.classList.contains("hidden");
    
    if (isHidden) {
        content.classList.remove("hidden");
        button.querySelector("span").textContent = "Hide Abstract";
    } else {
        content.classList.add("hidden");
        button.querySelector("span").textContent = "Show Abstract";
    }
}
