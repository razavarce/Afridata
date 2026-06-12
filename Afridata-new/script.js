// ==================== VARIABLES GLOBALES ====================
let map, markers = [], currentRegion = 'all';
let currentUser = null;
let currentSelectedCountry = null;
let currentSearch = '';
let filteredCountries = [];
let currentCountryIndex = 0;
let currentLanguage = 'es';
let auditLog = [];
let authorityPhotoCache = {};
let authorityPhotoSyncStarted = false;
let nextUserId = 3;
let auditFilters = { user: '', from: '', to: '', text: '' };

// ==================== FUNCIONES ORIGINALES (COPIA AQUÍ TU CÓDIGO) ====================
// NOTA: Debes pegar aquí todas las funciones que ya tenías funcionando:
// loadPaisesTable, loadAutoridades, renderBilateralContent, loadHitos, loadEmbajadas,
// exportCSV, generateReport, exportAuditCSV, printReport, registerAudit, loadAuditLog,
// renderAuditLog, applyAuditFilters, clearAuditFilters, populateAuditUserFilter,
// loadUsers, createUser, deleteUser, updateAdminAccess, showToast,
// findAuthorityPhotoOnline, startAuthorityPhotoSync, getAuthorityPhotoUrl,
// handleAuthorityImageError, importAuthorityPhotosFromInput, etc.
// También las funciones de efemérides, bilaterales, multilateral, etc.
// Por razones de espacio, aquí solo pongo las cabeceras. TÚ DEBES PEGAR EL CONTENIDO COMPLETO.

function loadPaisesTable() { /* ... tu código ... */ }
function loadAutoridades() { /* ... tu código ... */ }
function renderBilateralContent() { /* ... */ }
function loadHitos() { /* ... */ }
function loadEmbajadas() { /* ... */ }
function exportCSV() { /* ... */ }
function generateReport(type) { /* ... */ }
function exportAuditCSV() { /* ... */ }
function printReport() { /* ... */ }
function registerAudit(accion, cambio) { /* ... */ }
function loadAuditLog() { /* ... */ }
function renderAuditLog() { /* ... */ }
function applyAuditFilters() { /* ... */ }
function clearAuditFilters() { /* ... */ }
function populateAuditUserFilter() { /* ... */ }
function loadUsers() { /* ... */ }
function createUser() { /* ... */ }
function deleteUser(id) { /* ... */ }
function updateAdminAccess() { /* ... */ }
function showToast(msg, type) { /* ... */ }
function findAuthorityPhotoOnline(p) { /* ... */ }
function startAuthorityPhotoSync() { /* ... */ }
function getAuthorityPhotoUrl(p) { /* ... */ }
function handleAuthorityImageError(img) { /* ... */ }
function importAuthorityPhotosFromInput(el) { /* ... */ }
function populateCountrySelect() { /* ... */ }
function loadCountryForEdit() { /* ... */ }
function saveCountryEdit() { /* ... */ }
function importEfemeridesFromTextarea() { /* ... */ }
function exportEfemeridesToClipboard() { /* ... */ }
function openEfemeridesEditor() { /* ... */ }
function importBilateralFromTextarea() { /* ... */ }
function exportBilateralToClipboard() { /* ... */ }
function renderMultilateralContent() { /* ... */ }
function filterMultilateral() { /* ... */ }
function filterMultilateralOrg(o, btn) { /* ... */ }
function filterBilateral() { /* ... */ }
function filterBilateralRegion(r, btn) { /* ... */ }
function filterBilateralStatus(s, btn) { /* ... */ }
function toggleBilateralCard(id) { /* ... */ }
function filterAuthorities() { /* ... */ }
function filterAuthorityRegion(r, btn) { /* ... */ }
function setLanguage(code) { /* ... */ }
function setLanguageFromSelect() { /* ... */ }
function translatePage(code) { /* ... */ }

// ==================== NUEVAS FUNCIONES DE INTERFAZ (MAPA, SIDEBAR) ====================
function initMap() {
    if (map) map.remove();
    map = L.map('map').setView([5,20],3);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains:'abcd', attribution:'© CARTO' }).addTo(map);
    addMarkers(currentRegion);
}
function addMarkers(region) {
    if (markers.length) markers.forEach(m => map.removeLayer(m));
    markers = [];
    const filtered = region === 'all' ? paisesDB : paisesDB.filter(p => p.region === region);
    filtered.forEach(p => {
        const icon = L.divIcon({ html: `<div style="width:18px;height:18px;border-radius:50%;background:${regionColors[p.region]};border:2px solid var(--gold-primary);"></div>`, iconSize:[18,18] });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`<div class="popup-content"><strong>${p.nombre}</strong><br><button class="popup-btn" onclick="showInfoById(${p.id})">Ver ficha</button></div>`);
        marker.on('click', () => showInfo(p));
        markers.push(marker);
    });
}
function showInfo(country) {
    currentSelectedCountry = country;
    document.getElementById('selection-placeholder').style.display = 'none';
    const card = document.getElementById('selection-card');
    card.classList.remove('hidden');
    document.getElementById('side-name').innerText = country.nombre;
    document.getElementById('side-capital').innerText = country.capital;
    document.getElementById('side-flag').src = `https://flagcdn.com/w320/${country.bandera}.png`;
    document.getElementById('side-autoridades').innerHTML = `${country.presidente}<br>${country.gobierno}`;
    document.getElementById('side-embajada').innerText = country.embajada;
    document.getElementById('side-cultura').innerText = country.cultura || 'No disponible';
    document.getElementById('side-tradiciones').innerText = country.tradicion || 'No disponible';
    document.getElementById('side-economia').innerText = country.economia || 'No disponible';
    document.getElementById('side-venezuela').innerHTML = `${country.relacionesVenezuela}<br>${country.embajada}`;
    const recursosDiv = document.getElementById('side-recursos');
    recursosDiv.innerHTML = '';
    (country.recursos || '').split(',').forEach(r => {
        let span = document.createElement('span'); span.className = 'badge badge-green mr-1'; span.innerText = r.trim();
        recursosDiv.appendChild(span);
    });
    feather.replace();
    // Actualizar lista de navegación
    filteredCountries = paisesDB.filter(p => {
        const regMatch = currentRegion === 'all' || p.region === currentRegion;
        const searchMatch = !currentSearch || p.nombre.toLowerCase().includes(currentSearch) || p.capital.toLowerCase().includes(currentSearch);
        return regMatch && searchMatch;
    });
    currentCountryIndex = filteredCountries.findIndex(c => c.id === country.id);
}
function showInfoById(id) {
    const country = paisesDB.find(c => c.id === id);
    if (country) showInfo(country);
}
function filterCountries() {
    currentSearch = document.getElementById('searchBox').value.toLowerCase().trim();
    const region = currentRegion;
    addMarkers(region);
    if (currentSelectedCountry) showInfo(currentSelectedCountry);
}
function filterRegion(region, btn) {
    currentRegion = region;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    addMarkers(region);
    filterCountries();
}
function nextCountry() {
    if (filteredCountries.length === 0) return;
    currentCountryIndex = (currentCountryIndex + 1) % filteredCountries.length;
    showInfo(filteredCountries[currentCountryIndex]);
}
function previousCountry() {
    if (filteredCountries.length === 0) return;
    currentCountryIndex = (currentCountryIndex - 1 + filteredCountries.length) % filteredCountries.length;
    showInfo(filteredCountries[currentCountryIndex]);
}
function toggleAllCountries() {
    const modal = document.getElementById('countries-modal');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) renderCountriesList();
}
function renderCountriesList() {
    const list = document.getElementById('countries-list');
    list.innerHTML = '';
    paisesDB.forEach(c => {
        const div = document.createElement('div'); div.className = 'country-item';
        div.innerHTML = `<img src="https://flagcdn.com/w40/${c.bandera}.png"><span>${c.nombre}</span>`;
        div.onclick = () => { showInfo(c); toggleAllCountries(); };
        list.appendChild(div);
    });
}
function showModule(mod) {
    document.querySelectorAll('.module-btn').forEach(b => b.classList.remove('active'));
    const tb = document.querySelector(`.module-btn[onclick="showModule('${mod}')"]`);
    if (tb) tb.classList.add('active');
    document.querySelectorAll('.module-panel').forEach(p => p.classList.remove('active'));
    const pn = document.getElementById('panel-'+mod);
    if (pn) pn.classList.add('active');
    if (mod === 'mapa') {
        document.getElementById('modulesContainer').style.display = 'none';
        document.getElementById('appLayout').style.display = 'flex';
        setTimeout(() => { if (map) map.invalidateSize(); }, 200);
    } else {
        document.getElementById('modulesContainer').style.display = 'block';
        document.getElementById('appLayout').style.display = 'none';
        // Recargar contenido de módulos
        if (mod === 'paises') loadPaisesTable();
        if (mod === 'autoridades') loadAutoridades();
        if (mod === 'bilateral') renderBilateralContent();
        if (mod === 'multilateral') renderMultilateralContent();
        if (mod === 'hitos') loadHitos();
        if (mod === 'embajadas') loadEmbajadas();
        if (mod === 'auditoria') renderAuditLog();
        if (mod === 'admin') updateAdminAccess();
        if (mod === 'equipo') document.getElementById('teamGrid').innerHTML = '<div class="team-card">Contenido del equipo</div>';
    }
}
function doLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    const user = users.find(uu => uu.login === u && uu.password === p);
    if (user) {
        currentUser = user;
        registerAudit('Inicio de sesión', 'Acceso correcto');
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'block';
        document.getElementById('headerUsername').innerText = user.name;
        document.getElementById('headerRole').innerText = user.role === 'admin' ? 'Admin' : 'Lector';
        document.getElementById('headerRole').className = 'role-badge ' + (user.role === 'admin' ? 'role-admin' : 'role-viewer');
        setTimeout(() => {
            initMap();
            loadPaisesTable();
            loadAutoridades();
            loadEmbajadas();
            populateCountrySelect();
            loadUsers();
            loadHitos();
            renderAuditLog();
            updateAdminAccess();
            renderBilateralContent();
            renderMultilateralContent();
            startAuthorityPhotoSync();
        }, 300);
    } else {
        document.getElementById('loginError').style.display = 'block';
        registerAudit('Acceso fallido', `Usuario: ${u}`);
    }
}
function doLogout() {
    registerAudit('Cierre de sesión', 'Salió');
    currentUser = null;
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appPage').style.display = 'none';
    if (map) map.remove();
}
function openDownloadModal() { document.getElementById('downloadModal').classList.add('show'); }
function closeDownloadModal() { document.getElementById('downloadModal').classList.remove('show'); }

// Carga inicial de idioma
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('afridata_language') || 'es';
    setLanguage(savedLang);
    document.getElementById('langSelect').value = savedLang;
    loadAuditLog();
    loadAuthorityPhotoCache();
    renderAuditLog();
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('es-VE');
});