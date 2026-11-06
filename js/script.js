
/* =========================================
   JUNIPER & STONE
   MAIN WEBSITE FUNCTIONALITY
========================================= */


/* 1. GET HTML ELEMENTS */

const menuGrid = document.getElementById("menuGrid");

const categoryButtons = document.querySelectorAll(".category-btn");

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

const copyEmailBtn = document.getElementById("copyEmailBtn");

const copyFeedback = document.getElementById("copyFeedback");

const menuBackLink = document.getElementById("menuBackLink");


/* =========================================
   2. SMART MENU PREVIEW NAVIGATION
========================================= */

if (menuBackLink) {

    const urlParameters = new URLSearchParams(
        window.location.search
    );

    const openedFrom = urlParameters.get("from");

    if (openedFrom === "manager") {

        menuBackLink.href = "menu-manager.html";

        menuBackLink.textContent = "← Back to Menu Management";

    } else {

        menuBackLink.href = "index.html";

        menuBackLink.textContent = "Back to Website";

    }

}


/* =========================================
   3. MENU VARIABLES
========================================= */

let allMenuItems = [];

let activeCategory = "all";


/* =========================================
   4. SAFE HTML TEXT
========================================= */

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


/* =========================================
   5. DISPLAY MENU ITEMS
========================================= */

function displayMenu(items) {

    if (!menuGrid) return;

    if (items.length === 0) {

        menuGrid.innerHTML = `
            <p class="empty-menu">
                No menu items available in this category.
            </p>
        `;

        return;

    }


    menuGrid.innerHTML = items.map(item => {

        const name = escapeHTML(item.name);

        const description = escapeHTML(item.description);

        const image = escapeHTML(item.image);

        const category = escapeHTML(item.category);

        const price = Number(item.price).toFixed(2);

        const unavailable = item.available === false;


        return `

            <article class="menu-card ${unavailable ? "menu-card-unavailable" : ""}">

                <img
                    src="${image}"
                    alt="${name}"
                    class="menu-card-image"
                    loading="lazy"
                >

                <div class="menu-card-info">

                    <div class="menu-card-top">

                        <h3 class="menu-card-title">
                            ${name}
                        </h3>

                        <span class="menu-card-price">
                            $${price}
                        </span>

                    </div>

                    <p class="menu-card-description">
                        ${description}
                    </p>

                    <span class="menu-card-category">
                        ${category.toUpperCase()}
                    </span>

                    ${unavailable ? `
                        <p class="menu-item-unavailable">
                            Currently Unavailable
                        </p>
                    ` : ""}

                </div>

            </article>

        `;

    }).join("");

}


/* =========================================
   6. LOAD SHARED MENU DATA
========================================= */

function loadMenuData() {

    if (!menuGrid) return;

    if (!window.MenuStore) {

        console.error(
            "MenuStore not found. Check menu-data.js loading order."
        );

        menuGrid.innerHTML = `
            <p class="empty-menu">
                Unable to load the menu. Please refresh the page.
            </p>
        `;

        return;

    }

    allMenuItems = window.MenuStore.getItems();

    filterMenu(activeCategory);

}


/* =========================================
   7. FILTER MENU ITEMS
========================================= */

function filterMenu(category) {

    activeCategory = category;

    let filteredItems;


    if (category === "all") {

        filteredItems = allMenuItems;

    } else {

        filteredItems = allMenuItems.filter(item => {

            return item.category === category;

        });

    }

    displayMenu(filteredItems);

}


/* =========================================
   8. CATEGORY BUTTONS
========================================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

            btn.setAttribute("aria-pressed", "false");

        });


        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");


        const selectedCategory = button.dataset.category;

        filterMenu(selectedCategory);

    });

});


/* =========================================
   9. AUTOMATIC MENU UPDATES
========================================= */

window.addEventListener("juniperMenuUpdated", () => {

    loadMenuData();

});


window.addEventListener("storage", event => {

    if (
        event.key === "juniperStoneMenuItems" &&
        event.newValue !== null
    ) {

        loadMenuData();

    }

});


/* =========================================
   10. MOBILE NAVIGATION
========================================= */

if (menuToggle && navLinks) {

    menuToggle.setAttribute("aria-expanded", "false");


    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================
   11. COPY EMAIL FUNCTIONALITY
========================================= */

async function copyRestaurantEmail() {

    if (!copyEmailBtn || !copyFeedback) return;

    const email = copyEmailBtn.dataset.email;

    if (!email) return;


    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(email);

        } else {

            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = email;

            temporaryInput.style.position = "fixed";

            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);

            temporaryInput.select();

            const copied = document.execCommand("copy");

            temporaryInput.remove();

            if (!copied) {

                throw new Error("Clipboard copy failed");

            }

        }


        copyFeedback.textContent =
            "Email address copied successfully!";

        copyEmailBtn.textContent = "Copied!";


        setTimeout(() => {

            copyEmailBtn.textContent = "Copy Email";

            copyFeedback.textContent = "";

        }, 2500);


    } catch (error) {

        console.error("Email copy failed:", error);

        copyFeedback.textContent =
            "Copy failed. Please copy the email address manually.";

    }

}


if (copyEmailBtn) {

    copyEmailBtn.addEventListener(
        "click",
        copyRestaurantEmail
    );

}


/* =========================================
   12. INITIALIZE WEBSITE
========================================= */

loadMenuData();


categoryButtons.forEach(button => {

    button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false"
    );

});


console.log("Juniper & Stone website initialized successfully!");
