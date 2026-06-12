const regionColors = {
  norte: "#ef4444",
  occidental: "#3b82f6",
  central: "#10b981",
  oriental: "#f59e0b",
  austral: "#8b5cf6",
};

const regionNames = {
  norte: "Africa del Norte",
  occidental: "Africa Occidental",
  central: "Africa Central",
  oriental: "Africa Oriental",
  austral: "Africa Austral",
};

const paisesDB = [
  { id: 1, nombre: "Argelia", capital: "Argel", region: "norte", presidente: "Abdelmadjid Tebboune", poblacion: 47.1, lat: 28.0339, lng: 1.6596 },
  { id: 2, nombre: "Egipto", capital: "El Cairo", region: "norte", presidente: "Abdelfatah El-Sisi", poblacion: 114.5, lat: 26.8206, lng: 30.8025 },
  { id: 20, nombre: "Nigeria", capital: "Abuya", region: "occidental", presidente: "Bola Ahmed Tinubu", poblacion: 230.9, lat: 9.082, lng: 8.6753 },
  { id: 24, nombre: "Camerun", capital: "Yaunde", region: "central", presidente: "Paul Biya", poblacion: 29.3, lat: 7.3697, lng: 12.3547 },
  { id: 36, nombre: "Etiopia", capital: "Adis Abeba", region: "oriental", presidente: "Abiy Ahmed", poblacion: 129.7, lat: 9.145, lng: 40.4897 },
  { id: 48, nombre: "Angola", capital: "Luanda", region: "austral", presidente: "Joao Lourenco", poblacion: 37.8, lat: -11.2027, lng: 17.8739 },
  { id: 53, nombre: "Sudafrica", capital: "Pretoria", region: "austral", presidente: "Cyril Ramaphosa", poblacion: 61.9, lat: -30.5595, lng: 22.9375 },
];

const multilateralData = {
  onu: ["Asamblea General", "UNESCO", "Consejo de Seguridad"],
  ua: ["Estatus de observador", "Agenda 2063"],
  opec: ["Coordinacion de cuotas", "Dialogo energetico"],
};

let map;
let markers = [];
let currentUser = null;

const users = [
  { id: 1, name: "Administrador", login: "admin", password: "admin", role: "admin" },
  { id: 2, name: "Usuario Lectura", login: "viewer", password: "viewer", role: "viewer" },
];

function byId(id) {
  return document.getElementById(id);
}

function init() {
  byId("loginBtn").addEventListener("click", doLogin);
  byId("logoutBtn").addEventListener("click", doLogout);
  byId("searchBox").addEventListener("input", filterMap);
  byId("regionFilter").addEventListener("change", filterMap);
  document.querySelectorAll(".module-btn[data-module]").forEach((btn) => {
    btn.addEventListener("click", () => showModule(btn.dataset.module, btn));
  });

  document.querySelectorAll("#orgFilters .filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#orgFilters .filter-chip").forEach((x) => x.classList.remove("active"));
      chip.classList.add("active");
      renderMultilateralContent();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !byId("loginPage").classList.contains("hidden")) doLogin();
  });

  setTimeout(() => byId("loadingOverlay").remove(), 600);
}

function doLogin() {
  const login = byId("loginUser").value.trim();
  const password = byId("loginPass").value;
  const user = users.find((u) => u.login === login && u.password === password);
  const err = byId("loginError");

  if (!user) {
    err.textContent = "Usuario o contrasena incorrectos";
    err.style.display = "block";
    return;
  }

  currentUser = user;
  err.style.display = "none";
  byId("loginPage").classList.add("hidden");
  byId("appPage").classList.remove("hidden");
  byId("headerUsername").textContent = user.name;
  byId("headerRole").textContent = user.role === "admin" ? "Admin" : "Lector";
  byId("headerRole").className = `role-badge ${user.role === "admin" ? "role-admin" : "role-viewer"}`;

  if (!map) initMap();
  renderCountriesTable();
  renderAuthorities();
  renderMultilateralContent();
  renderUsers();
}

function doLogout() {
  currentUser = null;
  byId("appPage").classList.add("hidden");
  byId("loginPage").classList.remove("hidden");
}

function showModule(mod, triggerEl = null) {
  document.querySelectorAll(".module-btn[data-module]").forEach((b) => b.classList.remove("active"));
  if (triggerEl) triggerEl.classList.add("active");
  document.querySelectorAll(".module-panel").forEach((p) => p.classList.remove("active"));
  const panel = byId(`panel-${mod}`);
  if (panel) panel.classList.add("active");
  if (mod === "mapa" && map) setTimeout(() => map.invalidateSize(), 100);
}

function initMap() {
  map = L.map("map", { minZoom: 2, maxZoom: 8 }).setView([5, 20], 3);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "© OpenStreetMap © CARTO",
  }).addTo(map);
  addMarkers(paisesDB);
}

function addMarkers(countries) {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  countries.forEach((p) => {
    const icon = L.divIcon({
      html: `<div style="width:16px;height:16px;border-radius:50%;background:${regionColors[p.region]};border:2px solid #fff"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    const marker = L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${p.nombre}</strong><br>${p.capital}<br>${p.presidente}`);
    markers.push(marker);
  });
}

function filterMap() {
  const q = byId("searchBox").value.toLowerCase().trim();
  const region = byId("regionFilter").value;
  const filtered = paisesDB.filter((p) => {
    const matchQ =
      p.nombre.toLowerCase().includes(q) ||
      p.capital.toLowerCase().includes(q) ||
      p.presidente.toLowerCase().includes(q);
    const matchR = region === "all" || p.region === region;
    return matchQ && matchR;
  });
  addMarkers(filtered);
  if (filtered.length) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.4));
  }
}

function renderCountriesTable() {
  byId("countriesTableBody").innerHTML = paisesDB
    .map(
      (p) => `<tr>
      <td>${p.nombre}</td>
      <td>${p.capital}</td>
      <td>${regionNames[p.region]}</td>
      <td>${p.presidente}</td>
      <td>${p.poblacion}</td>
    </tr>`
    )
    .join("");
}

function renderAuthorities() {
  byId("authoritiesGrid").innerHTML = paisesDB
    .map(
      (p) => `<article class="card">
      <h3>${p.presidente}</h3>
      <p>${p.nombre} - ${p.capital}</p>
      <p><small>${regionNames[p.region]}</small></p>
    </article>`
    )
    .join("");
}

function renderMultilateralContent() {
  const selected = document.querySelector("#orgFilters .filter-chip.active")?.dataset.org || "all";
  const entries = Object.entries(multilateralData).filter(([k]) => selected === "all" || k === selected);
  byId("multilateralContent").innerHTML = entries
    .map(
      ([org, items]) => `<section class="multilateral-card">
      <h3>${org.toUpperCase()}</h3>
      <ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>
    </section>`
    )
    .join("");
}

function renderUsers() {
  const isAdmin = currentUser?.role === "admin";
  byId("adminContent").style.display = isAdmin ? "block" : "none";
  byId("userList").innerHTML = users
    .map((u) => `<div class="card">${u.name} (@${u.login}) - ${u.role}</div>`)
    .join("");
}

window.addEventListener("load", init);
