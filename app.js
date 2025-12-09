// ===============================
// iOS SAFARI SAFE AR CONTROLLER
// ===============================

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// ===========================
// Camera check only (NO lock)
// ===========================
async function requestCameraPermission() {
  const status = document.getElementById('permission-status');

  try {
    await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
      audio: false
    });

    status.textContent = "✅ Камера разрешена";
    status.className = "permission-status status-success";

    startAR();

  } catch (err) {
    console.error(err);

    status.innerHTML =
      "❌ Камера не разрешена<br>" +
      "Safari: «aA → Настройки сайта → Камера → Разрешить»";

    status.className = "permission-status status-error";
  }
}

// ===========================
// Start AR correctly
// ===========================

function startAR() {
  document.getElementById("camera-prep").style.display = "none";
  document.getElementById("ar-scene-container").style.display = "block";

  const scene = document.querySelector("a-scene");

  const bootAR = () => {
    const arSystem = scene.systems["mindar-image-system"];

    arSystem.start().then(() => {
      console.log("✅ AR запущен");
      document.getElementById("ar-status").textContent =
        "Наведите камеру на маркер";
    });

  };

  if (scene.hasLoaded) bootAR();
  else scene.addEventListener("loaded", bootAR);
}

// ===========================
// UI
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn")
    .addEventListener("click", () => {
      document.getElementById("camera-prep").style.display = "block";
    });

  document.getElementById("enable-camera-btn")
    .addEventListener("click", requestCameraPermission);
});
