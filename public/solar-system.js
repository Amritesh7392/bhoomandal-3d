import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mount = document.getElementById("solarScene");
if (!mount) throw new Error("Missing #solarScene container");

const bodyData = [
  { name:"Sun", type:"G-type main-sequence star", color:0xffc66d, radius:2.5, orbit:0, period:0, distance:"0 km", diameter:"1.39 million km", year:"—", moons:"8 planets", description:"The star at the center of our solar system. Nuclear fusion in its core releases the energy that warms Earth and powers much of life on our planet." },
  { name:"Mercury", type:"Terrestrial planet", color:0xaaa7a2, radius:0.34, orbit:5.1, period:88, distance:"57.9 million km", diameter:"4,879 km", year:"88 Earth days", moons:"0", description:"The smallest planet and the closest to the Sun. Its ancient, cratered surface experiences extreme temperature changes because its atmosphere is extremely thin." },
  { name:"Venus", type:"Terrestrial planet", color:0xdca56e, radius:0.55, orbit:7.1, period:224.7, distance:"108.2 million km", diameter:"12,104 km", year:"225 Earth days", moons:"0", description:"A rocky world wrapped in a thick carbon-dioxide atmosphere. Its powerful greenhouse effect makes Venus the hottest planet in the solar system." },
  { name:"Earth", type:"Terrestrial planet", color:0x2d87d8, radius:0.59, orbit:9.2, period:365.25, distance:"149.6 million km", diameter:"12,742 km", year:"365.25 days", moons:"1", description:"Our home world is the only place currently known to host life. Liquid water, a protective atmosphere, and a magnetic field help make Earth habitable." },
  { name:"Mars", type:"Terrestrial planet", color:0xc65d43, radius:0.45, orbit:11.4, period:687, distance:"227.9 million km", diameter:"6,779 km", year:"687 Earth days", moons:"2", description:"The Red Planet has iron-rich dust, enormous volcanoes, deep canyons, polar ice, and geological evidence that liquid water once flowed across its surface." },
  { name:"Jupiter", type:"Gas giant", color:0xc9a27e, radius:1.27, orbit:14.8, period:4332.6, distance:"778.6 million km", diameter:"139,820 km", year:"11.86 Earth years", moons:"Many", description:"The largest planet is a gas giant with powerful storms, including the Great Red Spot. Its moons include ocean-world candidates such as Europa." },
  { name:"Saturn", type:"Gas giant", color:0xe0c89a, radius:1.06, orbit:18.3, period:10759, distance:"1.43 billion km", diameter:"116,460 km", year:"29.4 Earth years", moons:"Many", description:"Saturn is famous for its rings of icy and rocky material. The moons Titan and Enceladus are important targets for studying complex chemistry and possible habitable environments." },
  { name:"Uranus", type:"Ice giant", color:0x7bd0d6, radius:0.82, orbit:21.6, period:30688, distance:"2.87 billion km", diameter:"50,724 km", year:"84 Earth years", moons:"28 known (count can change)", description:"An ice giant with a blue-green atmosphere and an extreme axial tilt. Uranus appears to rotate almost on its side as it travels around the Sun." },
  { name:"Neptune", type:"Ice giant", color:0x3f65d9, radius:0.8, orbit:24.8, period:60182, distance:"4.50 billion km", diameter:"49,244 km", year:"164.8 Earth years", moons:"16 known (count can change)", description:"A distant ice giant with very fast winds and a deep-blue appearance. Its large moon Triton moves in a retrograde orbit and may have been captured." }
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050917);
scene.fog = new THREE.FogExp2(0x050917, 0.0023);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(26, 23, 34);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional solar system");
mount.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 6;
controls.maxDistance = 95;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0x7586b8, 0.75));
const sunlight = new THREE.PointLight(0xffd6a0, 190, 180, 1.6);
scene.add(sunlight);

const starGeometry = new THREE.BufferGeometry();
const starCount = 1800;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const radius = 80 + Math.random() * 220;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = radius * Math.cos(phi);
  starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xd9e5ff, size: 0.22, transparent: true, opacity: 0.85, sizeAttenuation: true }));
scene.add(stars);

const planetObjects = new Map();
const selectableMeshes = [];
const orbitLines = [];
const labelSprites = [];
let selectedName = "Earth";
let isPlaying = true;
let speed = 1;
let showOrbits = true;
let showLabels = true;
let animationFrame = 0;
let disposed = false;

function makeTexture(kind, baseColor) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const base = new THREE.Color(baseColor);
  const rgb = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
  ctx.fillStyle = rgb;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (kind === "Jupiter" || kind === "Saturn") {
    const bands = kind === "Jupiter"
      ? ["#e6c8a6","#9d6e53","#f0d9b7","#bb8967","#f5e3c8","#a9654e","#d9b38e"]
      : ["#e9d9b4","#b9a078","#f0e3c6","#d1b98d","#f5e7c8"];
    for (let y = 0; y < canvas.height; y += 12 + Math.random() * 12) {
      ctx.fillStyle = bands[Math.floor(Math.random() * bands.length)];
      ctx.globalAlpha = 0.42 + Math.random() * 0.42;
      ctx.fillRect(0, y, canvas.width, 4 + Math.random() * 14);
    }
    if (kind === "Jupiter") {
      ctx.globalAlpha = 0.8; ctx.fillStyle = "#a95843";
      ctx.beginPath(); ctx.ellipse(350, 158, 34, 16, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.25; ctx.fillStyle = "#f4d9b8";
      ctx.beginPath(); ctx.ellipse(350, 154, 28, 7, -0.1, 0, Math.PI * 2); ctx.fill();
    }
  } else if (kind === "Earth") {
    ctx.fillStyle = "#347b43";
    for (let i = 0; i < 38; i++) {
      const x = Math.random() * canvas.width, y = Math.random() * canvas.height;
      ctx.beginPath(); ctx.ellipse(x, y, 12 + Math.random() * 36, 6 + Math.random() * 20, Math.random() * 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,.6)";
    for (let i = 0; i < 42; i++) {
      ctx.beginPath(); ctx.ellipse(Math.random() * canvas.width, Math.random() * canvas.height, 12 + Math.random() * 36, 2 + Math.random() * 6, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else if (kind === "Mars" || kind === "Mercury") {
    for (let i = 0; i < 85; i++) {
      ctx.beginPath(); ctx.fillStyle = i % 3 ? "rgba(35,25,25,.18)" : "rgba(255,230,205,.18)";
      const r = 1 + Math.random() * 12;
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, r, 0, Math.PI * 2); ctx.fill();
    }
  } else if (kind === "Neptune" || kind === "Uranus") {
    for (let y = 0; y < canvas.height; y += 23) {
      ctx.fillStyle = `rgba(220,245,255,${Math.random() * 0.13})`;
      ctx.fillRect(0, y, canvas.width, 5 + Math.random() * 9);
    }
  } else {
    for (let i = 0; i < 70; i++) {
      ctx.beginPath(); ctx.fillStyle = "rgba(255,245,220,.12)";
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2 + Math.random() * 10, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeLabel(text, color = "#e8efff") {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 25px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(3,8,22,.72)";
  ctx.fillRect(18, 9, 220, 46);
  ctx.strokeStyle = "rgba(153,179,255,.3)";
  ctx.strokeRect(18, 9, 220, 46);
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 40);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(3.3, 0.82, 1);
  sprite.visible = showLabels;
  return sprite;
}

function createOrbit(radius) {
  const points = [];
  const segments = 180;
  for (let i = 0; i <= segments; i++) {
    const a = i / segments * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: 0x65749f, transparent: true, opacity: 0.34 }));
  line.visible = showOrbits;
  scene.add(line);
  orbitLines.push(line);
}

function createSun(data) {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 48, 32),
    new THREE.MeshBasicMaterial({ map: makeTexture("Sun", data.color), color: 0xffd68a })
  );
  group.add(mesh);
  const corona = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius * 1.22, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0xffa84a, transparent: true, opacity: 0.10, side: THREE.BackSide })
  );
  group.add(corona);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(), color: 0xffbd68, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  sprite.scale.set(10, 10, 1);
  group.add(sprite);
  const label = makeLabel("Sun", "#ffd18a");
  label.position.set(0, 3.8, 0);
  group.add(label);
  mesh.userData.bodyName = "Sun";
  selectableMeshes.push(mesh);
  scene.add(group);
  planetObjects.set("Sun", { data, group, mesh, label, angle: 0 });
}

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,221,153,.9)");
  gradient.addColorStop(0.22, "rgba(255,169,76,.3)");
  gradient.addColorStop(1, "rgba(255,130,40,0)");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPlanet(data, index) {
  createOrbit(data.orbit);
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    map: makeTexture(data.name, data.color),
    roughness: data.name === "Earth" ? 0.68 : 0.88,
    metalness: 0.02
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 36, 28), material);
  mesh.userData.bodyName = data.name;
  group.add(mesh);

  if (data.name === "Earth") {
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(data.radius * 1.08, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x61b8ff, transparent: true, opacity: 0.12, side: THREE.BackSide })
    );
    group.add(atmosphere);
  }
  if (data.name === "Saturn") {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(data.radius * 1.35, data.radius * 2.15, 72),
      new THREE.MeshStandardMaterial({ color: 0xd9c49b, side: THREE.DoubleSide, transparent: true, opacity: 0.82, roughness: 0.9 })
    );
    ring.rotation.x = Math.PI / 2.25;
    ring.rotation.z = 0.16;
    group.add(ring);
  }
  const label = makeLabel(data.name, data.name === "Earth" ? "#91d8ff" : "#e8efff");
  label.position.set(0, data.radius + 0.8, 0);
  group.add(label);
  scene.add(group);
  const angle = (index * 1.72 + 0.4) % (Math.PI * 2);
  planetObjects.set(data.name, { data, group, mesh, label, angle });
  selectableMeshes.push(mesh);
}

createSun(bodyData[0]);
bodyData.slice(1).forEach((body, i) => createPlanet(body, i + 1));

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hoverPointer = new THREE.Vector2();
let pointerDown = null;
renderer.domElement.addEventListener("pointerdown", (event) => { pointerDown = { x: event.clientX, y: event.clientY }; });
renderer.domElement.addEventListener("pointerup", (event) => {
  if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 5) { pointerDown = null; return; }
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(selectableMeshes, false);
  if (hits.length) selectBody(hits[0].object.userData.bodyName, true);
  pointerDown = null;
});
renderer.domElement.addEventListener("pointermove", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  hoverPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  hoverPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(hoverPointer, camera);
  renderer.domElement.style.cursor = raycaster.intersectObjects(selectableMeshes, false).length ? "pointer" : "grab";
});

function selectBody(name, focus = false) {
  const item = planetObjects.get(name);
  if (!item) return;
  selectedName = name;
  const d = item.data;
  document.getElementById("selectedObjectGlyph").textContent = name === "Sun" ? "☼" : "●";
  document.getElementById("selectedObjectName").textContent = name === "Sun" ? "The Sun" : name;
  document.getElementById("selectedObjectType").textContent = d.type;
  document.getElementById("selectedObjectDescription").textContent = d.description;
  document.getElementById("selectedObjectDistance").textContent = d.distance;
  document.getElementById("selectedObjectDiameter").textContent = d.diameter;
  document.getElementById("selectedObjectYear").textContent = d.year;
  document.getElementById("selectedObjectMoons").textContent = d.moons;
  const selector = document.getElementById("focusPlanet");
  if (selector.value !== name) selector.value = name;
  if (focus) {
    const target = item.group.position.clone();
    controls.target.copy(target);
    const offset = camera.position.clone().sub(controls.target).normalize().multiplyScalar(name === "Sun" ? 15 : 7);
    camera.position.copy(target.clone().add(offset));
    controls.minDistance = name === "Sun" ? 4 : 1.8;
    controls.maxDistance = 95;
    controls.update();
  }
  document.getElementById("morePlanetInfo").disabled = name === "Sun";
  document.getElementById("morePlanetInfo").textContent = name === "Sun" ? "Explore the star life cycle below ↓" : "Open full planet profile ↗";
  document.getElementById("sceneStatus").textContent = `${name.toUpperCase()} SELECTED`;
}

document.getElementById("focusPlanet").addEventListener("change", (event) => selectBody(event.target.value, true));
document.getElementById("morePlanetInfo").addEventListener("click", () => {
  if (selectedName === "Sun") {
    document.getElementById("stars").scrollIntoView({ behavior: "smooth" });
  } else {
    const card = document.querySelector(`[data-planet="${CSS.escape(selectedName)}"]`);
    if (card) card.click();
    else document.getElementById("planets").scrollIntoView({ behavior: "smooth" });
  }
});
document.getElementById("playPauseBtn").addEventListener("click", (event) => {
  isPlaying = !isPlaying;
  event.currentTarget.textContent = isPlaying ? "Ⅱ Pause" : "▶ Play";
  event.currentTarget.setAttribute("aria-pressed", String(!isPlaying));
});
document.getElementById("resetViewBtn").addEventListener("click", () => {
  camera.position.set(26, 23, 34);
  controls.target.set(0, 0, 0);
  controls.minDistance = 6;
  controls.update();
  selectBody("Earth", false);
});
document.getElementById("orbitSpeed").addEventListener("input", (event) => {
  speed = Number(event.target.value);
  document.getElementById("speedValue").textContent = `${speed.toFixed(2).replace(/\.?0+$/, "")}×`;
});
document.getElementById("toggleOrbits").addEventListener("change", (event) => {
  showOrbits = event.target.checked;
  orbitLines.forEach((line) => { line.visible = showOrbits; });
});
document.getElementById("toggleLabels").addEventListener("change", (event) => {
  showLabels = event.target.checked;
  labelSprites.forEach((label) => { label.visible = showLabels; });
  planetObjects.forEach((item) => { item.label.visible = showLabels; });
});

function resize() {
  if (disposed) return;
  const width = Math.max(280, mount.clientWidth);
  const height = Math.max(320, mount.clientHeight || 570);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", resize);
resize();
selectBody("Earth", false);
document.getElementById("sceneLoading")?.remove();
document.getElementById("sceneStatus").textContent = "READY · DRAG TO ROTATE";
document.getElementById("monitorTime").textContent = new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
document.getElementById("lastUpdated").textContent = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const clock = new THREE.Clock();
function animate() {
  if (disposed) return;
  animationFrame = requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  if (isPlaying && speed > 0) {
    planetObjects.forEach((item, name) => {
      if (name === "Sun") {
        item.mesh.rotation.y += delta * 0.08 * speed;
        return;
      }
      // Exaggerated orbit speeds keep movement visible while preserving the order of orbital periods.
      const relativeSpeed = 0.22 / Math.sqrt(item.data.period / 88);
      item.angle += delta * relativeSpeed * speed;
      const r = item.data.orbit;
      item.group.position.set(Math.cos(item.angle) * r, Math.sin(item.angle * 0.7) * 0.10, Math.sin(item.angle) * r);
      item.mesh.rotation.y += delta * 0.18 * speed;
    });
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  isPlaying = false;
  document.getElementById("playPauseBtn").textContent = "▶ Play";
  document.getElementById("playPauseBtn").setAttribute("aria-pressed", "true");
}

window.addEventListener("beforeunload", () => {
  disposed = true;
  cancelAnimationFrame(animationFrame);
  renderer.dispose();
});
