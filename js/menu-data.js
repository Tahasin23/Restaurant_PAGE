
/* =========================================
   JUNIPER & STONE
   SHARED MENU DATA STORE
========================================= */

(function () {

    const STORAGE_KEY = "juniperStoneMenuItems";


    // DEFAULT RESTAURANT MENU

    const defaultMenuItems = [

        // STARTERS

        {
            id: 1,
            name: "Whipped Feta & Herbs",
            category: "starters",
            price: 12,
            description: "Creamy whipped feta, fresh herbs, olive oil and toasted sourdough.",
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
            available: true
        },

        {
            id: 2,
            name: "Crispy Calamari",
            category: "starters",
            price: 14,
            description: "Golden crispy calamari served with fresh lemon and house dipping sauce.",
            image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80",
            available: true
        },


        // MAIN COURSE

        {
            id: 3,
            name: "Herb-Roasted Chicken",
            category: "mains",
            price: 24,
            description: "Tender roasted chicken with seasonal vegetables and herb butter.",
            image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80",
            available: true
        },

        {
            id: 4,
            name: "Wild Mushroom Pasta",
            category: "mains",
            price: 21,
            description: "Fresh pasta tossed with wild mushrooms, parmesan and creamy sauce.",
            image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
            available: true
        },

        {
            id: 5,
            name: "Stone-Fired Salmon",
            category: "mains",
            price: 27,
            description: "Pan-seared salmon with seasonal greens and lemon butter sauce.",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
            available: true
        },


        // DESSERTS

        {
            id: 6,
            name: "Chocolate Fondant",
            category: "desserts",
            price: 10,
            description: "Warm chocolate cake with a rich molten centre.",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
            available: true
        },

        {
            id: 7,
            name: "Lemon Olive Oil Cake",
            category: "desserts",
            price: 9,
            description: "Soft lemon cake with a delicate citrus glaze.",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
            available: true
        },


        // DRINKS

        {
            id: 8,
            name: "Juniper Citrus Spritz",
            category: "drinks",
            price: 8,
            description: "Refreshing citrus, sparkling water and fresh seasonal fruit.",
            image: "https://images.unsplash.com/photo-1717250180315-81b49709a74e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
            available: true
        },

        {
            id: 9,
            name: "Iced Vanilla Latte",
            category: "drinks",
            price: 6,
            description: "Smooth espresso, chilled milk and a touch of vanilla.",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
            available: true
        }

    ];


    // NORMALIZE MENU DATA

    function normalizeItems(items) {

        return items.map((item, index) => ({

            ...item,

            id: item.id ?? Date.now() + index,

            price: Number(item.price) || 0,

            available: item.available !== false

        }));

    }


    // GET MENU ITEMS

    function getItems() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData !== null) {

                const parsedData = JSON.parse(savedData);

                if (Array.isArray(parsedData)) {

                    return normalizeItems(parsedData);

                }

            }

        } catch (error) {

            console.error("Could not load menu data:", error);

        }


        // FIRST-TIME INITIALIZATION

        const initialItems = normalizeItems(defaultMenuItems);

        saveItems(initialItems);

        return initialItems;

    }


    // SAVE MENU ITEMS

    function saveItems(items) {

        try {

            const normalizedItems = normalizeItems(items);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(normalizedItems)
            );

            // Notify other website scripts

            window.dispatchEvent(

                new CustomEvent("juniperMenuUpdated", {

                    detail: normalizedItems

                })

            );

            return normalizedItems;

        } catch (error) {

            console.error("Could not save menu data:", error);

            alert(
                "Unable to save menu data. Browser storage may be full."
            );

            return null;

        }

    }


    // PUBLIC MENU STORE

    window.MenuStore = {

        getItems: getItems,

        saveItems: saveItems,

        storageKey: STORAGE_KEY

    };


    console.log("Juniper & Stone Menu Store initialized.");

})();
