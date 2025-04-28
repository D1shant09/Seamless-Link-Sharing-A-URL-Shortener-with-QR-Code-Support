function shortenURL() {
  const url = document.getElementById("url").value;
  const alias = document.getElementById("alias").value;

  fetch("/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ url, alias: alias || "" }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const shortURL = data.short_url;

        document.getElementById("result").innerHTML =
          `Shortened URL: <a href="${shortURL}" target="_blank">${shortURL}</a>`;

        // ✅ Save to Firebase
        saveToFirebase(alias || shortURL.split("/").pop(), url, shortURL);

        // ✅ Generate QR
        generateQR(shortURL);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function saveToFirebase(alias, originalURL, shortURL) {
  // Use the globally available Firebase object
  firebase.database().ref("urls/" + alias).set({
    original: originalURL,
    short: shortURL,
    createdAt: new Date().toISOString(),
  });
}

function generateQR(url) {
  fetch("/generate_qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const qrImage = document.getElementById("qr-image");
        const popup = document.getElementById("qr-popup");
        qrImage.src = data.qr_code;
        popup.classList.remove("hidden");
      }
    })
    .catch((err) => {
      console.error("QR generation failed:", err);
    });
}

function closePopup() {
  document.getElementById("qr-popup").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("shorten-btn").addEventListener("click", shortenURL);

  document.getElementById("qr-btn").addEventListener("click", () => {
    const resultLink = document.querySelector("#result a");
    if (resultLink) {
      generateQR(resultLink.href);
    } else {
      alert("Please shorten a URL first.");
    }
  });

  document.getElementById("close-qr").addEventListener("click", closePopup);
});
