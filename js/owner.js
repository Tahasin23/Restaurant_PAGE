
/* =========================================
   JUNIPER & STONE
   OWNER DASHBOARD SESSION MANAGEMENT
========================================= */

const SESSION_KEY = "juniperDemoOwnerAuthenticated";


/* 1. CHECK OWNER AUTHENTICATION */

if (localStorage.getItem(SESSION_KEY) !== "true") {

    window.location.replace("owner-login.html");

}


/* 2. HANDLE LOGOUT */

document.addEventListener("DOMContentLoaded", function() {

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function() {

            localStorage.removeItem(SESSION_KEY);

            window.location.replace("owner-login.html");

        });

    }

});


console.log("Juniper & Stone Owner Session Initialized.");
