const planets = [
  {name:"Mercury",order:1,type:"Terrestrial planet",color:"linear-gradient(135deg,#c9c5c2,#6f737b 65%,#454650)",glow:"rgba(210,210,220,.13)",size:52,distance:"57.9 million km",diameter:"4,879 km",year:"88 Earth days",day:"58.6 Earth days",moons:"0",temperature:"~167°C average",description:"The smallest planet and the closest to the Sun. Mercury has an ancient, heavily cratered surface, almost no atmosphere to retain heat, and extreme temperature swings. It likely formed early in the solar system and preserves clues about the era of planetary collisions.",history:"Mercury's surface records billions of years of impacts. NASA's Mariner 10 first flew by in 1974; MESSENGER orbited it from 2011 to 2015, revealing water ice in permanently shadowed polar craters and a surprisingly large iron-rich core.",fun:"A solar day on Mercury (sunrise to sunrise) lasts about 176 Earth days."},
  {name:"Venus",order:2,type:"Terrestrial planet",color:"linear-gradient(135deg,#f7d59b,#b87a46 55%,#704b3e)",glow:"rgba(255,183,114,.13)",size:59,distance:"108.2 million km",diameter:"12,104 km",year:"225 Earth days",day:"243 Earth days",moons:"0",temperature:"~465°C surface",description:"Venus is similar to Earth in size but has a crushing carbon-dioxide atmosphere and thick sulfuric-acid clouds. Its runaway greenhouse effect makes it the hottest planet. It rotates in the opposite direction to most planets.",history:"Venus may once have had conditions very different from today's, but its exact climate history remains an active research question. Soviet Venera landers returned the first surface data; NASA's Magellan mapped much of the surface with radar in the 1990s.",fun:"Venus is hotter than Mercury despite being farther from the Sun."},
  {name:"Earth",order:3,type:"Terrestrial planet",color:"radial-gradient(circle at 35% 28%,#8de6ff,#237ec7 45%,#15417e 80%)",glow:"rgba(80,190,255,.2)",size:66,distance:"149.6 million km",diameter:"12,742 km",year:"365.25 days",day:"23 h 56 min",moons:"1",temperature:"~15°C global average",description:"Our home is the only world currently known to host life. Liquid water on the surface, a protective atmosphere, a magnetic field, and active geology help make Earth habitable. Its climate and ecosystems have changed dramatically over 4.5 billion years.",history:"Earth formed about 4.54 billion years ago. Early oceans and the oldest evidence of life appeared billions of years ago; photosynthesis changed the atmosphere, complex life diversified, and humans eventually developed spaceflight.",fun:"Earth is not a perfect sphere; it bulges slightly at the equator."},
  {name:"Mars",order:4,type:"Terrestrial planet",color:"linear-gradient(135deg,#ffc39b,#c64f38 60%,#79342d)",glow:"rgba(244,111,82,.15)",size:57,distance:"227.9 million km",diameter:"6,779 km",year:"687 Earth days",day:"24 h 37 min",moons:"2",temperature:"~-65°C average",description:"The Red Planet has iron-rich dust, giant volcanoes, deep canyons, polar ice, and evidence that liquid water once flowed across its surface. Today its atmosphere is thin and mostly carbon dioxide. Scientists investigate whether ancient Mars could have supported microbial life.",history:"Mars preserves river channels, lake sediments, and minerals formed in water. Orbiters, landers, and rovers including Curiosity and Perseverance study its geology and habitability; no life has yet been confirmed there.",fun:"Olympus Mons on Mars is the largest known volcano in the solar system."},
  {name:"Jupiter",order:5,type:"Gas giant",color:"repeating-linear-gradient(0deg,#e7c8a2 0 7px,#b77d5d 7px 12px,#f2d8b6 12px 17px,#9e624d 17px 22px)",glow:"rgba(236,191,143,.13)",size:82,distance:"778.6 million km",diameter:"139,820 km",year:"11.86 Earth years",day:"~9 h 56 min",moons:"Many; count changes",temperature:"~−110°C cloud tops",description:"Jupiter is the largest planet, made mostly of hydrogen and helium. Its powerful storms include the Great Red Spot, and its moon Europa may have a subsurface ocean. Jupiter's immense gravity strongly influences the architecture of the solar system.",history:"Jupiter formed from the young solar nebula and likely influenced how smaller bodies moved during the solar system's early evolution. Galileo's 1610 observations of its four largest moons helped transform astronomy. NASA's Juno mission studies its interior and magnetic field.",fun:"Jupiter's Great Red Spot is a giant storm that has lasted for centuries, though it changes over time."},
  {name:"Saturn",order:6,type:"Gas giant",color:"linear-gradient(135deg,#f7e1b0,#c9a778 55%,#8b6d53)",glow:"rgba(241,214,160,.13)",size:75,distance:"1.43 billion km",diameter:"116,460 km",year:"29.4 Earth years",day:"~10.7 hours",moons:"Many; count changes",temperature:"~−140°C cloud tops",description:"Saturn is famous for its broad, bright rings made mostly of ice and rocky debris. It is a gas giant with no solid surface like Earth's. Its moons are diverse: Titan has lakes of liquid hydrocarbons, while Enceladus sprays water-rich plumes from a subsurface ocean.",history:"Saturn's rings and moons preserve clues about collisions and orbital evolution. The Cassini spacecraft explored Saturn from 2004 to 2017, dropping the Huygens probe onto Titan and discovering active plumes at Enceladus.",fun:"Saturn's average density is lower than water's, although there is no ocean large enough to hold it."},
  {name:"Uranus",order:7,type:"Ice giant",color:"linear-gradient(135deg,#c9f6f6,#69bdcb 60%,#3d829f)",glow:"rgba(112,221,237,.14)",size:64,distance:"2.87 billion km",diameter:"50,724 km",year:"84 Earth years",day:"~17.2 hours",moons:"28 known (may change)",temperature:"~−195°C",description:"Uranus is an ice giant with a cold atmosphere containing hydrogen, helium, and methane, which gives it a blue-green appearance. Its rotation axis is tilted by about 98 degrees, making it appear to roll around the Sun as it orbits.",history:"Uranus was discovered by William Herschel in 1781, the first planet found with a telescope rather than known since antiquity. Voyager 2 flew past in 1986; a dedicated future mission is a major planetary-science priority.",fun:"One Uranian season can last more than 20 Earth years."},
  {name:"Neptune",order:8,type:"Ice giant",color:"radial-gradient(circle at 30% 25%,#83caff,#315ad7 55%,#172f85)",glow:"rgba(86,133,255,.16)",size:62,distance:"4.50 billion km",diameter:"49,244 km",year:"164.8 Earth years",day:"~16.1 hours",moons:"16 known (may change)",temperature:"~−200°C",description:"Neptune is a distant, dark-blue ice giant with supersonic winds and large, changing storms. Its moon Triton travels in a retrograde orbit and may be a captured object from the outer solar system.",history:"Neptune's position was predicted mathematically from irregularities in Uranus's orbit before it was observed in 1846. Voyager 2 made the only close flyby in 1989; telescopes continue to track its atmosphere and seasonal changes.",fun:"Neptune takes nearly 165 Earth years to complete one orbit around the Sun."}
];

const $ = (selector) => document.querySelector(selector);
const planetGrid = $("#planetGrid");
const planetDetail = $("#planetDetail");
const toast = $("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function renderPlanets() {
  planetGrid.innerHTML = planets.map((p, i) => `
    <article class="planet-card" tabindex="0" role="button" aria-label="Explore ${p.name}" data-planet="${p.name}">
      <div class="planet-card-top"><span>PLANET ${String(i + 1).padStart(2, "0")}</span><span class="planet-number">${String(i + 1).padStart(2, "0")}</span></div>
      <div class="planet-art"><div class="planet-ball ${p.name === "Saturn" ? "saturn" : ""}" style="--planet-size:${p.size}px;--planet-bg:${p.color};--planet-glow:${p.glow}"></div></div>
      <h3 class="planet-name">${p.name}</h3><div class="planet-type">${p.type}</div><span class="planet-arrow">↗</span>
    </article>`).join("");
  planetGrid.querySelectorAll("[data-planet]").forEach((card) => {
    const activate = () => selectPlanet(card.dataset.planet);
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
  });
}

function selectPlanet(name) {
  const p = planets.find((planet) => planet.name === name);
  if (!p) return;
  planetGrid.querySelectorAll(".planet-card").forEach((card) => card.classList.toggle("selected", card.dataset.planet === name));
  planetDetail.hidden = false;
  planetDetail.innerHTML = `
    <div class="card-kicker">PLANET PROFILE / ${String(p.order).padStart(2, "0")}</div>
    <h3>${p.name}: ${p.type}</h3><p>${p.description}</p>
    <p><strong>Its history:</strong> ${p.history}</p><p><strong>Did you know?</strong> ${p.fun}</p>
    <div class="detail-facts">
      <div class="detail-fact"><span>Average distance from Sun</span><strong>${p.distance}</strong></div>
      <div class="detail-fact"><span>Diameter</span><strong>${p.diameter}</strong></div>
      <div class="detail-fact"><span>Year length</span><strong>${p.year}</strong></div>
      <div class="detail-fact"><span>Day length</span><strong>${p.day}</strong></div>
      <div class="detail-fact"><span>Moons</span><strong>${p.moons}</strong></div>
      <div class="detail-fact"><span>Temperature</span><strong>${p.temperature}</strong></div>
      <div class="detail-fact"><span>Planet category</span><strong>${p.type}</strong></div>
      <div class="detail-fact"><span>Solar system order</span><strong>${p.order} of 8</strong></div>
    </div>`;
  planetDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function loadApod() {
  const host = $("#apodContent");
  try {
    const response = await fetch("/api/apod");
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "NASA feature unavailable");
    const imageHtml = data.image ? `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" loading="lazy">` : "";
    host.innerHTML = `${imageHtml}<div class="apod-date">${escapeHtml(data.date || "NASA FEATURE")}</div><h4>${escapeHtml(data.title || "Astronomy Picture of the Day")}</h4><p>${escapeHtml((data.explanation || "").slice(0, 520))}${(data.explanation || "").length > 520 ? "…" : ""}</p>`;
    $("#apodLink").href = data.page || "https://science.nasa.gov/";
    $("#apodLink").textContent = "Read the NASA feature ↗";
  } catch {
    host.innerHTML = `<div class="neo-empty">NASA's daily feature could not be loaded just now. Try again later or open the NASA Science website.</div>`;
  }
}

async function loadNeo() {
  const host = $("#neoContent");
  try {
    const response = await fetch("/api/neo");
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "Feed unavailable");
    if (!data.objects.length) {
      host.innerHTML = `<div class="neo-empty">No objects were returned for ${escapeHtml(data.date)}. Check NASA's feed again later.</div>`;
      return;
    }
    host.innerHTML = data.objects.slice(0, 4).map((neo) => `
      <div class="neo-item">
        <h4>${escapeHtml(neo.name)} ${neo.potentiallyHazardous ? '<span class="neo-flag">Potentially hazardous classification</span>' : ""}</h4>
        <div class="neo-meta"><span>Miss distance: ${formatDistance(neo.missDistanceKm)}</span><span>Speed: ${Math.round(neo.velocityKph).toLocaleString()} km/h</span><span>Max size: ${Math.round(neo.diameterMeters).toLocaleString()} m</span></div>
      </div>`).join("");
  } catch {
    host.innerHTML = `<div class="neo-empty">Today's NASA asteroid feed is unavailable. This does not indicate danger; the panel will work again when the service responds.</div>`;
  }
}

async function searchNasa(query) {
  const host = $("#galleryResults");
  host.innerHTML = `<p class="muted">Searching NASA's image library…</p>`;
  try {
    const response = await fetch(`/api/nasa-search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "Search unavailable");
    if (!data.items.length) {
      host.innerHTML = `<p class="muted">No image results found. Try another search term.</p>`;
      return;
    }
    host.innerHTML = data.items.slice(0, 12).map((item) => `
      <a class="gallery-item" href="${escapeHtml(item.nasaUrl || "https://images.nasa.gov/")}" target="_blank" rel="noreferrer">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
        <div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml((item.date || "").slice(0, 10)) || "NASA Image Library"}</p></div>
      </a>`).join("");
  } catch {
    host.innerHTML = `<p class="muted">NASA's image search is temporarily unavailable. Please try again later.</p>`;
  }
}

function formatDistance(km) {
  if (!Number.isFinite(km) || km <= 0) return "Not available";
  return km.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " km";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#spaceSearch").value.trim();
  if (!query) return showToast("Enter a space topic to search.");
  searchNasa(query);
});
$("#menuToggle").addEventListener("click", () => {
  const nav = $(".main-nav");
  const open = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
$(".main-nav").querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  $(".main-nav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));

renderPlanets();
loadApod();
loadNeo();
searchNasa("nebula");
