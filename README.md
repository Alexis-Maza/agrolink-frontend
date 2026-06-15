# AgroLink 🌾🚜 — Sistema de Gestión y Comercialización Agrícola Directa

<p align="center">
  <img src="agrolink-frontend/public/logo.png" alt="AgroLink Logo" width="120" />
</p>

<p align="center">
  <strong>Conectando la cosecha del futuro de forma directa, justa y trazable.</strong>
</p>

<p align="center">
  <a href="https://agrolink-frontend.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/Despliegue%20en%20Vivo-Visitar%20AgroLink-2E7D32?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/pnpm-%234a4a4a?style=flat-square&logo=pnpm&logoColor=f69220" alt="pnpm" />
</p>

---

## 📖 Descripción del Proyecto

**AgroLink** es una plataforma web innovadora enmarcada en el ámbito de la **Tecnología Agrícola (AgriTech)** y el **Comercio Electrónico B2B/B2C**. El sistema surge para mitigar el impacto de la excesiva intermediación comercial y la falta de digitalización en el sector agrícola nacional.

A través de una arquitectura moderna, AgroLink descentraliza el comercio agrario al centralizar el control de los cultivos y establecer un canal de venta directa y transparente, empoderando al productor tradicional y garantizando trazabilidad e información confiable para los compradores mayoristas y minoristas.

---

## 👥 Roles y Flujos de Usuario

El ecosistema de AgroLink implementa un control de accesos estricto y vistas personalizadas según el perfil de usuario:

| Perfil | Icono | Descripción del Flujo Operativo |
| :--- | :---: | :--- |
| **Agricultor** | 👨‍🌾 | Gestiona su perfil productivo (certificaciones, hectáreas y experiencia). Registra lotes de siembra, documenta cronológicamente las etapas del cultivo (siembra, riego, crecimiento) y reporta mermas que actualizan el stock disponible. |
| **Comprador** | 🛒 | Explora el catálogo interactivo de preventas de cosechas. Utiliza filtros avanzados (por categoría, precios, disponibilidad y certificaciones), añade productos al carrito y asegura su compra mediante un sistema de preventa garantizada. |
| **Administrador** | ⚙️ | Supervisa de manera global las cuentas de usuario y consolida el historial de transacciones. Realiza tareas de mantenimiento técnico como el recálculo masivo de los estados de maduración y logística de los cultivos en la base de datos. |

---

## 🛠️ Stack Tecnológico

La plataforma implementa una separación limpia de responsabilidades mediante una arquitectura desacoplada:

* **Frontend:** React (SPA) con JavaScript, gestión de rutas con React Router DOM v7 y Axios para consumo de APIs REST. Estilizado con CSS3 nativo aplicando diseño adaptativo (*Responsive Design*) optimizado para dispositivos móviles en el campo de cultivo.
* **Backend:** Java, Spring Boot, Spring Security con tokens JWT para la protección de rutas sensibles y Spring Data JPA para la abstracción de base de datos.
* **Base de Datos:** PostgreSQL para el almacenamiento relacional robusto que soporta entidades complejas (lotes, cultivos, parcelas y pedidos).
* **Gestor de Paquetes:** `pnpm` debido a su alto rendimiento, velocidad y eficiencia en el almacenamiento en disco.

---

## 📂 Estructura del Proyecto (Frontend)

El directorio `agrolink-frontend` está organizado de la siguiente manera:

```text
agrolink-frontend/
├── public/                # Plantillas HTML base y recursos estáticos locales
└── src/
    ├── api/               # Configuraciones de Axios e integración con endpoints API
    ├── components/        # Componentes UI reutilizables de uso global (e.g. Navbar)
    ├── context/           # Contextos de React para estado global de autenticación
    ├── data/              # Conjuntos de datos mock para pruebas locales
    ├── styles/            # Hojas de estilo estructuradas por módulos y temas
    ├── views/             # Páginas y vistas agrupadas por roles del sistema
    │   ├── Admin/         # Módulo y panel de Administración
    │   ├── Auth/          # Vistas de autenticación (Login, Registro, Password)
    │   ├── Buyer/         # Panel e historial de compras del Comprador
    │   ├── Farmer/        # Panel de lotes, siembras y cosechas del Agricultor
    │   └── Public/        # Landing page y catálogo de preventas libre
    ├── App.js             # Enrutamiento principal de la aplicación
    └── index.js           # Punto de entrada de la aplicación React
```

---

## 📦 Instrucciones para el Desarrollo Local

> [!IMPORTANT]
> Para garantizar la estabilidad de las dependencias y resolver problemas de resolución de rutas en Windows con pnpm, el repositorio incluye un archivo de configuración `.npmrc` con la regla técnica `node-linker=hoisted`.

### Guía de Instalación para Colaboradores

Si vas a clonar el proyecto por primera vez para trabajar de forma local, dirígete al directorio del frontend (`agrolink-frontend`) desde tu terminal y sigue las instrucciones de la opción de tu preferencia:

#### Opción A: Utilizando `pnpm` (Recomendado)
El archivo `.npmrc` configurará automáticamente a `pnpm` para estructurar la carpeta `node_modules` de forma plana y evitar problemas de dependencias:
```bash
# 1. Limpiar rastro viejo (si existiera) e instalar dependencias limpias
# En PowerShell:
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
pnpm install

# 2. Iniciar el servidor de desarrollo local
pnpm start
```

#### Opción B: Utilizando `npm` Tradicional
Si prefieres utilizar el npm clásico, el instalador ignorará el `.npmrc` y estructurará el árbol de dependencias de forma tradicional:
```bash
# 1. Instalar dependencias generando el árbol tradicional local
npm install

# 2. Iniciar el servidor de desarrollo local
npm start
```

El servidor local se abrirá en [http://localhost:3000](http://localhost:3000).

---

## 🎓 Información Académica
* **Institución:** Universidad Tecnológica del Perú (UTP)
* **Curso:** Desarrollo Web Integrado — Sección 24829
* **Docente:** Huamani Uriarte, Enrique Lee
* **Equipo de Desarrollo:**
  * 👤 Caro Rojas, Dayanara Marlene
  * 👤 Ferrel Julca, Rufo Piero
  * 👤 Maza Lozado, Alexis Jair
  * 👤 Guillen Canales, Eloy
  * 👤 Coronado Melgarejo, Jair

