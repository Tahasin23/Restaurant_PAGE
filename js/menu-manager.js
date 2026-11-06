
/* =========================================
   JUNIPER & STONE
   OWNER MENU MANAGEMENT
========================================= */

const menuForm = document.getElementById("menuItemForm");
const itemName = document.getElementById("itemName");
const itemCategory = document.getElementById("itemCategory");
const itemPrice = document.getElementById("itemPrice");
const itemDescription = document.getElementById("itemDescription");
const itemImageUrl = document.getElementById("itemImageUrl");
const itemImageFile = document.getElementById("itemImageFile");

const managedMenuList = document.getElementById("managedMenuList");
const managerStatus = document.getElementById("managerStatus");
const formTitle = document.getElementById("formTitle");
const saveItemBtn = document.getElementById("saveItemBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

let editingItemId = null;
let selectedImageData = "";
let currentItems = [];


/* SAFE HTML */

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


/* IMAGE URL VALIDATION */

function validateImageUrl(value) {

    try {

        const url = new URL(value);

        return url.protocol === "https:" || url.protocol === "http:";

    } catch {

        return false;

    }

}


/* LOAD MENU */

function loadMenuItems() {

    currentItems = window.MenuStore.getItems();

    renderMenuItems();

}


/* SUMMARY */

function updateSummary() {

    const total = currentItems.length;

    const available = currentItems.filter(
        item => item.available !== false
    ).length;

    document.getElementById("totalItems").textContent = total;

    document.getElementById("availableItems").textContent = available;

    document.getElementById("unavailableItems").textContent =
        total - available;

    document.getElementById("itemCount").textContent =
        `${total} ${total === 1 ? "item" : "items"}`;

}


/* DISPLAY FOOD ITEMS */

function renderMenuItems() {

    updateSummary();

    if (currentItems.length === 0) {

        managedMenuList.innerHTML = `
            <div class="empty-manager">
                No food items available. Add your first dish above.
            </div>
        `;

        return;

    }

    managedMenuList.innerHTML = currentItems.map(item => {

        const name = escapeHTML(item.name);
        const description = escapeHTML(item.description);
        const category = escapeHTML(item.category);
        const image = escapeHTML(item.image);

        const price = Number(item.price).toFixed(2);

        const isAvailable = item.available !== false;

        return `

            <article class="managed-menu-item">

                <img
                    src="${image}"
                    alt="${name}"
                    class="managed-menu-image"
                    loading="lazy"
                >

                <div class="managed-menu-info">

                    <h3>${name}</h3>

                    <p>${description}</p>

                    <div class="managed-menu-meta">

                        <span class="managed-menu-price">
                            $${price}
                        </span>

                        <span class="managed-menu-category">
                            ${category.toUpperCase()}
                        </span>

                        <span class="availability-badge ${isAvailable ? "available" : "unavailable"}">
                            ${isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                        </span>

                    </div>

                </div>

                <div class="managed-menu-actions">

                    <button type="button"
                        data-action="edit"
                        data-id="${Number(item.id)}">
                        Edit
                    </button>

                    <button type="button"
                        data-action="toggle"
                        data-id="${Number(item.id)}">
                        ${isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </button>

                    <button type="button"
                        class="delete-item-btn"
                        data-action="delete"
                        data-id="${Number(item.id)}">
                        Delete
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


/* IMAGE PREVIEW */

function showImagePreview(source) {

    if (!source) {

        imagePreviewContainer.hidden = true;
        imagePreview.removeAttribute("src");

        return;

    }

    imagePreview.src = source;
    imagePreviewContainer.hidden = false;

}


/* IMAGE COMPRESSION */

function compressImage(file) {

    return new Promise((resolve, reject) => {

        if (!file.type.startsWith("image/")) {

            reject(new Error("Please select an image file."));
            return;

        }

        const objectURL = URL.createObjectURL(file);
        const image = new Image();

        image.onload = function() {

            const maxWidth = 1000;
            const maxHeight = 800;

            let width = image.naturalWidth;
            let height = image.naturalHeight;

            const scale = Math.min(
                1,
                maxWidth / width,
                maxHeight / height
            );

            width = Math.round(width * scale);
            height = Math.round(height * scale);

            const canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, width, height);

            context.drawImage(image, 0, 0, width, height);

            const compressedImage = canvas.toDataURL(
                "image/jpeg",
                0.75
            );

            URL.revokeObjectURL(objectURL);

            resolve(compressedImage);

        };

        image.onerror = function() {

            URL.revokeObjectURL(objectURL);

            reject(new Error("Could not process this image."));

        };

        image.src = objectURL;

    });

}


/* UPLOAD IMAGE */

itemImageFile.addEventListener("change", async function() {

    const file = this.files[0];

    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {

        alert("Please choose an image smaller than 8 MB.");

        this.value = "";

        return;

    }

    managerStatus.textContent = "Processing photograph...";

    try {

        selectedImageData = await compressImage(file);

        itemImageUrl.value = "";

        showImagePreview(selectedImageData);

        managerStatus.textContent =
            "Photograph uploaded and optimized successfully.";

    } catch (error) {

        selectedImageData = "";

        managerStatus.textContent = error.message;

    }

});


/* IMAGE URL PREVIEW */

itemImageUrl.addEventListener("input", function() {

    selectedImageData = "";

    itemImageFile.value = "";

    const url = this.value.trim();

    if (url && validateImageUrl(url)) {

        showImagePreview(url);

    } else {

        showImagePreview("");

    }

});


/* RESET FORM */

function resetMenuForm() {

    menuForm.reset();

    editingItemId = null;
    selectedImageData = "";

    formTitle.textContent = "Add New Food Item";

    saveItemBtn.textContent = "+ Add Food Item";

    cancelEditBtn.hidden = true;

    showImagePreview("");

    managerStatus.textContent = "";

}


/* ADD OR UPDATE ITEM */

menuForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const wasEditing = editingItemId !== null;

    const name = itemName.value.trim();
    const category = itemCategory.value;
    const price = Number(itemPrice.value);
    const description = itemDescription.value.trim();

    if (
        !name ||
        !description ||
        !Number.isFinite(price) ||
        price < 0 ||
        price > 999999
    ) {

        managerStatus.textContent =
            "Please enter valid food details and price.";

        return;

    }

    const existingItem = wasEditing
        ? currentItems.find(item => item.id === editingItemId)
        : null;

    let image = selectedImageData || itemImageUrl.value.trim();

    if (image && !selectedImageData && !validateImageUrl(image)) {

        managerStatus.textContent =
            "Please enter a valid HTTP or HTTPS image URL.";

        return;

    }

    if (!image && existingItem) {

        image = existingItem.image;

    }

    if (!image) {

        image = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

    }

    const updatedItem = {

        id: wasEditing ? editingItemId : Date.now(),

        name,
        category,
        price,
        description,
        image,

        available: existingItem
            ? existingItem.available !== false
            : true

    };

    let updatedItems;

    if (wasEditing) {

        updatedItems = currentItems.map(item => {

            return item.id === editingItemId
                ? updatedItem
                : item;

        });

    } else {

        updatedItems = [...currentItems, updatedItem];

    }

    const savedItems = window.MenuStore.saveItems(updatedItems);

    if (!savedItems) {

        managerStatus.textContent =
            "Could not save. Browser storage may be full.";

        return;

    }

    currentItems = savedItems;

    renderMenuItems();

    resetMenuForm();

    alert(
        wasEditing
            ? "Food item updated successfully!"
            : "Food item added successfully!"
    );

});


/* EDIT ITEM */

function editMenuItem(id) {

    const item = currentItems.find(item => item.id === id);

    if (!item) return;

    editingItemId = id;

    itemName.value = item.name;
    itemCategory.value = item.category;
    itemPrice.value = item.price;
    itemDescription.value = item.description;

    if (item.image.startsWith("data:")) {

        itemImageUrl.value = "";

    } else {

        itemImageUrl.value = item.image;

    }

    selectedImageData = "";
    itemImageFile.value = "";

    showImagePreview(item.image);

    formTitle.textContent = "Edit Food Item";
    saveItemBtn.textContent = "Save Changes";

    cancelEditBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* TOGGLE AVAILABILITY */

function toggleAvailability(id) {

    const updatedItems = currentItems.map(item => {

        if (item.id === id) {

            return {
                ...item,
                available: item.available === false
            };

        }

        return item;

    });

    const savedItems = window.MenuStore.saveItems(updatedItems);

    if (!savedItems) return;

    currentItems = savedItems;

    renderMenuItems();

}


/* DELETE ITEM */

function deleteMenuItem(id) {

    const item = currentItems.find(item => item.id === id);

    if (!item) return;

    const confirmed = confirm(
        `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    const updatedItems = currentItems.filter(
        item => item.id !== id
    );

    const savedItems = window.MenuStore.saveItems(updatedItems);

    if (!savedItems) return;

    currentItems = savedItems;

    renderMenuItems();

    if (editingItemId === id) {

        resetMenuForm();

    }

}


/* ITEM ACTIONS */

managedMenuList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {

        editMenuItem(id);

    }

    if (action === "toggle") {

        toggleAvailability(id);

    }

    if (action === "delete") {

        deleteMenuItem(id);

    }

});


/* CANCEL EDITING */

cancelEditBtn.addEventListener("click", resetMenuForm);


/* OTHER TAB UPDATES */

window.addEventListener("storage", function(event) {

    if (event.key === window.MenuStore.storageKey) {

        loadMenuItems();

    }

});


/* INITIALIZE */

loadMenuItems();

console.log("Juniper & Stone Menu Management Ready!");
