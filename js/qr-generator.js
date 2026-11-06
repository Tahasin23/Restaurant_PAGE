
/* =========================================
   JUNIPER & STONE
   QR CODE GENERATOR
========================================= */


/* 1. GET HTML ELEMENTS */

const qrForm = document.getElementById("qrForm");

const menuUrlInput = document.getElementById("menuUrl");

const qrCodeContainer = document.getElementById("qrCode");

const qrResult = document.getElementById("qrResult");

const qrStatus = document.getElementById("qrStatus");

const qrUrlText = document.getElementById("qrUrlText");

const downloadQrBtn = document.getElementById("downloadQrBtn");


/* 2. STORE CURRENT QR CODE URL */

let currentMenuUrl = "";


/* 3. VALIDATE MENU URL */

function validateMenuUrl(value) {

    try {

        const url = new URL(value);

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            return {
                valid: false,
                message: "Please enter a valid HTTP or HTTPS URL."
            };
        }

        const hostname = url.hostname.toLowerCase();

        const isLocalhost =
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "::1" ||
            hostname.endsWith(".local");

        const isPrivateIp =
            /^10\./.test(hostname) ||
            /^192\.168\./.test(hostname) ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
            /^127\./.test(hostname);

        if (isLocalhost || isPrivateIp) {

            return {
                valid: false,
                message: "Local development URLs cannot be used for customer QR codes. Please use your public website URL after hosting."
            };

        }

        return {
            valid: true,
            url: url.href
        };

    } catch (error) {

        return {
            valid: false,
            message: "Please enter a valid website URL."
        };

    }

}


/* 4. GENERATE QR CODE */

function generateQRCode(url) {

    if (typeof QRCode === "undefined") {

        qrStatus.textContent =
            "QR library could not load. Check your internet connection and refresh.";

        return;

    }

    // Clear previous QR code

    qrCodeContainer.innerHTML = "";

    // Create new QR code

    new QRCode(qrCodeContainer, {

        text: url,

        width: 280,

        height: 280,

        colorDark: "#183b32",

        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.H

    });


    // Store URL

    currentMenuUrl = url;


    // Display result

    qrResult.hidden = false;

    qrUrlText.textContent = url;

    downloadQrBtn.disabled = false;

    qrStatus.textContent =
        "Your QR code has been generated successfully!";

}


/* 5. HANDLE FORM SUBMISSION */

qrForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const enteredUrl = menuUrlInput.value.trim();

    const validation = validateMenuUrl(enteredUrl);

    if (!validation.valid) {

        qrResult.hidden = true;

        qrCodeContainer.innerHTML = "";

        downloadQrBtn.disabled = true;

        qrStatus.textContent = validation.message;

        return;

    }

    generateQRCode(validation.url);

});


/* 6. DOWNLOAD QR CODE */

downloadQrBtn.addEventListener("click", function() {

    if (!currentMenuUrl) {

        qrStatus.textContent =
            "Please generate a QR code first.";

        return;

    }

    const canvas = qrCodeContainer.querySelector("canvas");

    const image = qrCodeContainer.querySelector("img");

    let imageData = null;


    // Get image from canvas

    if (canvas) {

        imageData = canvas.toDataURL("image/png");

    }

    // Fallback for image-based rendering

    else if (image && image.src.startsWith("data:image")) {

        imageData = image.src;

    }


    if (!imageData) {

        qrStatus.textContent =
            "QR code is not ready yet. Please try again.";

        return;

    }


    // Create download link

    const downloadLink = document.createElement("a");

    downloadLink.href = imageData;

    downloadLink.download = "Juniper-Stone-Menu-QR.png";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();


    qrStatus.textContent =
        "Your QR code has been downloaded!";

});


/* 7. INITIALIZE */

console.log("Juniper & Stone QR Generator initialized successfully!");
