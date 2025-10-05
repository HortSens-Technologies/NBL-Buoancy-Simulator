//shit

(() => {
  //  awdii some refs 
  const canvas = document.getElementById("pool");
  const ctx = canvas.getContext("2d");

  const ui = {
    // Environment
    temp: document.getElementById("temp"),
    tempVal: document.getElementById("tempVal"),
    salinity: document.getElementById("salinity"),
    salinityVal: document.getElementById("salinityVal"),
    rhoFluidVal: document.getElementById("rhoFluidVal"),
    gravity: document.getElementById("gravity"),
    gravityVal: document.getElementById("gravityVal"),
    drag: document.getElementById("drag"),
    dragVal: document.getElementById("dragVal"),
    light: document.getElementById("light"),
    lightVal: document.getElementById("lightVal"),
    sway: document.getElementById("sway"),
    swayVal: document.getElementById("swayVal"),

    // Itranot
    inflation: document.getElementById("inflation"),
    inflationVal: document.getElementById("inflationVal"),
    rhoObj: document.getElementById("rhoObj"),
    rhoObjVal: document.getElementById("rhoObjVal"),
    tilt: document.getElementById("tilt"),
    tiltVal: document.getElementById("tiltVal"),
    leak: document.getElementById("leak"),
    leakVal: document.getElementById("leakVal"),
    neutralLine: document.getElementById("neutralLine"),

    // Buttons
    neutral: document.getElementById("neutral"),
    center: document.getElementById("center"),
    pause: document.getElementById("pause"),
    reset: document.getElementById("reset"),

    // HUD Toggle
    hudToggle: document.getElementById("hudToggle"),
    hudContent: document.getElementById("hudContent"),
    toggleIcon: document.getElementById("toggleIcon"),
  };

  // l3alam lmouwazi
  const world = {
    dpr: Math.max(1, window.devicePixelRatio || 1),
    scale: 100,
    gravity: 9.81,
    fluidDensity: 1000,
    dragK: 0.25,
    light: 0.5,
    sway: 0.2,
    swayPhase: 0,
    swaySpeed: 0.7,
    time: 0,
  };

  // titranot but cooler
  const astro = {
    x: 0, y: 0,
    vx: 0, vy: 0,
    r_m_base: 0.25,
    inflation: 1.0,
    density: 800,
    leakPerSec: 0.0,
    tiltSensitivity: 0.35,
    get r_m() { return this.r_m_base * Math.cbrt(this.inflation); },
    get volume() { return (4 / 3) * Math.PI * Math.pow(this.r_m, 3); },
    get mass() { return this.density * this.volume; },
  };

  const astroImg = new Image();
  astroImg.src = "images/astro.png";

  // Cnv
  function m2px(m) { return m * world.scale; }
  function px2m(px) { return px / world.scale; }

  function centerAstronaut() {
    astro.x = px2m(canvas.width / 2);
    astro.y = px2m(canvas.height / 2);
    astro.vx = 0; astro.vy = 0;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * world.dpr);
    canvas.height = Math.floor(rect.height * world.dpr);
    world.scale = Math.min(canvas.width, canvas.height) * 0.14;
    if (window.innerWidth <= 600 || window.innerHeight <= 600) centerAstronaut();
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();
  centerAstronaut();

  // Fluid density stuff
  function rhoFreshwater(T) {
    return 999.842594 +
      6.793952e-2 * T -
      9.09529e-3 * T * T +
      1.001685e-4 * T ** 3 -
      1.120083e-6 * T ** 4 +
      6.536332e-9 * T ** 5;
  }
  function computeFluidDensity(T, S) { return rhoFreshwater(T) + 0.8 * S; }

  // 3ilm al fizia2
  let running = true;
  let lastT = 0;

  function step(dt) {
    world.time += dt;
    const T = Number(ui.temp.value);
    const S = Number(ui.salinity.value);
    world.fluidDensity = computeFluidDensity(T, S);
    if (astro.leakPerSec > 0) astro.density += astro.leakPerSec * dt;

    const m = astro.mass;
    const g = world.gravity;
    const rho = world.fluidDensity;
    const V = astro.volume;

    const Fg = m * g;
    const Fb = rho * V * g;
    const Fy = Fg - Fb;

    const Fx_drag = -world.dragK * astro.vx * m;
    const Fy_drag = -world.dragK * astro.vy * m;

    astro.vx += (Fx_drag / m) * dt;
    astro.vy += ((Fy + Fy_drag) / m) * dt;
    astro.x += astro.vx * dt;
    astro.y += astro.vy * dt;

    const pad_m = px2m(18 * world.dpr);
    const minX = pad_m + astro.r_m;
    const maxX = px2m(canvas.width) - (pad_m + astro.r_m);
    const minY = pad_m + astro.r_m;
    const maxY = px2m(canvas.height) - (pad_m + astro.r_m);

    if (astro.x < minX) { astro.x = minX; astro.vx *= -0.55; }
    if (astro.x > maxX) { astro.x = maxX; astro.vx *= -0.55; }
    if (astro.y < minY) { astro.y = minY; astro.vy *= -0.55; }
    if (astro.y > maxY) { astro.y = maxY; astro.vy *= -0.55; }
  }

  // what appears [renderboys]
  function render() {
    const w = canvas.width, h = canvas.height;
    const swayAmtPx = (Math.min(w, h) * 0.01) * world.sway;
    world.swayPhase += world.sway * 0.02;
    const swayX = swayAmtPx * Math.sin(world.time * world.swaySpeed + world.swayPhase);
    const swayY = swayAmtPx * Math.cos(world.time * (world.swaySpeed * 0.9) + world.swayPhase * 0.7);

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(swayX, swayY);

    const light = world.light;
    const waterTop = `rgba(0, 200, 255, ${0.10 + light * 0.10})`;
    const waterDeep = `rgba(0, 80, 120, ${0.08 + light * 0.12})`;
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.9, Math.min(w, h) * 0.05, w * 0.5, h * 0.5, Math.min(w, h) * 0.6);
    grd.addColorStop(0, waterTop);
    grd.addColorStop(1, waterDeep);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    if (ui.neutralLine.checked) {
      ctx.beginPath();
      ctx.moveTo(14 * world.dpr, h / 2);
      ctx.lineTo(w - 14 * world.dpr, h / 2);
      ctx.strokeStyle = "rgba(180,255,220,0.9)";
      ctx.lineWidth = 2 * world.dpr;
      ctx.shadowColor = "rgba(150,255,230,0.9)";
      ctx.shadowBlur = 10 * world.dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const ax = m2px(astro.x), ay = m2px(astro.y);
    const r_px = m2px(astro.r_m);
    const tilt = Math.max(-0.8, Math.min(0.8, -astro.vy * astro.tiltSensitivity));

    if (astroImg.complete && astroImg.naturalWidth > 0) {
      const size = r_px * 4;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(tilt);
      ctx.drawImage(astroImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.fillStyle = "rgba(200,255,230,0.9)";
      ctx.arc(ax, ay, r_px, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = `${12 * world.dpr}px system-ui, -apple-system, Segoe UI`;
    ctx.fillStyle = "rgba(10,16,22,0.70)";
    const label = `${astro.density.toFixed(0)} kg/m³`;
    const tw = ctx.measureText(label).width;
    ctx.fillText(label, ax - tw / 2, ay + 14 * world.dpr);

    ctx.restore();
  }

  // the damn loop
  function loop(ts) {
    if (!lastT) lastT = ts;
    const dt = Math.min(0.05, (ts - lastT) / 1000);
    lastT = ts;
    if (running) step(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // pointer l ostora
  let dragging = false;
  let grabDX = 0, grabDY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * world.dpr;
    const py = (e.clientY - rect.top) * world.dpr;
    const mx = px2m(px), my = px2m(py);
    const dx = mx - astro.x, dy = my - astro.y;
    if (Math.hypot(dx, dy) <= astro.r_m * 1.3) {
      dragging = true;
      grabDX = astro.x - mx;
      grabDY = astro.y - my;
      astro.vx = astro.vy = 0;
      canvas.setPointerCapture(e.pointerId);
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * world.dpr;
    const py = (e.clientY - rect.top) * world.dpr;
    astro.x = px2m(px) + grabDX;
    astro.y = px2m(py) + grabDY;
  });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
  });

  // awdi hada makan fl ui logic
  function refreshLabels() {
    const T = Number(ui.temp.value);
    const S = Number(ui.salinity.value);
    const rho = computeFluidDensity(T, S);

    ui.tempVal.textContent = `${T.toFixed(1)} °C`;
    ui.salinityVal.textContent = `${S.toFixed(1)} ‰`;
    ui.rhoFluidVal.textContent = `~ ${rho.toFixed(0)} kg/m³`;
    ui.gravityVal.textContent = `${world.gravity.toFixed(2)} m/s²`;
    ui.dragVal.textContent = `${world.dragK.toFixed(2)}`;
    ui.lightVal.textContent = `${world.light.toFixed(2)}`;
    ui.swayVal.textContent = `${world.sway.toFixed(2)}`;
    ui.inflationVal.textContent = `${astro.inflation.toFixed(2)}×`;
    ui.rhoObjVal.textContent = `${astro.density.toFixed(0)} kg/m³`;
    ui.tiltVal.textContent = `${astro.tiltSensitivity.toFixed(2)}`;
    ui.leakVal.textContent = `${astro.leakPerSec.toFixed(4)} /s`;
  }

  const sliders = [
    "temp","salinity","gravity","drag","light","sway",
    "inflation","rhoObj","tilt","leak"
  ];
  sliders.forEach(id => ui[id].addEventListener("input", () => {
    if (id === "gravity") world.gravity = +ui.gravity.value;
    if (id === "drag") world.dragK = +ui.drag.value;
    if (id === "light") world.light = +ui.light.value;
    if (id === "sway") world.sway = +ui.sway.value;
    if (id === "inflation") astro.inflation = +ui.inflation.value;
    if (id === "rhoObj") astro.density = +ui.rhoObj.value;
    if (id === "tilt") astro.tiltSensitivity = +ui.tilt.value;
    if (id === "leak") astro.leakPerSec = +ui.leak.value;
    refreshLabels();
  }));

  ui.neutral.addEventListener("click", () => {
    astro.density = computeFluidDensity(+ui.temp.value, +ui.salinity.value);
    ui.rhoObj.value = astro.density.toFixed(0);
    refreshLabels();
  });
  ui.center.addEventListener("click", centerAstronaut);
  ui.pause.addEventListener("click", () => {
    running = !running;
    ui.pause.textContent = running ? "Pause" : "Resume";
  });
  ui.reset.addEventListener("click", () => location.reload());
  refreshLabels();

  // min/max dak l ui
  (() => {
    const { hudToggle, hudContent, toggleIcon } = ui;
    if (!hudToggle || !hudContent) return;
    const saved = sessionStorage.getItem("hudCollapsed");
    if (saved === "true") {
      hudContent.style.maxHeight = "0";
      hudContent.style.opacity = "0";
      hudContent.style.pointerEvents = "none";
      toggleIcon.textContent = "▴";
    }
    hudToggle.addEventListener("click", () => {
      const collapsed = hudContent.classList.toggle("collapsed");
      if (collapsed) {
        hudContent.style.maxHeight = "0";
        hudContent.style.opacity = "0";
        hudContent.style.pointerEvents = "none";
        toggleIcon.textContent = "▴";
        sessionStorage.setItem("hudCollapsed", "true");
      } else {
        hudContent.style.maxHeight = hudContent.scrollHeight + "px";
        hudContent.style.opacity = "1";
        hudContent.style.pointerEvents = "auto";
        toggleIcon.textContent = "▾";
        sessionStorage.setItem("hudCollapsed", "false");
      }
    });
    window.addEventListener("resize", () => {
      if (!hudContent.classList.contains("collapsed"))
        hudContent.style.maxHeight = hudContent.scrollHeight + "px";
    });
  })();
})();

// The end