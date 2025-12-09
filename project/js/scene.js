document.addEventListener('DOMContentLoaded', () => {

  const scene = document.querySelector('a-scene');
  const model = document.getElementById('model-container');
  const ring = document.getElementById('interaction-ring');

  const moveBtn   = document.getElementById('move-btn');
  const rotateBtn = document.getElementById('rotate-btn');
  const scaleBtn  = document.getElementById('scale-btn');
  const resetBtn  = document.getElementById('reset-btn');

  let currentMode = "move";
  let dragging = false;
  let startX, startY;

  // ===================
  // AR events
  // ===================
  scene.addEventListener("mindar-target-found", () => {
    document.getElementById('detection-sound').components.sound.playSound();

    ring.setAttribute("visible", true);
    ring.setAttribute("animation", {
      property: "opacity",
      from: 0.3,
      to: 0.7,
      dur: 1000,
      loop: true,
      dir: "alternate"
    });
  });

  scene.addEventListener("mindar-target-lost", () => {
    ring.setAttribute("visible", false);
  });

  // ===================
  // Buttons
  // ===================
  moveBtn.onclick   = () => setMode("move");
  rotateBtn.onclick = () => setMode("rotate");
  scaleBtn.onclick  = () => setMode("scale");
  resetBtn.onclick  = resetModel;

  function setMode(m) {
    currentMode = m;
    document.querySelectorAll(".control-btn")
      .forEach(b => b.classList.remove("active"));

    document.getElementById(`${m}-btn`)
      .classList.add("active");
  }

  // ===================
  // Touch + mouse
  // ===================
  model.addEventListener("touchstart", start, { passive:false });
  model.addEventListener("touchmove", move, { passive:false });
  model.addEventListener("touchend", stop);

  model.addEventListener("mousedown", start);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stop);

  function start(e) {
    e.preventDefault();
    dragging = true;

    const t = e.touches ? e.touches[0] : e;
    startX = t.clientX;
    startY = t.clientY;
  }

  function move(e) {
    if (!dragging) return;
    e.preventDefault();

    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    const p = model.getAttribute("position");
    const r = model.getAttribute("rotation");
    const s = model.getAttribute("scale");

    const k = 0.01;

    if (currentMode === "move") {
      model.setAttribute("position", {
        x: p.x + dx*k,
        y: p.y - dy*k,
        z: p.z
      });
    }

    if (currentMode === "rotate") {
      model.setAttribute("rotation", {
        x: r.x + dy*k*50,
        y: r.y + dx*k*50,
        z: r.z
      });
    }

    if (currentMode === "scale") {
      const ns = Math.max(0.05, s.x * (1 + dy*k));
      model.setAttribute("scale", `${ns} ${ns} ${ns}`);
    }

    startX = t.clientX;
    startY = t.clientY;
  }

  function stop() {
    dragging = false;
    document.getElementById('interaction-sound').components.sound.playSound();
  }

  function resetModel() {
    model.setAttribute("position", "0 0 0");
    model.setAttribute("rotation", "0 0 0");
    model.setAttribute("scale", "0.1 0.1 0.1");
    setMode("move");
  }

});
