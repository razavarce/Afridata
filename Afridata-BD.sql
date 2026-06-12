-- ==================================================================
-- BASE DE DATOS PARA AFRIDATA (MPPRE - Despacho para África)
-- MariaDB / MySQL compatible
-- ==================================================================

CREATE DATABASE IF NOT EXISTS afridata_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE afridata_db;

-- ==================================================================
-- TABLAS PRINCIPALES
-- ==================================================================

-- Regiones de África (5 regiones)
CREATE TABLE regions (
    id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(30) NOT NULL,          -- 'norte', 'occidental', ...
    display_name VARCHAR(30) NOT NULL,         -- 'África del Norte', 'África Occidental', ...
    color_code  CHAR(7) NOT NULL,              -- '#ef4444', etc.
    PRIMARY KEY (id),
    UNIQUE KEY uk_region_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Países africanos (55)
CREATE TABLE countries (
    id                   SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(100) NOT NULL,
    official_name        VARCHAR(200) NOT NULL,
    capital              VARCHAR(100) NOT NULL,
    region_id            TINYINT UNSIGNED NOT NULL,
    president            VARCHAR(120) NOT NULL,
    previous_president   VARCHAR(120) DEFAULT NULL,
    census_population    VARCHAR(80) DEFAULT NULL,   -- texto ej. "44.700.000 (2021)"
    population_millions  DECIMAL(6,2) NOT NULL,      -- millones de habitantes
    area_km2             INT UNSIGNED NOT NULL,
    language             VARCHAR(100) NOT NULL,
    currency             VARCHAR(80) NOT NULL,
    industries           TEXT,
    relations_venezuela  VARCHAR(20) DEFAULT NULL,   -- año o 'N/A'
    embassy_info         TEXT,                       -- descripción de la embajada venezolana
    flag_code            CHAR(2) NOT NULL,           -- código ISO 3166-1 alfa-2
    lat                  DECIMAL(9,6) NOT NULL,
    lng                  DECIMAL(9,6) NOT NULL,
    culture              TEXT,
    traditions           TEXT,
    resources            TEXT,
    economy              TEXT,
    foto_url             VARCHAR(512) DEFAULT NULL,  -- URL foto del presidente
    government_type      VARCHAR(100) NOT NULL,      -- ej. "República Semipresidencial"
    PRIMARY KEY (id),
    UNIQUE KEY uk_country_name (name),
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT,
    INDEX idx_region (region_id),
    INDEX idx_president (president),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuarios del sistema
CREATE TABLE users (
    id          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    login       VARCHAR(50) NOT NULL,
    password    VARCHAR(255) NOT NULL,   -- En producción usar hash; aquí se almacena en texto plano por compatibilidad con demo
    role        ENUM('admin', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_login (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Auditoría de acciones
CREATE TABLE audit_log (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     SMALLINT UNSIGNED DEFAULT NULL,
    action      VARCHAR(255) NOT NULL,
    change_detail TEXT,
    log_date    DATE NOT NULL,
    log_time    TIME NOT NULL,
    timestamp   DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_date (log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estado bilateral (país a país)
CREATE TABLE bilateral_status (
    country_id           SMALLINT UNSIGNED NOT NULL,
    status               ENUM('active', 'limited', 'none') NOT NULL DEFAULT 'none',
    has_embassy          BOOLEAN NOT NULL DEFAULT FALSE,
    strategic_level      ENUM('alta', 'media', 'baja') NOT NULL DEFAULT 'media',
    relations_since_year VARCHAR(10) DEFAULT NULL,  -- año o 'N/A'
    PRIMARY KEY (country_id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Acuerdos bilaterales (convenios)
CREATE TABLE agreements (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id      SMALLINT UNSIGNED NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    agreement_date  VARCHAR(20) DEFAULT NULL,   -- año o fecha texto
    status          VARCHAR(30) DEFAULT 'Vigente',
    type            VARCHAR(50) DEFAULT NULL,   -- energético, comercial, etc.
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    INDEX idx_country (country_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Áreas de cooperación estratégica (muchos a muchos)
CREATE TABLE strategic_areas (
    id   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_strategic_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE country_strategic_areas (
    country_id   SMALLINT UNSIGNED NOT NULL,
    area_id      TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (country_id, area_id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES strategic_areas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Áreas de cooperación operativa
CREATE TABLE cooperation_areas (
    id   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_coop_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE country_cooperation_areas (
    country_id   SMALLINT UNSIGNED NOT NULL,
    area_id      TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (country_id, area_id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES cooperation_areas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Organizaciones multilaterales
CREATE TABLE multilateral_orgs (
    id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(80) NOT NULL,
    icon        VARCHAR(10) DEFAULT NULL,   -- emoji o código
    icon_class  VARCHAR(30) DEFAULT NULL,   -- clase CSS
    description TEXT,
    PRIMARY KEY (id),
    UNIQUE KEY uk_org_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Membresías de países en organizaciones multilaterales
CREATE TABLE multilateral_memberships (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id   SMALLINT UNSIGNED NOT NULL,
    org_id       TINYINT UNSIGNED NOT NULL,
    since_year   VARCHAR(20) DEFAULT NULL,
    details      TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES multilateral_orgs(id) ON DELETE CASCADE,
    UNIQUE KEY uk_country_org (country_id, org_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hitos históricos (relación Venezuela-África)
CREATE TABLE milestones (
    id          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    fecha       VARCHAR(20) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    category    VARCHAR(30) NOT NULL,    -- diplomatico, embajada, visita, cumbre, acuerdo, etc.
    icon        VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_fecha (fecha),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relación hitos <-> países (muchos a muchos)
CREATE TABLE milestone_countries (
    milestone_id SMALLINT UNSIGNED NOT NULL,
    country_id   SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (milestone_id, country_id),
    FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Embajadas de Venezuela en África
CREATE TABLE embassies_venezuela (
    id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id   SMALLINT UNSIGNED NOT NULL,
    city         VARCHAR(100) NOT NULL,
    ambassador   VARCHAR(120) NOT NULL,
    concurrencies VARCHAR(200) DEFAULT NULL,
    status       VARCHAR(20) DEFAULT 'Activa',
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE KEY uk_embassy_country (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Embajadas africanas acreditadas en Venezuela
CREATE TABLE embassies_africa_in_ve (
    id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id   SMALLINT UNSIGNED NOT NULL,
    city_ve      VARCHAR(100) NOT NULL DEFAULT 'Caracas',
    ambassador   VARCHAR(120) NOT NULL,
    status       VARCHAR(20) DEFAULT 'Activa',
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE KEY uk_african_embassy (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Efemérides por país (días importantes)
CREATE TABLE efemerides (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id  SMALLINT UNSIGNED NOT NULL,
    fecha       VARCHAR(30) NOT NULL,
    titulo      VARCHAR(200) NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    INDEX idx_country (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================
-- INSERCIÓN DE DATOS INICIALES
-- ==================================================================

-- Regiones
INSERT INTO regions (name, display_name, color_code) VALUES
('norte', 'África del Norte', '#ef4444'),
('occidental', 'África Occidental', '#3b82f6'),
('central', 'África Central', '#10b981'),
('oriental', 'África Oriental', '#f59e0b'),
('austral', 'África Austral', '#9b5cf6');

-- Usuarios (admin / viewer) – contraseñas en texto plano para coincidir con la demo actual
INSERT INTO users (name, login, password, role) VALUES
('Administrador', 'admin', 'admin', 'admin'),
('Usuario Lectura', 'viewer', 'viewer', 'viewer');

-- Países (55) – basado en paisesDB del script original
-- Nota: Se incluye la mayoría de campos; algunos como census_population se dejan NULL.
-- Los datos se han extraído fielmente del array paisesDB.
INSERT INTO countries (id, name, official_name, capital, region_id, president, previous_president, census_population, population_millions, area_km2, language, currency, industries, relations_venezuela, embassy_info, flag_code, lat, lng, culture, traditions, resources, economy, foto_url, government_type) VALUES
(1, 'Argelia', 'República Argelina Democrática y Popular', 'Argel', (SELECT id FROM regions WHERE name='norte'), 'Abdelmadjid Tebboune', 'Ahmed Ben Bella (1963-1965)', '44.700.000 (2021)', 47.1, 2381741, 'Árabe, Tamazight', 'Dinar argelino (DZD)', 'Petróleo, Gas Natural, Minería', '1963', 'Argel — Emb. José De Jesús Sojo Reyes', 'dz', 28.033900, 1.659600, 'Herencia bereber y árabe, gastronomía couscous, música raï, tradiciones del Sahara', 'Ramadán, Festival Internacional de Cine de Argel, bodas bereberes', '3er mayor productor de gas del mundo, reservas de petróleo, minería', 'PIB: $187B | PIB/cap: $4,000 | Inflación: 9.3%. Dependencia del petróleo y gas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Abdelmadjid_Tebboune_in_2023.jpg/440px-Abdelmadjid_Tebboune_in_2023.jpg', 'República Semipresidencial'),
(2, 'Egipto', 'República Árabe de Egipto', 'El Cairo', (SELECT id FROM regions WHERE name='norte'), 'Abdelfatah El-Sisi', 'Mohamed Naguib (1953-1954)', '101.334.404 (2020)', 114.5, 1001450, 'Árabe', 'Libra egipcia (EGP)', 'Turismo, Canal de Suez, Petróleo, Textil', '1949', 'El Cairo — Emb. Wilmer Omar Barrientos Fernández', 'eg', 26.820600, 30.802500, 'Cuna de la civilización faraónica, pirámides de Giza, patrimonio UNESCO, cultura copta', 'Ramadán, Festival de Abu Simbel, navegación por el Nilo', 'Canal de Suez, gas natural, turismo, petróleo, fosfatos', 'PIB: $398B | PIB/cap: $3,500. Diversificación hacia turismo y manufactura.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Abdel_Fattah_el-Sisi_%28cropped%29.jpg/440px-Abdel_Fattah_el-Sisi_%28cropped%29.jpg', 'República Semipresidencial'),
(3, 'Libia', 'Estado de Libia', 'Trípoli', (SELECT id FROM regions WHERE name='norte'), 'Mohammed al-Menfi', 'Rey Idris (1951-1969)', '6.595.000 (2021)', 7.0, 1759540, 'Árabe', 'Dinar libio (LYD)', 'Petróleo, Gas Natural', '1973', 'Trípoli (situación en conflicto)', 'ly', 26.335100, 17.228300, 'Herencia bereber, arquitectura colonial italiana, tradiciones del desierto', 'Festival de Ghadames, tradiciones tuareg', 'Mayores reservas de petróleo de África, gas natural', 'PIB: $48B. Economía dependiente del petróleo en conflicto.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mohamed_al-Menfi_%282021%29.jpg/440px-Mohamed_al-Menfi_%282021%29.jpg', 'Gobierno Interino (Conflicto)'),
(4, 'Marruecos', 'Reino de Marruecos', 'Rabat', (SELECT id FROM regions WHERE name='norte'), 'Rey Mohammed VI', 'Mohammed V (1955-1958)', '37.034.729 (2020)', 38.3, 446550, 'Árabe, Bereber, Francés', 'Dirham marroquí (MAD)', 'Fosfatos, Turismo, Agricultura, Textil', '1960', 'Rabat — Emb. Dana María Casanova Cuícas', 'ma', 31.791700, -7.092600, 'Mezcla árabe, bereber y europea, ciudades imperiales, zocos', 'Ramadán, Festival de Fès, ceremonia del té, hammam', '75% de reservas mundiales de fosfatos, turismo', 'PIB: $132B | PIB/cap: $3,400. Potencia regional en turismo.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/King_Mohammed_VI_of_Morocco_in_2023.jpg/440px-King_Mohammed_VI_of_Morocco_in_2023.jpg', 'Monarquía Parlamentaria'),
(5, 'Sudán', 'República del Sudán', 'Jartum', (SELECT id FROM regions WHERE name='norte'), 'Abdel Fattah al-Burhan', 'Ismail Al-Azhari (1954-1956)', '42.268.264 (2020)', 49.3, 1861484, 'Árabe, Inglés', 'Libra sudanesa (SDG)', 'Petróleo, Agricultura, Ganadería', '1962', 'N/A (conflicto)', 'sd', 12.862800, 30.217600, 'Nubia antigua, pirámides de Meroe, tradiciones islámicas', 'Bodas nubias, mercado de Jartum, café sudanés', 'Petróleo, oro, goma arábiga (mayor productor mundial)', 'PIB: $34B. Economía en recuperación tras conflictos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Abdel_Fattah_al-Burhan_in_2023.jpg/440px-Abdel_Fattah_al-Burhan_in_2023.jpg', 'Gobierno Militar (Conflicto)'),
(6, 'Túnez', 'República Tunecina', 'Túnez', (SELECT id FROM regions WHERE name='norte'), 'Kais Saied', 'Habib Bourguiba (1956-1957)', '11.746.695 (2020)', 12.6, 163610, 'Árabe, Francés', 'Dinar tunecino (TND)', 'Turismo, Manufactura, Petróleo, Textil', '1960', 'Túnez — Emb. Carlos Federico Feo Acevedo', 'tn', 33.886900, 9.537500, 'Herencia cartaginesa, medinas UNESCO, cultura mediterránea-árabe', 'Festival de Cartago, Ramadán, bodas tunecinas', 'Fosfatos, petróleo, turismo, olivos', 'PIB: $46B | PIB/cap: $3,700. Turismo como pilar.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Kais_Saied_in_2023.jpg/440px-Kais_Saied_in_2023.jpg', 'República Presidencial'),
(7, 'Sáhara Occidental', 'República Árabe Saharaui Democrática', 'El Aaiún', (SELECT id FROM regions WHERE name='norte'), 'Brahim Ghali', 'El-Ouali Mustafa Sayed (1976-1976)', '510.713 (2014)', 0.6, 266000, 'Árabe, Hasani, Español', 'Dirham marroquí', 'Pesca, Fosfatos', 'Reconoce RASD', 'N/A (territorio disputado)', 'eh', 24.215500, -12.885800, 'Nómadas saharauis, cultura beduina, tradición oral hassani', 'Bodas tradicionales, música hassani, festival del desierto', 'Fosfatos, pesca, posibles reservas petroleras', 'Economía en desarrollo bajo administración disputada.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Brahim_Ghali_in_2023.jpg/440px-Brahim_Ghali_in_2023.jpg', 'Territorio en disputa'),
(8, 'Benín', 'República de Benín', 'Porto Novo', (SELECT id FROM regions WHERE name='occidental'), 'Patrice Talon', 'Hubert Maga (1960-1963)', '12.506.347 (2021)', 14.1, 112622, 'Francés', 'Franco CFA (XOF)', 'Algodón, Agricultura, Textil', '1960', 'Cotonú (Concurrencia desde Senegal)', 'bj', 9.307700, 2.315800, 'Cuna del vudú, reino de Dahomey, tradiciones yoruba', 'Festival de Porto Novo, ceremonia vudú', 'Algodón, aceite de palma, mármol', 'PIB: $18B | PIB/cap: $1,300. Basada en algodón.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Patrice_Talon_in_2023.jpg/440px-Patrice_Talon_in_2023.jpg', 'República Presidencial'),
(9, 'Burkina Faso', 'Burkina Faso', 'Uagadugú', (SELECT id FROM regions WHERE name='occidental'), 'Ibrahim Traoré', 'Maurice Yaméogo (1960-1966)', '18.450.494 (2015)', 23.9, 274200, 'Francés', 'Franco CFA (XOF)', 'Oro, Algodón, Agricultura', '1976', 'N/A', 'bf', 12.238300, -1.561600, 'Festival FESPACO, máscaras Bobo, tradiciones mossi', 'Máscaras rituales, festival de cine', '4to mayor productor de oro de África', 'PIB: $19B | PIB/cap: $800. En transición política.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Ibrahim_Traore_in_2023.jpg/440px-Ibrahim_Traore_in_2023.jpg', 'Transición Militar'),
(10, 'Cabo Verde', 'República de Cabo Verde', 'Praia', (SELECT id FROM regions WHERE name='occidental'), 'José Maria Neves', 'Aristides Pereira (1975-1991)', '563.198 (2021)', 0.6, 4033, 'Portugués', 'Escudo caboverdiano (CVE)', 'Turismo, Servicios, Pesca', '1975', 'N/A', 'cv', 16.538800, -23.041800, 'Música morna (Cesária Évora), mezcla africana-portuguesa', 'Festival de música, carnaval de Mindelo', 'Turismo, energía eólica, sal', 'PIB: $2.3B | PIB/cap: $3,800. Turismo como motor.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Jose_Maria_Neves_in_2023.jpg/440px-Jose_Maria_Neves_in_2023.jpg', 'República Parlamentaria'),
(11, 'Costa de Marfil', 'República de Costa de Marfil', 'Yamusukro', (SELECT id FROM regions WHERE name='occidental'), 'Alassane Ouattara', 'Félix Houphouet-Boigny (1960-1993)', '27.087.732 (2021)', 30.6, 322463, 'Francés', 'Franco CFA (XOF)', 'Cacao, Petróleo, Agricultura', '1960', 'N/A', 'ci', 7.540000, -5.547100, '15 grupos étnicos, festival de máscaras, cultura baoulé', 'Festival de máscaras de Man, boda baoulé', 'Mayor productor mundial de cacao, petróleo, oro', 'PIB: $78B | PIB/cap: $2,600. Recuperación post-conflicto.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Alassane_Ouattara_in_2023.jpg/440px-Alassane_Ouattara_in_2023.jpg', 'República Presidencial'),
(12, 'Gambia', 'República de Gambia', 'Banjul', (SELECT id FROM regions WHERE name='occidental'), 'Adama Barrow', 'Dawda Jawara (1962-1970)', '2.487.000 (2021)', 2.7, 11295, 'Inglés', 'Dalasi gambiano (GMD)', 'Turismo, Agricultura, Pesca', 'N/A', 'N/A', 'gm', 13.443200, -15.310100, 'Tradición oral griot, música kora, río Gambia', 'Festival del río Gambia, raíces africanas', 'Turismo, maní, pesca', 'PIB: $2.2B | PIB/cap: $800. Turismo y agricultura.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Adama_Barrow_in_2023.jpg/440px-Adama_Barrow_in_2023.jpg', 'República Presidencial'),
(13, 'Ghana', 'República de Ghana', 'Accra', (SELECT id FROM regions WHERE name='occidental'), 'Nana Akufo-Addo', 'Kwame Nkrumah (1957-1966)', '31.072.040 (2020)', 34.7, 238533, 'Inglés', 'Cedi ghanés (GHS)', 'Oro, Petróleo, Cacao, Servicios', '1960', 'N/A', 'gh', 7.946500, -1.023200, 'Reinos Ashanti, kente, festivales panafricanos', 'Festival Homowo, tejido kente, ceremonias', '2do mayor productor de oro de África, petróleo, cacao', 'PIB: $75B | PIB/cap: $2,200. Economía diversificada.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Nana_Akufo-Addo_in_2023.jpg/440px-Nana_Akufo-Addo_in_2023.jpg', 'República Presidencial'),
(14, 'Guinea', 'República de Guinea', 'Conakri', (SELECT id FROM regions WHERE name='occidental'), 'Mamady Doumbouya', 'Ahmed Sékou Touré (1958-1984)', '12.907.395 (2021)', 14.7, 245857, 'Francés', 'Franco guineano (GNF)', 'Bauxita, Oro, Agricultura', 'N/A', 'N/A', 'gn', 9.945600, -9.696600, 'Música de djembe, tradiciones fulani, reino de Samori', 'Festival de máscaras, música tradicional', 'Mayor productor de bauxita del mundo, oro, diamantes', 'PIB: $21B | PIB/cap: $1,400. Potencial minero enorme.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mamady_Doumbouya_in_2023.jpg/440px-Mamady_Doumbouya_in_2023.jpg', 'Transición Militar'),
(15, 'Guinea-Bisáu', 'República de Guinea-Bisáu', 'Bisáu', (SELECT id FROM regions WHERE name='occidental'), 'Umaro Sissoco Embaló', 'Luis Cabral (1973-1980)', '1.530.673 (2021)', 2.2, 36125, 'Portugués', 'Franco CFA (XOF)', 'Cajú, Pesca, Agricultura', 'N/A', 'Bisáu (Vacante)', 'gw', 11.803700, -15.180400, 'Mezcla portuguesa-africana, islas Bijagós (UNESCO)', 'Carnaval de Bisáu, fiestas tradicionales', 'Cajú (principal exportación), pesca, reservas de gas', 'PIB: $1.7B | PIB/cap: $800. Cajú y pesca.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Umaro_Sissoco_Embalo_in_2023.jpg/440px-Umaro_Sissoco_Embalo_in_2023.jpg', 'República Semipresidencial'),
(16, 'Liberia', 'República de Liberia', 'Monrovia', (SELECT id FROM regions WHERE name='occidental'), 'Joseph Boakai', 'Joseph Jenkins Roberts (1848-1856)', '4.661.010 (2021)', 5.5, 111369, 'Inglés', 'Dólar liberiano (LRD)', 'Hierro, Goma, Servicios Marítimos', 'N/A', 'N/A', 'lr', 6.428100, -9.429500, 'Fundada por esclavos liberados, cultura américo-liberiana', 'Sociedades secretas Poro y Sande', 'Mineral de hierro, caucho natural, madera', 'PIB: $3.8B | PIB/cap: $700. Recuperación post-guerra.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Joseph_Boakai_in_2024.jpg/440px-Joseph_Boakai_in_2024.jpg', 'República Presidencial'),
(17, 'Malí', 'República de Malí', 'Bamako', (SELECT id FROM regions WHERE name='occidental'), 'Assimi Goïta', 'Modibo Keita (1960-1968)', '20.856.000 (2021)', 24.0, 1240192, 'Francés, Bambara', 'Franco CFA (XOF)', 'Oro, Algodón, Ganadería', '1960', 'Bamako — Emb. Oscar Ernesto Romero Vallenilla', 'ml', 17.570700, -3.996200, 'Imperio de Malí, manuscritos de Tombuctú (UNESCO)', 'Festival au Désert, griots, ceremonia de la lluvia', '3er mayor productor de oro de África, algodón, sal', 'PIB: $20B | PIB/cap: $850. En transición política.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Assimi_Goita_in_2023.jpg/440px-Assimi_Goita_in_2023.jpg', 'Transición Militar'),
(18, 'Mauritania', 'República Islámica de Mauritania', 'Nuakchot', (SELECT id FROM regions WHERE name='occidental'), 'Mohamed Ould Ghazouani', 'Moktar Ould Daddah (1960-1978)', '3.718.678 (2016)', 5.0, 1030700, 'Árabe', 'Ouguiya (MRU)', 'Hierro, Pesca, Petróleo', 'N/A', 'N/A', 'mr', 21.007900, -10.940800, 'Cultura nómada, música morisca, tradiciones árabes-bereberes', 'Festival de música de Atar, té moro', 'Mineral de hierro, gas natural offshore, pesca', 'PIB: $10B | PIB/cap: $2,000. Descubrimientos de gas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mohamed_Ould_Ghazouani_in_2023.jpg/440px-Mohamed_Ould_Ghazouani_in_2023.jpg', 'República Presidencial'),
(19, 'Níger', 'República del Níger', 'Niamey', (SELECT id FROM regions WHERE name='occidental'), 'Abdourahamane Tchiani', 'Hamani Diori (1960-1974)', '24.112.753 (2021)', 28.5, 1267000, 'Francés, Hausa', 'Franco CFA (XOF)', 'Uranio, Ganadería, Agricultura', 'N/A', 'N/A', 'ne', 17.607800, 8.081700, 'Festivales tuareg, música waka, tradiciones hausas', 'Festival de Cure Salée, gerewol (Wodaabe)', '6to mayor productor de uranio del mundo, oro', 'PIB: $17B | PIB/cap: $600. En transición política.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Abdourahamane_Tchiani_in_2023.jpg/440px-Abdourahamane_Tchiani_in_2023.jpg', 'Transición Militar'),
(20, 'Nigeria', 'República Federal de Nigeria', 'Abuya', (SELECT id FROM regions WHERE name='occidental'), 'Bola Ahmed Tinubu', 'Sir Abubakar Tafawa Balewa (1960-1966)', '206.139.589 (2020)', 230.9, 923768, 'Inglés, Hausa, Yoruba, Igbo', 'Naira (NGN)', 'Petróleo, Telecomunicaciones, Nollywood', '1960', 'Abuya — Emb. David Nieves Velásquez Caraballo', 'ng', 9.082000, 8.675300, 'Nollywood, música afrobeats, 250+ grupos étnicos', 'Festival de Durbar, carnaval de Calabar', 'Mayor productor de petróleo de África, gas natural', 'PIB: $477B | PIB/cap: $2,100. Economía más grande de África.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bola_Tinubu_in_2023.jpg/440px-Bola_Tinubu_in_2023.jpg', 'República Federal Presidencial'),
(21, 'Senegal', 'República de Senegal', 'Dakar', (SELECT id FROM regions WHERE name='occidental'), 'Bassirou Diomaye Faye', 'Léopold Sédar Senghor (1960-1980)', '14.354.690 (2015)', 18.2, 196722, 'Francés, Wolof', 'Franco CFA (XOF)', 'Pesca, Maní, Fosfatos, Turismo', '1962', 'Dakar — Emb. Alejandro Israel Correa Ortega', 'sn', 14.497400, -14.452400, 'Teranga (hospitalidad), música mbalax, isla de Gorée (UNESCO)', 'Festival de Saint-Louis, wrestling senegalés', 'Pesca, fosfatos, gas offshore, oro', 'PIB: $29B | PIB/cap: $1,600. Descubrimientos de gas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bassirou_Diomaye_Faye_in_2024.jpg/440px-Bassirou_Diomaye_Faye_in_2024.jpg', 'República Semipresidencial'),
(22, 'Sierra Leona', 'República de Sierra Leona', 'Freetown', (SELECT id FROM regions WHERE name='occidental'), 'Julius Maada Bio', 'Milton Augusto Margai (1895-1964)', '8.297.882 (2021)', 8.9, 71740, 'Inglés', 'Leone (SLL)', 'Diamantes, Titanio, Agricultura', 'N/A', 'N/A', 'sl', 8.460600, -11.779900, 'Krio, sociedades secretas, música palmwine', 'Festival de máscaras, bodas tradicionales', 'Diamantes, rutilo, bauxita, oro', 'PIB: $4.5B | PIB/cap: $500. Recuperación post-ébola.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Julius_Maada_Bio_in_2023.jpg/440px-Julius_Maada_Bio_in_2023.jpg', 'República Presidencial'),
(23, 'Togo', 'República Togolesa', 'Lomé', (SELECT id FROM regions WHERE name='occidental'), 'Faure Gnassingbé', 'Sylvanus Olympio (1902-1963)', '7.886.000 (2021)', 9.4, 56785, 'Francés', 'Franco CFA (XOF)', 'Fosfatos, Cacao, Café, Comercio', 'N/A', 'N/A', 'tg', 8.619500, 0.824800, 'Vudú, festivales étnicos, mercado de Lomé', 'Festival de Evala (lucha), vudú tradicional', 'Fosfatos, cacao, café, mármol', 'PIB: $8.8B | PIB/cap: $950. Hub comercial.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Faure_Gnassingbe_in_2023.jpg/440px-Faure_Gnassingbe_in_2023.jpg', 'República Presidencial'),
(24, 'Camerún', 'República de Camerún', 'Yaundé', (SELECT id FROM regions WHERE name='central'), 'Paul Biya', 'Ahmadou Ahidjo (1960-1982)', '28.524.175 (2021)', 29.3, 475442, 'Francés, Inglés', 'Franco CFA (XAF)', 'Petróleo, Cacao, Café, Madera', '1961', 'N/A', 'cm', 7.369700, 12.354700, '250+ grupos étnicos, música bikutsi, cultura bamiléké', 'Festival de Ngondo, lucha tradicional', 'Petróleo, madera tropical, cacao, aluminio', 'PIB: $46B | PIB/cap: $1,600. Diversificación en curso.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Paul_Biya_in_2023.jpg/440px-Paul_Biya_in_2023.jpg', 'República Presidencial'),
(25, 'Chad', 'República de Chad', 'Yamena', (SELECT id FROM regions WHERE name='central'), 'Mahamat Déby Itno', 'François Tombalbaye (1960-1975)', '16.818.391 (2021)', 19.3, 1284000, 'Francés, Árabe', 'Franco CFA (XAF)', 'Petróleo, Algodón, Ganadería', 'N/A', 'N/A', 'td', 15.454200, 18.732200, 'Pueblos del Sahel, lago Chad, cultura árabe-africana', 'Festival de Gerewol, mercado de Yamena', 'Petróleo, algodón, ganado, oro', 'PIB: $12B | PIB/cap: $650. Dependiente del petróleo.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mahamat_Deby_Itno_in_2023.jpg/440px-Mahamat_Deby_Itno_in_2023.jpg', 'Transición Militar'),
(26, 'Gabón', 'República Gabonesa', 'Libreville', (SELECT id FROM regions WHERE name='central'), 'Brice Oligui Nguema', 'Léon M''ba (1957-1961)', '2.233.272 (2021)', 2.5, 267668, 'Francés', 'Franco CFA (XAF)', 'Petróleo, Manganeso, Madera', 'N/A', 'N/A', 'ga', 0.416200, 9.467300, 'Bwiti, máscaras Fang, selva tropical', 'Ceremonias Bwiti, festival Akini', 'Petróleo, manganeso (4to productor mundial), madera', 'PIB: $19B | PIB/cap: $7,500. Transición reciente.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Brice_Oligui_Nguema_in_2023.jpg/440px-Brice_Oligui_Nguema_in_2023.jpg', 'Transición Militar'),
(27, 'Guinea Ecuatorial', 'República de Guinea Ecuatorial', 'Malabo', (SELECT id FROM regions WHERE name='central'), 'Teodoro Obiang', 'Francisco Macías Nguema (1968-1979)', '1.505.588 (2021)', 1.8, 28051, 'Español, Francés, Portugués', 'Franco CFA (XAF)', 'Petróleo, Gas Natural, Madera', '1979', 'Malabo — Emb. Nelson Javier Ortega Bonilla', 'gq', 1.650800, 10.267900, 'Único país africano hispanohablante, cultura bubi', 'Festival de Malabo, danzas bubi', 'Petróleo, gas natural, madera tropical', 'PIB: $11B | PIB/cap: $6,000. Economía petrolera.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Teodoro_Obiang_Nguema_Mbasogo_in_2023.jpg/440px-Teodoro_Obiang_Nguema_Mbasogo_in_2023.jpg', 'República Presidencial'),
(28, 'R. Centroafricana', 'República Centroafricana', 'Bangui', (SELECT id FROM regions WHERE name='central'), 'Faustin-Archange Touadéra', 'David Dacko (1960-1966)', '3.859.139 (2017)', 5.6, 622984, 'Francés, Sango', 'Franco CFA (XAF)', 'Diamantes, Madera, Agricultura', 'N/A', 'N/A', 'cf', 6.611100, 20.939400, 'Pueblos pigmeos, selva tropical, tradiciones bantúes', 'Danzas pigmeas, mercado de Bangui', 'Diamantes, oro, madera, uranio', 'PIB: $2.5B | PIB/cap: $450. Post-conflicto.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Faustin-Archange_Touadera_in_2023.jpg/440px-Faustin-Archange_Touadera_in_2023.jpg', 'República Presidencial'),
(29, 'R. D. del Congo', 'República Democrática del Congo', 'Kinsasa', (SELECT id FROM regions WHERE name='central'), 'Félix Tshisekedi', 'Patrice Emery Lumumba (1925-1961)', '115.261.403 (2020)', 105.0, 2344858, 'Francés', 'Franco congoleño (CDF)', 'Cobalto, Cobre, Diamantes, Coltan', '1960', 'N/A', 'cd', -4.038300, 21.758700, 'Música soukous/rumba, selva del Congo, cultura kongo', 'Festival de música de Kinsasa, danzas tradicionales', '70% del cobalto mundial, coltan, diamantes, cobre', 'PIB: $62B | PIB/cap: $600. Potencial minero enorme.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Felix_Tshisekedi_in_2023.jpg/440px-Felix_Tshisekedi_in_2023.jpg', 'República Semipresidencial'),
(30, 'R. del Congo', 'República del Congo', 'Brazzaville', (SELECT id FROM regions WHERE name='central'), 'Denis Sassou Nguesso', 'Fulbert Youlou (1960-1963)', '5.657.000 (2019)', 6.2, 342000, 'Francés', 'Franco CFA (XAF)', 'Petróleo, Madera, Minería', 'N/A', 'Brazzaville — Emb. Aníbal José Márquez Muñoz', 'cg', -0.228000, 15.827700, 'Cultura kongo, música congoleña, tradiciones bantúes', 'Ceremonias kongo, festival de música', 'Petróleo, madera, potasa, gas natural', 'PIB: $14B | PIB/cap: $2,300. Economía petrolera.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Denis_Sassou-Nguesso_in_2023.jpg/440px-Denis_Sassou-Nguesso_in_2023.jpg', 'República Presidencial'),
(31, 'Santo Tomé y Príncipe', 'República de Santo Tomé y Príncipe', 'Santo Tomé', (SELECT id FROM regions WHERE name='central'), 'Carlos Vila Nova', 'Manuel Pinto da Costa (1975-1991)', '201.784 (2018)', 0.2, 964, 'Portugués', 'Dobra (STN)', 'Cacao, Turismo, Pesca', 'N/A', 'N/A', 'st', 0.186400, 6.613100, 'Forró, cultura criolla portuguesa, islas volcánicas', 'Festival de São Tomé, música forró, carnaval', 'Cacao fino, reservas de petróleo offshore', 'PIB: $0.5B | PIB/cap: $2,500. Turismo en desarrollo.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Carlos_Vila_Nova_in_2023.jpg/440px-Carlos_Vila_Nova_in_2023.jpg', 'República Semipresidencial'),
(32, 'Burundi', 'República de Burundi', 'Gitega', (SELECT id FROM regions WHERE name='oriental'), 'Évariste Ndayishimiye', 'André Muhirwa (1961-1963)', '9.823.828 (2015)', 13.6, 27834, 'Kirundi, Francés', 'Franco burundés (BIF)', 'Café, Té, Minería', 'N/A', 'N/A', 'bi', -3.373100, 29.918900, 'Danzas de tambores sagrados, lago Tanganica', 'Ceremonia de los tambores sagrados (UNESCO)', 'Níquel, uranio, cobalto, oro', 'PIB: $3.2B | PIB/cap: $240. Agricultura.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Evariste_Ndayishimiye_in_2023.jpg/440px-Evariste_Ndayishimiye_in_2023.jpg', 'República Presidencial'),
(33, 'Comoras', 'Unión de las Comoras', 'Moroni', (SELECT id FROM regions WHERE name='oriental'), 'Azali Assoumani', 'Ahmed Abdallah (1978-1989)', '806.200 (2016)', 0.9, 2235, 'Comorense, Árabe, Francés', 'Franco comorense (KMF)', 'Vainilla, Clavo, Pesca, Turismo', 'N/A', 'N/A', 'km', -11.645500, 43.333300, 'Mezcla africana-árabe, volcán Karthala, cultura swahili', 'Gran boda comorense, festival del mar', 'Vainilla, ylang-ylang, pesca', 'PIB: $1.3B | PIB/cap: $1,500. Insular.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Azali_Assoumani_in_2023.jpg/440px-Azali_Assoumani_in_2023.jpg', 'República Presidencial Federal'),
(34, 'Yibuti', 'República de Yibuti', 'Yibuti', (SELECT id FROM regions WHERE name='oriental'), 'Ismaïl Omar Guelleh', 'Hassan Gouled Aptidon (1916-2006)', '976.107 (2021)', 1.1, 23200, 'Francés, Árabe', 'Franco yibutiano (DJF)', 'Servicios Portuarios, Base Militar', 'N/A', 'N/A', 'dj', 11.825100, 42.590300, 'Nómadas afar e issa, lago Assal (punto más bajo de África)', 'Festival del lago Assal, cultura nómada', 'Puerto estratégico, sal del lago Assal', 'PIB: $3.7B | PIB/cap: $3,400. Hub logístico.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Ismail_Omar_Guelleh_in_2023.jpg/440px-Ismail_Omar_Guelleh_in_2023.jpg', 'República Semipresidencial'),
(35, 'Eritrea', 'Estado de Eritrea', 'Asmara', (SELECT id FROM regions WHERE name='oriental'), 'Isaias Afwerki', 'N/A (Independencia 1993)', '3.601.000 (2021)', 3.8, 117600, 'Tigrinya, Árabe, Inglés', 'Nakfa (ERN)', 'Minería, Agricultura, Sal', 'N/A', 'N/A', 'er', 15.179400, 39.782300, 'Arquitectura italiana de Asmara (UNESCO), iglesia copta', 'Festival de Asmara, iglesia copta, ceremonia del café', 'Oro, potasa, zinc, cobre', 'PIB: $2.2B | PIB/cap: $600. Economía aislada.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Isaias_Afwerki_in_2023.jpg/440px-Isaias_Afwerki_in_2023.jpg', 'República Unipartidista'),
(36, 'Etiopía', 'República Federal Democrática de Etiopía', 'Adís Abeba', (SELECT id FROM regions WHERE name='oriental'), 'Abiy Ahmed', 'Emperador Menelik II (1844-1913)', '109.244.414 (2018)', 129.7, 1104300, 'Amhárico, Oromo', 'Birr etíope (ETB)', 'Café, Ganadería, Manufactura, Textiles', '1948', 'Adís Abeba — Emb. Modesto Antonio Ruiz Espinoza', 'et', 9.145000, 40.489700, 'Iglesia ortodoxa, manuscritos antiguos, origen del café', 'Timkat, Meskel, ceremonia del café, ayuno ortodoxo', 'Café (origen), oro, potasa, platino', 'PIB: $126B | PIB/cap: $1,000. Rápido crecimiento.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Abiy_Ahmed_in_2023.jpg/440px-Abiy_Ahmed_in_2023.jpg', 'República Federal Parlamentaria'),
(37, 'Kenia', 'República de Kenia', 'Nairobi', (SELECT id FROM regions WHERE name='oriental'), 'William Ruto', 'Jomo Kenyatta (c. 1894-1978)', '47.564.290 (2019)', 56.6, 580367, 'Inglés, Suajili', 'Chelín keniano (KES)', 'Turismo, Té, Café, Servicios Financieros', '1971', 'Nairobi — Emb. José Gregorio Ávila Torres', 'ke', -0.023600, 37.906200, 'Safari, pueblos Maasai, cultura swahili', 'Ceremonia Maasai, festival de Lamu, boda kikuyu', 'Turismo, té, horticultura, soda ash', 'PIB: $110B | PIB/cap: $2,000. Hub tecnológico.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/William_Ruto_in_2023.jpg/440px-William_Ruto_in_2023.jpg', 'República Presidencial'),
(38, 'Madagascar', 'República de Madagascar', 'Antananarivo', (SELECT id FROM regions WHERE name='oriental'), 'Andry Rajoelina', 'Filiberto Tsiranana (1912-1978)', '28.427.328 (2021)', 31.7, 587041, 'Malgache, Francés', 'Ariary malgache (MGA)', 'Vainilla, Minería, Textil, Turismo', 'N/A', 'N/A', 'mg', -18.766900, 46.869100, 'Lémures, baobabs, cultura austronesia-africana', 'Famadihana (giro de los huesos), festivales', 'Vainilla (1er productor mundial), minerales raros', 'PIB: $15B | PIB/cap: $500. Biodiversidad única.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Andry_Rajoelina_in_2023.jpg/440px-Andry_Rajoelina_in_2023.jpg', 'República Semipresidencial'),
(39, 'Malaui', 'República de Malaui', 'Lilongüe', (SELECT id FROM regions WHERE name='oriental'), 'Lazarus Chakwera', 'Hastings Banda (hacia 1896-1997)', '16.632.900 (2016)', 21.6, 118484, 'Inglés, Chichewa', 'Kwacha malauí (MWK)', 'Tabaco, Té, Azúcar, Café', 'N/A', 'N/A', 'mw', -13.254300, 34.301500, 'Lago Malaui (UNESCO), danza gule wamkulu', 'Festival del lago, danza Chewa, ceremonia de iniciación', 'Tabaco, uranio, carbón, bauxita', 'PIB: $11B | PIB/cap: $500. Agrícola.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Lazarus_Chakwera_in_2023.jpg/440px-Lazarus_Chakwera_in_2023.jpg', 'República Presidencial'),
(40, 'Mauricio', 'República de Mauricio', 'Port Louis', (SELECT id FROM regions WHERE name='oriental'), 'Prithvirajsing Roopun', 'Seewoosagur Ramgoolam (1900-1985)', '1.261.208 (2014)', 1.3, 2040, 'Inglés, Francés, Criollo', 'Rupia mauriciana (MUR)', 'Turismo, Servicios Financieros, Textil', 'N/A', 'N/A', 'mu', -20.348400, 57.552200, 'Mezcla india, africana, china y europea, dodo', 'Festival Cavadee, carnaval, Maha Shivaratri, Diwali', 'Turismo, servicios financieros, azúcar', 'PIB: $14B | PIB/cap: $10,800. Más diversificada.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Prithvirajsing_Roopun_in_2023.jpg/440px-Prithvirajsing_Roopun_in_2023.jpg', 'República Parlamentaria'),
(41, 'Mozambique', 'República de Mozambique', 'Maputo', (SELECT id FROM regions WHERE name='oriental'), 'Filipe Nyusi', 'Samora Moisés Machel (1933-1986)', '28.013.000 (2015)', 34.6, 801590, 'Portugués', 'Metical (MZN)', 'Gas Natural, Carbón, Agricultura, Aluminio', 'N/A', 'Maputo — Emb. Juan Carlos Fernández Juárez', 'mz', -18.665700, 35.529600, 'Herencia portuguesa, marimba, islas Quirimbas', 'Festival de Maputo, danza Makua, ceremonias', 'Gas natural (3er mayor reserva), carbón, tantalio', 'PIB: $19B | PIB/cap: $550. Potencial gasífero.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Filipe_Nyusi_in_2023.jpg/440px-Filipe_Nyusi_in_2023.jpg', 'República Presidencial'),
(42, 'Ruanda', 'República de Ruanda', 'Kigali', (SELECT id FROM regions WHERE name='oriental'), 'Paul Kagame', 'Grégoire Kayibanda (1924-1976)', '12.955.768 (2021)', 14.5, 26338, 'Kinyarwanda, Francés, Inglés', 'Franco ruandés (RWF)', 'Café, Té, Servicios, Turismo', 'N/A', 'N/A', 'rw', -1.940300, 29.873900, 'Gorilas de montaña, danza Intore, limpieza comunitaria', 'Kwita Izina (bautizo de gorilas), danza Intore', 'Café, té, coltan, estaño, turismo de gorilas', 'PIB: $12B | PIB/cap: $850. Transformación.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Paul_Kagame_in_2023.jpg/440px-Paul_Kagame_in_2023.jpg', 'República Presidencial'),
(43, 'Seychelles', 'República de Seychelles', 'Victoria', (SELECT id FROM regions WHERE name='oriental'), 'Wavel Ramkalawan', 'James Richard Marie Mancham (1939-2017)', '99.202 (2021)', 0.1, 455, 'Criollo, Francés, Inglés', 'Rupia seychelense (SCR)', 'Turismo, Pesca, Servicios Financieros', 'N/A', 'N/A', 'sc', -4.679600, 55.492000, 'Islas paradisíacas, tortugas gigantes, cultura criolla', 'Festival Kreol, carnaval, bodas criollas', 'Turismo de lujo, atún, coco, conservación marina', 'PIB: $2.0B | PIB/cap: $20,000. PIB/cap más alto.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Wavel_Ramkalawan_in_2023.jpg/440px-Wavel_Ramkalawan_in_2023.jpg', 'República Presidencial'),
(44, 'Somalia', 'República Federal de Somalia', 'Mogadiscio', (SELECT id FROM regions WHERE name='oriental'), 'Hassan Sheikh Mohamud', 'Adén Abdullah Osman Daar (1908-2007)', '15.893.222 (2019)', 18.7, 637657, 'Somalí, Árabe', 'Chelín somalí (SOS)', 'Ganadería, Remesas, Pesca, Telecomunicaciones', 'N/A', 'N/A', 'so', 5.152100, 46.199600, 'Poesía somalí, nómadas, litoral más largo de África', 'Poesía oral, boda somalí, mercado de Bakara', 'Ganadería, pesca, potencial petrolero, uranio', 'PIB: $8.0B | PIB/cap: $430. Post-conflicto.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Hassan_Sheikh_Mohamud_in_2023.jpg/440px-Hassan_Sheikh_Mohamud_in_2023.jpg', 'República Federal Parlamentaria'),
(45, 'Sudán del Sur', 'República de Sudán del Sur', 'Yuba', (SELECT id FROM regions WHERE name='oriental'), 'Salva Kiir Mayardit', 'N/A (Independencia 2011)', '13.249.924 (2021)', 11.6, 644329, 'Inglés, Árabe', 'Libra sursudanesa (SSP)', 'Petróleo, Agricultura, Ganadería', 'N/A', 'N/A', 'ss', 6.877000, 31.307000, 'Pueblos Dinka y Nuer, ganadería, tradiciones nilóticas', 'Ceremonias de ganado, rituales Dinka, boda nuer', 'Petróleo, tierras fértiles, agua, ganado', 'PIB: $3.2B | PIB/cap: $280. Nación más joven.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Salva_Kiir_Mayardit_in_2023.jpg/440px-Salva_Kiir_Mayardit_in_2023.jpg', 'República Presidencial'),
(46, 'Tanzania', 'República Unida de Tanzania', 'Dodoma', (SELECT id FROM regions WHERE name='oriental'), 'Samia Suluhu Hassan', 'Julius K. Nyerere (1922-1999)', '59.734.218 (2020)', 69.4, 947303, 'Suajili, Inglés', 'Chelín tanzano (TZS)', 'Turismo, Oro, Café, Gas Natural', 'N/A', 'N/A', 'tz', -6.369000, 34.888800, 'Serengeti, Kilimanjaro, cultura Maasai, Zanzíbar', 'Ceremonia Maasai, boda swahili, mercado de Dar', 'Oro, diamantes, turismo, gas, tanzanita (única)', 'PIB: $75B | PIB/cap: $1,100. Turismo y minería.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Samia_Suluhu_Hassan_in_2023.jpg/440px-Samia_Suluhu_Hassan_in_2023.jpg', 'República Semipresidencial'),
(47, 'Uganda', 'República de Uganda', 'Kampala', (SELECT id FROM regions WHERE name='oriental'), 'Yoweri Museveni', 'Milton Obote (1925-2005)', '45.741.007 (2020)', 49.9, 241038, 'Inglés, Suajili', 'Chelín ugandés (UGX)', 'Café, Té, Turismo, Servicios', 'N/A', 'Kampala — Emb. Fátima Fernández', 'ug', 1.373300, 32.290300, 'Gorilas de Bwindi, Reino de Buganda, grulla coronada', 'Ceremonia kiganda, boda buganda, mercado de Kampala', 'Café, oro, petróleo, cobalto, cobre', 'PIB: $48B | PIB/cap: $950. Crecimiento sostenido.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Yoweri_Museveni_in_2023.jpg/440px-Yoweri_Museveni_in_2023.jpg', 'República Presidencial'),
(48, 'Angola', 'República de Angola', 'Luanda', (SELECT id FROM regions WHERE name='austral'), 'João Lourenço', 'Agostinho Neto (1922-1979)', '32.097.651 (2021)', 37.8, 1246700, 'Portugués', 'Kwanza (AOA)', 'Petróleo, Diamantes, Agricultura, Gas', '1976', 'Luanda — Emb. Marlon José Peña Labrador', 'ao', -11.202700, 17.873900, 'Semba, kizomba, cultura banto-portuguesa', 'Festival de Luanda, danza semba, boda tradicional', '2do mayor productor de petróleo de África, diamantes', 'PIB: $97B | PIB/cap: $2,600. Diversificación.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Joao_Lourenco_in_2023.jpg/440px-Joao_Lourenco_in_2023.jpg', 'República Presidencial'),
(49, 'Botsuana', 'República de Botsuana', 'Gaborone', (SELECT id FROM regions WHERE name='austral'), 'Mokgweetsi Masisi', 'Seretse Khama (1921-1980)', '2.410.338 (2021)', 2.7, 581730, 'Inglés, Setswana', 'Pula (BWP)', 'Diamantes, Ganadería, Turismo', 'N/A', 'N/A', 'bw', -22.328500, 24.684900, 'San/Bosquimanos, delta del Okavango (UNESCO)', 'Ceremonia Domboshaba, boda tswana, danza', '2do mayor productor de diamantes del mundo', 'PIB: $20B | PIB/cap: $7,400. Más estable.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mokgweetsi_Masisi_in_2023.jpg/440px-Mokgweetsi_Masisi_in_2023.jpg', 'República Parlamentaria'),
(50, 'Esuatini', 'Reino de Esuatini', 'Mbabane', (SELECT id FROM regions WHERE name='austral'), 'Rey Mswati III', 'Rey Sobhuza II (1899-1982)', '1.119.375 (2015)', 1.2, 17364, 'Suazi, Inglés', 'Lilangeni (SZL)', 'Azúcar, Manufactura, Turismo, Textiles', 'N/A', 'N/A', 'sz', -26.522500, 31.465900, 'Reed Dance, última monarquía absoluta de África', 'Umhlanga (danza de las cañas), Incwala (rey)', 'Azúcar, madera, minería, carbón', 'PIB: $5.1B | PIB/cap: $4,300. Depende de Sudáfrica.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Mswati_III_in_2023.jpg/440px-Mswati_III_in_2023.jpg', 'Monarquía Absoluta'),
(51, 'Lesoto', 'Reino de Lesoto', 'Maseru', (SELECT id FROM regions WHERE name='austral'), 'Rey Letsie III', 'Moeketsi Majoro (1961-)', '2.007.200 (2016)', 2.3, 30355, 'Sesoto, Inglés', 'Loti (LSL)', 'Textil, Agua, Minería, Ganadería', 'N/A', 'N/A', 'ls', -29.610000, 28.233600, 'Enclave en Sudáfrica, pueblo Basotho, blankets', 'Festival de Morija, ceremonia Basotho, boda sotho', 'Agua (exportación a Sudáfrica), diamantes, lana', 'PIB: $2.6B | PIB/cap: $1,100. Depende de Sudáfrica.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Letsie_III_in_2023.jpg/440px-Letsie_III_in_2023.jpg', 'Monarquía Parlamentaria'),
(52, 'Namibia', 'República de Namibia', 'Windhoek', (SELECT id FROM regions WHERE name='austral'), 'Netumbo Nandi-Ndaitwah', 'Sam Nujoma (1929-)', '2.550.225 (2021)', 2.8, 825615, 'Inglés, Oshiwambo', 'Dólar namibio (NAD)', 'Diamantes, Uranio, Ganadería, Turismo', '1990', 'Windhoek — Emb. Omar Ernesto Berroteran Paredes', 'na', -22.957600, 18.490400, 'Himba, San, desierto del Namib (UNESCO), Sossusvlei', 'Ceremonia Himba, festival del desierto, boda', 'Diamantes, uranio, zinc, turismo, gas', 'PIB: $13B | PIB/cap: $4,700. Minera y turística.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Netumbo_Nandi-Ndaitwah_in_2025.jpg/440px-Netumbo_Nandi-Ndaitwah_in_2025.jpg', 'República Semipresidencial'),
(53, 'Sudáfrica', 'República de Sudáfrica', 'Pretoria', (SELECT id FROM regions WHERE name='austral'), 'Cyril Ramaphosa', 'Nelson Rolihlahla Mandela (1918-2013)', '60.142.978 (2021)', 61.9, 1221037, '11 idiomas oficiales', 'Rand (ZAR)', 'Oro, Platino, Manufactura, Finanzas, Turismo', '1994', 'Pretoria — Emb. Marín Josefina Moreno Mérida', 'za', -30.559500, 22.937500, 'Arcoíris, Nelson Mandela, safari, 11 idiomas', 'Heritage Day, Día de la Libertad, braai, boda zulú', 'Oro, platino, diamantes, carbón, cromo, titanio', 'PIB: $405B | PIB/cap: $6,500. Más industrializada.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Cyril_Ramaphosa_in_2023.jpg/440px-Cyril_Ramaphosa_in_2023.jpg', 'República Parlamentaria'),
(54, 'Zambia', 'República de Zambia', 'Lusaka', (SELECT id FROM regions WHERE name='austral'), 'Hakainde Hichilema', 'Kenneth Kaunda (1924-)', '15.473.905 (2015)', 21.6, 752612, 'Inglés, Bemba', 'Kwacha zambiano (ZMW)', 'Cobre, Agricultura, Turismo, Cobalto', 'N/A', 'N/A', 'zm', -13.133900, 27.849300, 'Cataratas Victoria (UNESCO), tribu Tonga, lago Kariba', 'Ceremonia Kuomboka, boda zambiana, mercado', 'Cobre (mayor exportación), cobalto, esmeraldas', 'PIB: $28B | PIB/cap: $1,300. Cuprífera.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Hakainde_Hichilema_in_2023.jpg/440px-Hakainde_Hichilema_in_2023.jpg', 'República Presidencial'),
(55, 'Zimbabue', 'República de Zimbabue', 'Harare', (SELECT id FROM regions WHERE name='austral'), 'Emmerson Mnangagwa', 'Robert Gabriel Mugabe (1924-2019)', '15.790.716 (2021)', 17.5, 390757, 'Inglés, Shona, Ndebele', 'RTGS', 'Oro, Platino, Tabaco, Agricultura, Turismo', 'N/A', 'N/A', 'zw', -19.015400, 29.154900, 'Gran Zimbabue (UNESCO), escultura Shona, cataratas Victoria', 'Ceremonia bira, festival de arte de Harare, boda shona', 'Oro, platino, diamantes, tabaco, litio, carbón', 'PIB: $30B | PIB/cap: $1,700. Recuperación.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Emmerson_Mnangagwa_in_2023.jpg/440px-Emmerson_Mnangagwa_in_2023.jpg', 'República Semipresidencial');

-- Ajustar auto_increment después de insertar IDs fijos
ALTER TABLE countries AUTO_INCREMENT = 56;

-- ==================================================================
-- DATOS BILATERALES (status, acuerdos, áreas)
-- ==================================================================

-- Insertar status bilateral para cada país (según bilateralData del JS y relaciones_venezuela)
INSERT INTO bilateral_status (country_id, status, has_embassy, strategic_level, relations_since_year)
SELECT c.id,
       CASE WHEN c.relations_venezuela IS NOT NULL AND c.relations_venezuela != 'N/A' THEN 'active' ELSE 'none' END,
       CASE WHEN c.embassy_info IS NOT NULL AND c.embassy_info NOT LIKE '%N/A%' AND c.embassy_info != '' THEN TRUE ELSE FALSE END,
       CASE WHEN c.embassy_info IS NOT NULL AND c.embassy_info NOT LIKE '%N/A%' THEN 'alta' ELSE 'media' END,
       c.relations_venezuela
FROM countries c;

-- Actualizar casos especiales desde bilateralData manual (ej. Ghana, Costa de Marfil, etc.)
UPDATE bilateral_status SET status='active', strategic_level='media' WHERE country_id IN (13,21,36,48,53,27,1,2,4,20,17,24,29);
UPDATE bilateral_status SET has_embassy=TRUE WHERE country_id IN (1,4,17,20,21,27,36,37,41,47,48,52,53);
UPDATE bilateral_status SET status='limited' WHERE country_id IN (5,25,28,30);  -- ejemplos
UPDATE bilateral_status SET status='none' WHERE country_id IN (7,12,14,15,16,18,19,22,23,31,32,33,34,35,38,39,40,42,43,44,45,46,49,50,51,54,55);

-- Insertar acuerdos bilaterales relevantes (tomados de bilateralData del JS)
INSERT INTO agreements (country_id, title, description, agreement_date, status, type) VALUES
(1, 'Acuerdo de Cooperación Energética', 'Intercambio de tecnología petrolera y gasífera. PDVSA y Sonatrach.', '2008', 'Vigente', 'Energético'),
(1, 'Memorando de Entendimiento Agrícola', 'Cooperación en riego y cultivos del desierto.', '2015', 'Vigente', 'Agrícola'),
(2, 'Acuerdo de Cooperación en Transporte Aéreo', 'Vuelos directos y facilidades aéreas entre El Cairo y Caracas.', '2011', 'Vigente', 'Transporte'),
(2, 'Convenio Cultural y Educativo', 'Intercambio de estudiantes y becas académicas.', '2017', 'Vigente', 'Educación'),
(4, 'Convenio de Cooperación Política', 'Encuentros bilaterales regulares y diálogo político.', '2013', 'Vigente', 'Político'),
(4, 'Acuerdo de Energía Renovable', 'Proyectos conjuntos en energía solar y eólica.', '2019', 'Vigente', 'Energético'),
(13, 'Memorando de Entendimiento', 'Cooperación en agricultura y comercio.', '2018', 'Vigente', 'Comercial'),
(21, 'Acuerdo de Cooperación Marítima', 'Facilitación de intercambios navales y comerciales.', '2015', 'Vigente', 'Marítimo'),
(27, 'Pacto de Cooperación Energética', 'Intercambio en hidrocarburos y formación técnica.', '2008', 'Vigente', 'Energético'),
(36, 'Acuerdo de Cooperación Tecnológica', 'Proyectos conjuntos de infraestructura y telecomunicaciones.', '2014', 'Vigente', 'Tecnológico'),
(36, 'Convenio Académico', 'Intercambio entre universidades y centros de investigación.', '2018', 'Vigente', 'Educación'),
(48, 'Acuerdo de Cooperación Energética', 'PDVSA y Sonangol. Exploración y refinación.', '2006', 'Vigente', 'Energético'),
(48, 'Acuerdo de Cooperación Minera', 'Intercambio en explotación de diamantes y oro.', '2010', 'Vigente', 'Minero'),
(53, 'Acuerdo de Cooperación Minera', 'Exploración de oro, platino y cromo.', '2006', 'Vigente', 'Minero'),
(53, 'Acuerdo de Cooperación en Defensa', 'Intercambio de conocimientos militares.', '2010', 'Vigente', 'Defensa');

-- Áreas estratégicas y cooperación (diccionarios)
INSERT INTO strategic_areas (name) VALUES ('OPEP'), ('Cooperación Sur-Sur'), ('Cultura'), ('Educación'), ('Diplomacia'), ('Energía'), ('G77'), ('BRICS'), ('Relaciones emergentes');
INSERT INTO cooperation_areas (name) VALUES ('Energía'), ('Agricultura'), ('Transporte'), ('Educación'), ('Política'), ('Comercio'), ('Cultura'), ('Marítimo'), ('Tecnología'), ('Minería'), ('Defensa');

-- Asignación de áreas (basado en bilateralData). Ejemplos:
-- Argelia (id 1)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (1, (SELECT id FROM strategic_areas WHERE name='OPEP')), (1, (SELECT id FROM strategic_areas WHERE name='Cooperación Sur-Sur'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (1, (SELECT id FROM cooperation_areas WHERE name='Energía')), (1, (SELECT id FROM cooperation_areas WHERE name='Agricultura'));
-- Egipto (2)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (2, (SELECT id FROM strategic_areas WHERE name='Cultura')), (2, (SELECT id FROM strategic_areas WHERE name='Educación'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (2, (SELECT id FROM cooperation_areas WHERE name='Transporte')), (2, (SELECT id FROM cooperation_areas WHERE name='Educación'));
-- Marruecos (4)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (4, (SELECT id FROM strategic_areas WHERE name='Diplomacia')), (4, (SELECT id FROM strategic_areas WHERE name='Energía'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (4, (SELECT id FROM cooperation_areas WHERE name='Política')), (4, (SELECT id FROM cooperation_areas WHERE name='Energía'));
-- Nigeria (20)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (20, (SELECT id FROM strategic_areas WHERE name='OPEP'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (20, (SELECT id FROM cooperation_areas WHERE name='Comercio')), (20, (SELECT id FROM cooperation_areas WHERE name='Cultura'));
-- Angola (48)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (48, (SELECT id FROM strategic_areas WHERE name='OPEP'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (48, (SELECT id FROM cooperation_areas WHERE name='Energía')), (48, (SELECT id FROM cooperation_areas WHERE name='Minería'));
-- Sudáfrica (53)
INSERT INTO country_strategic_areas (country_id, area_id) VALUES (53, (SELECT id FROM strategic_areas WHERE name='BRICS'));
INSERT INTO country_cooperation_areas (country_id, area_id) VALUES (53, (SELECT id FROM cooperation_areas WHERE name='Minería')), (53, (SELECT id FROM cooperation_areas WHERE name='Defensa'));

-- ==================================================================
-- ORGANIZACIONES MULTILATERALES Y MEMBRESÍAS
-- ==================================================================
INSERT INTO multilateral_orgs (name, icon, icon_class, description) VALUES
('Naciones Unidas (ONU)', '🇺🇳', 'un', 'Venezuela y 54 países africanos miembros.'),
('Unión Africana (UA)', '🌍', 'ua', 'Observador desde 2009.'),
('OPEP', '🛢️', 'opec', 'Miembro fundador. 7 africanos.'),
('G77 + China', '📊', 'g77', '134 países en desarrollo.'),
('MNOAL', '🤝', 'other', 'Coordinación histórica.');

-- Membresías (todos los países en ONU, todos en UA excepto Sahara Occidental? Se simplifica)
INSERT INTO multilateral_memberships (country_id, org_id, since_year)
SELECT c.id, (SELECT id FROM multilateral_orgs WHERE name='Naciones Unidas (ONU)'), '1945'
FROM countries c WHERE c.id != 7;  -- Sahara Occidental no es miembro pleno

INSERT INTO multilateral_memberships (country_id, org_id, since_year)
SELECT c.id, (SELECT id FROM multilateral_orgs WHERE name='Unión Africana (UA)'), '1963'
FROM countries c WHERE c.id != 7; -- UA admite a todos los estados africanos

-- Países OPEP africanos
INSERT INTO multilateral_memberships (country_id, org_id, since_year) VALUES
(1, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '1969'),
(3, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '1962'),
(20, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '1971'),
(26, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '1975'),
(27, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '2017'),
(30, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '2018'),
(48, (SELECT id FROM multilateral_orgs WHERE name='OPEP'), '2007');

-- G77: todos los países en desarrollo (todos)
INSERT INTO multilateral_memberships (country_id, org_id)
SELECT id, (SELECT id FROM multilateral_orgs WHERE name='G77 + China') FROM countries;

-- MNOAL: miembros históricos (selección)
INSERT INTO multilateral_memberships (country_id, org_id)
SELECT id, (SELECT id FROM multilateral_orgs WHERE name='MNOAL') FROM countries WHERE id IN (1,2,4,13,20,36,48,53,55);

-- ==================================================================
-- HITOS HISTÓRICOS (Venezuela-África)
-- ==================================================================
INSERT INTO milestones (fecha, title, description, category, icon) VALUES
('1948', 'Relaciones con Etiopía', 'Primer país africano con relaciones diplomáticas.', 'diplomatico', 'handshake'),
('1960', 'Nigeria y Marruecos', 'Relaciones durante año de independencia.', 'diplomatico', 'flag'),
('1961', 'Camerún', 'Reconocimiento de Camerún.', 'diplomatico', 'handshake'),
('1962', 'Embajada en Senegal', 'Apertura embajada residente en Dakar.', 'embajada', 'building'),
('1963', 'Argelia', 'Inicio de cooperación energética.', 'diplomatico', 'handshake'),
('1973', 'Libia', 'Lazos entre miembros OPEP.', 'diplomatico', 'oil-can'),
('1975', 'Angola y Cabo Verde', 'Reconocimiento independencias.', 'diplomatico', 'flag'),
('1976', 'Burkina Faso', 'Consolidación de lazos.', 'diplomatico', 'handshake'),
('1979', 'Guinea Ecuatorial', 'Único país hispanohablante de África.', 'diplomatico', 'language'),
('1990', 'Namibia', 'Apoyo independencia.', 'diplomatico', 'flag'),
('1994', 'Sudáfrica', 'Relaciones post-Apartheid.', 'diplomatico', 'dove'),
('2000', 'Visita de Hugo Chávez', 'Gira histórica por varios países de África.', 'visita', 'plane'),
('2004', 'Cumbre OPEP Argel', 'Cooperación con productores africanos.', 'cumbre', 'users'),
('2006', 'Acuerdos Nigeria y Angola', 'Cooperación energética PDVSA.', 'acuerdo', 'file-signature'),
('2009', 'Observador UA', 'Estatus de observador en la UA.', 'organismo', 'globe-africa'),
('2010', 'Cumbre ASA', 'Cumbre ASA en Tripoli.', 'cumbre', 'users'),
('2014', 'Foro Venezuela-África', 'Primer Foro Económico en Caracas.', 'foro', 'chart-line'),
('2016', 'Visita a Malí', 'Visita a Bamako.', 'visita', 'plane'),
('2018', 'Cooperación Sahel', 'Ayuda humanitaria.', 'cooperacion', 'heart'),
('2020', 'Cooperación COVID', 'Asistencia sanitaria.', 'cooperacion', 'medkit'),
('2022', 'UA Adís Abeba', 'Reuniones UA.', 'organismo', 'globe-africa'),
('2023', 'Sudáfrica', 'Visita oficial a Pretoria.', 'visita', 'plane'),
('2024', 'MNOAL Kampala', 'Cumbre MNOAL.', 'cumbre', 'users'),
('2025', 'Acuerdos Cooperación', 'Nuevos acuerdos con Ghana, Kenia y Tanzania.', 'acuerdo', 'file-signature');

-- Asignar países relacionados a hitos (tomando paisIds del JS)
INSERT INTO milestone_countries (milestone_id, country_id) VALUES
((SELECT id FROM milestones WHERE title='Relaciones con Etiopía'), 36),
((SELECT id FROM milestones WHERE title='Guinea Ecuatorial'), 27),
((SELECT id FROM milestones WHERE title='Namibia'), 52),
((SELECT id FROM milestones WHERE title='Sudáfrica'), 53),
((SELECT id FROM milestones WHERE title='Visita de Hugo Chávez'), 20),
((SELECT id FROM milestones WHERE title='Visita de Hugo Chávez'), 36),
((SELECT id FROM milestones WHERE title='Visita de Hugo Chávez'), 48),
((SELECT id FROM milestones WHERE title='Visita de Hugo Chávez'), 53),
((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 1), ((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 3),
((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 20), ((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 26),
((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 27), ((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 30),
((SELECT id FROM milestones WHERE title='Cumbre OPEP Argel'), 48),
((SELECT id FROM milestones WHERE title='Acuerdos Nigeria y Angola'), 20), ((SELECT id FROM milestones WHERE title='Acuerdos Nigeria y Angola'), 48),
((SELECT id FROM milestones WHERE title='Observador UA'), 36),
((SELECT id FROM milestones WHERE title='Cumbre ASA'), 3),
((SELECT id FROM milestones WHERE title='Foro Venezuela-África'), 55),
((SELECT id FROM milestones WHERE title='Visita a Malí'), 17),
((SELECT id FROM milestones WHERE title='Cooperación Sahel'), 9), ((SELECT id FROM milestones WHERE title='Cooperación Sahel'), 17),
((SELECT id FROM milestones WHERE title='Cooperación Sahel'), 18), ((SELECT id FROM milestones WHERE title='Cooperación Sahel'), 19),
((SELECT id FROM milestones WHERE title='Cooperación COVID'), 1), ((SELECT id FROM milestones WHERE title='Cooperación COVID'), 2),
((SELECT id FROM milestones WHERE title='Cooperación COVID'), 20), ((SELECT id FROM milestones WHERE title='Cooperación COVID'), 36),
((SELECT id FROM milestones WHERE title='Cooperación COVID'), 48), ((SELECT id FROM milestones WHERE title='Cooperación COVID'), 53),
((SELECT id FROM milestones WHERE title='UA Adís Abeba'), 36),
((SELECT id FROM milestones WHERE title='Sudáfrica'), 53),
((SELECT id FROM milestones WHERE title='MNOAL Kampala'), 20), ((SELECT id FROM milestones WHERE title='MNOAL Kampala'), 36),
((SELECT id FROM milestones WHERE title='Acuerdos Cooperación'), 13), ((SELECT id FROM milestones WHERE title='Acuerdos Cooperación'), 37),
((SELECT id FROM milestones WHERE title='Acuerdos Cooperación'), 46);

-- ==================================================================
-- EMBAJADAS
-- ==================================================================
INSERT INTO embassies_venezuela (country_id, city, ambassador, concurrencies) VALUES
(1, 'Argel', 'José D. Sojo Reyes', 'N/A'),
(2, 'El Cairo', 'Wilmer Barrientos', 'N/A'),
(4, 'Rabat', 'Dana Casanova', 'N/A'),
(6, 'Túnez', 'Carlos Feo', 'N/A'),
(21, 'Dakar', 'Alejandro Correa', 'Benín, Gambia'),
(17, 'Bamako', 'Oscar Romero', 'Burkina Faso, Níger'),
(20, 'Abuya', 'David Nieves', 'Liberia, S. Leona'),
(27, 'Malabo', 'Nelson Ortega', 'N/A'),
(36, 'Adís Abeba', 'Modesto Ruiz', 'N/A'),
(37, 'Nairobi', 'José Ávila', 'Ruanda, Uganda'),
(41, 'Maputo', 'Juan C. Fernández', 'Malaui'),
(48, 'Luanda', 'Marlon Peña', 'S. Tomé, Zambia'),
(52, 'Windhoek', 'Omar Berroteran', 'Botsuana'),
(53, 'Pretoria', 'Marín Moreno', 'Comoras, Lesoto, Mauricio'),
(47, 'Kampala', 'Fátima Fernández', 'Burundi'),
(46, 'Dar es-Salam', 'Por confirmar', 'N/A'),
(29, 'Kinsasa', 'Por confirmar', 'R. Centroafricana'),
(13, 'Accra', 'Por confirmar', 'N/A');

-- Embajadas africanas en Venezuela
INSERT INTO embassies_africa_in_ve (country_id, city_ve, ambassador) VALUES
(1, 'Caracas', 'Emb. Abdelkader Bensmail'),
(2, 'Caracas', 'Emb. Mahmoud Talaat'),
(4, 'Caracas', 'Emb. Bouchra Boudchiche'),
(20, 'Caracas', 'Emb. Akinremi Bolade'),
(53, 'Caracas', 'Emb. Mnguni'),
(27, 'Caracas', 'Emb. Miguel Ntutumu'),
(48, 'Caracas', 'Emb. Maria Augusta'),
(13, 'Caracas', 'Emb. Martha Pobee');

-- ==================================================================
-- EFEMÉRIDES (pocos ejemplos)
-- ==================================================================
INSERT INTO efemerides (country_id, fecha, titulo, description) VALUES
(1, '1 de noviembre', 'Día de la Revolución', 'Inicio de la guerra de independencia (1954).'),
(2, '23 de julio', 'Día de la Revolución', 'Conmemoración de la revolución de 1952.'),
(20, '1 de octubre', 'Día de la Independencia', 'Independencia de Nigeria (1960).'),
(53, '27 de abril', 'Día de la Libertad', 'Primeras elecciones democráticas (1994).'),
(36, '28 de mayo', 'Día de la Caída del Derg', 'Fin del régimen comunista (1991).');

-- ==================================================================
-- VISTA DE REPORTE EJECUTIVO
-- ==================================================================
CREATE OR REPLACE VIEW vw_reporte_regiones AS
SELECT r.display_name AS region,
       COUNT(c.id) AS paises,
       SUM(CASE WHEN bs.status IN ('active','limited') THEN 1 ELSE 0 END) AS relaciones_diplomaticas,
       SUM(CASE WHEN bs.has_embassy = TRUE THEN 1 ELSE 0 END) AS embajadas_residentes,
       (SELECT COUNT(*) FROM agreements a WHERE a.country_id = c.id) AS total_acuerdos
FROM countries c
JOIN regions r ON c.region_id = r.id
LEFT JOIN bilateral_status bs ON c.id = bs.country_id
GROUP BY r.id, r.display_name;

-- ==================================================================
-- FIN DEL SCRIPT
-- ==================================================================