
/* =====================================
   JUNIPER & STONE
   DEMONSTRATION OWNER LOGIN
===================================== */


/* 1. DEMO CREDENTIALS */

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "demo123";


/* 2. SHARED LOGIN SESSION KEY */

const SESSION_KEY = "juniperDemoOwnerAuthenticated";


/* 3. GET HTML ELEMENTS */

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const loginError = document.getElementById("loginError");


/* 4. CHECK EXISTING LOGIN */

try {

    const isAuthenticated = localStorage.getItem(SESSION_KEY);

    if (isAuthenticated === "true") {

        window.location.replace("owner.html");

    }

} catch (error) {

    console.error("Could not access login storage:", error);

    loginError.textContent =
        "Browser storage is unavailable. Please enable local storage.";

}


/* 5. HANDLE LOGIN */

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = usernameInput.value.trim();

    const password = passwordInput.value;


    /* CHECK DEMO CREDENTIALS */

    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {

        try {

            /* SAVE LOGIN SESSION */

            localStorage.setItem(SESSION_KEY, "true");


            /* CLEAR ERROR */

            loginError.textContent = "";


            /* REDIRECT TO DASHBOARD */

            window.location.replace("owner.html");

        } catch (error) {

            console.error("Login session could not be saved:", error);

            loginError.textContent =
                "Could not save your login. Please check browser storage.";

        }

    } else {

        loginError.textContent =
            "Incorrect username or password. Please try again.";

        passwordInput.value = "";

        passwordInput.focus();

    }

});


/* 6. INITIALIZATION */

console.log("Juniper & Stone Owner Login Ready.");
