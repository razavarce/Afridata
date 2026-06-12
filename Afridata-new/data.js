// ==================== DATOS ESTÁTICOS ====================
const paisesDB = [
  { id:1, nombre:"Argelia", capital:"Argel", region:"norte", presidente:"Abdelmadjid Tebboune", gobierno:"República Semipresidencial", poblacion:47.1, bandera:"dz", lat:28.0339, lng:1.6596, cultura:"Herencia bereber", tradicion:"Ramadán", recursos:"Gas, petróleo", economia:"PIB $187B", relacionesVenezuela:"1963", embajada:"Argel", foto:"https://..." },
  // ... los otros 54 países
];

const regionColors = { norte:"#ef4444", occidental:"#3b82f6", central:"#10b981", oriental:"#f59e0b", austral:"#9b5cf6" };
const regionNames = { norte:"Norte", occidental:"Occidental", central:"Central", oriental:"Oriental", austral:"Austral" };

const hitosData = [ /* ... */ ];
const hitosCategorias = { /* ... */ };

const bilateralData = { /* ... */ };
const efemeridesDB = { /* ... */ };
const multilateralData = { /* ... */ };

const translations = {
  es: { /* ... */ },
  en: { /* ... */ },
  fr: { /* ... */ }
};

let users = [
  { id:1, name:"Administrador", login:"admin", password:"admin", role:"admin" },
  { id:2, name:"Usuario Lectura", login:"viewer", password:"viewer", role:"viewer" }
];