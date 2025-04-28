// Utility to get DOM elements
const $ = (id) => document.getElementById(id);

// Constants
const URL_REGEX = /^https?:\/\/.+/;
const ALIAS_REGEX = /^[a-zA-Z0-9_-]+$/;

function setLoading(isLoading) {
  const btn = $("shorten-btn");
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Shortening..." : "Shorten URL";
}

function showError(message) {
  const errorDiv = $("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  errorDiv.focus();
}

function clearError() {
  const errorDiv = $("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

function isValidURL(url) {
  try {
    new URL(url);
    return URL_REGEX.test(url);
  } catch {
    return false;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  clearError();
  
  const url = $("url").value.trim();
  const alias = $("alias").value.trim();

  if (!url) {
    showError("Please enter a URL.");
    $("url").focus();
    return;
  }
  
  if (!isValidURL(url)) {
    showError("Please enter a valid URL (including http:// or https://).");
    $("url").focus();
    return;
  }
  
  if (alias && !ALIAS_REGEX.test(alias)) {
    showError("Alias can only contain letters, numbers, hyphens, and underscores.");
    $("alias").focus();
    return;
  }

  await shortenURL(url, alias);
}

async function shortenURL(url, alias) {
  setLoading(true);
  
  try {
    const response = await fetch("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, alias: alias || "" }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      showError(data.error);
    } else {
      const shortURL = data.short_url;
      $("result").innerHTML = 
        `Shortened URL: <a href="${shortURL}" target="_blank" rel="noopener noreferrer">${shortURL}</a>`;
      
      await saveToFirebase(alias || shortURL.split("/").pop(), url, shortURL);
    }
  } catch (error) {
    showError("An error occurred. Please try again later.");
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
}

async function saveToFirebase(alias, originalURL, shortURL) {
  const data = {
    original: originalURL,
    short: shortURL,
    createdAt: new Date().toISOString(),
  };

  const success = await window.firebase.writeData(`urls/${alias}`, data);
  if (!success) {
    console.warn('Failed to save to Firebase');
  }
}

async function generateQR(url) {
  if (!url) {
    showError("Please enter a URL first.");
    return;
  }

  if (!isValidURL(url)) {
    showError("Please enter a valid URL.");
    return;
  }

  try {
    const qrImage = $("qr-image");
    const popup = $("qr-popup");
    
    // Show loading state
    qrImage.src = "";
    popup.classList.remove("hidden");
    popup.setAttribute("aria-hidden", "false");
    
    const response = await fetch("/generate_qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      showError(data.error);
      popup.classList.add("hidden");
    } else {
      // Add cache-busting query param and error handling
      qrImage.onload = function() {
        console.log("QR code image loaded successfully");
      };
      
      qrImage.onerror = function() {
        console.error("Failed to load QR code image");
        showError("Failed to load QR code image. Please try again.");
        popup.classList.add("hidden");
      };
      
      qrImage.src = data.qr_code + '?t=' + new Date().getTime();
    }
  } catch (error) {
    showError("QR generation failed. Please try again.");
    console.error("QR generation failed:", error);
    $("qr-popup").classList.add("hidden");
  }
}

function closePopup() {
  const popup = $("qr-popup");
  popup.classList.add("hidden");
  popup.setAttribute("aria-hidden", "true");
  $("shorten-btn").focus();
}

function handleKeyPress(event) {
  if (event.key === "Escape") {
    closePopup();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("url-form");
  form.addEventListener("submit", handleFormSubmit);
  
  $("qr-btn").addEventListener("click", () => {
    const url = $("url").value.trim();
    generateQR(url);
  });
  
  $("close-qr").addEventListener("click", closePopup);
  $("close-qr").addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      closePopup();
    }
  });
  
  document.addEventListener("keydown", handleKeyPress);
});
