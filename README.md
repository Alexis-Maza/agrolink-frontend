# AgroLink 🌾🚜 - Sistema de Gestión de Producción y Comercialización Agrícola

### 🚀 Despliegue en Vivo: [Visitar AgroLink en internet](https://agrolink-frontend.onrender.com)

---

## 📖 Descripción del Proyecto
**AgroLink** es una plataforma web innovadora enmarcada en el rubro de la **Tecnología Agrícola (AgriTech)** y el **Comercio Electrónico (E-commerce B2B/B2C)**. El sistema mitiga el impacto de la excesiva intermediación comercial y la falta de digitalización operativa en el sector agrícola nacional. 

A través de una arquitectura moderna, AgroLink centraliza el control de los cultivos y establece un canal de comercialización directa y transparente, empoderando al productor y garantizando trazabilidad e información confiable para los compradores.

---

## 👥 Roles de Usuario del Sistema
El ecosistema de AgroLink está diseñado bajo un control estricto de accesos y vistas basadas en los siguientes perfiles:

* **👨‍🌾 Agricultor:** Gestiona su perfil productivo (certificaciones, experiencia y hectáreas), registra lotes de siembra, documenta cronológicamente las etapas del ciclo productivo y reporta mermas o pérdidas que actualizan automáticamente el inventario disponible.
* **🛒 Comprador:** Explora un catálogo interactivo con filtros avanzados (por categoría, precios, disponibilidad y certificaciones), gestiona un carrito de compras y consolida múltiples cultivos dentro de una misma transacción comercial.
* **⚙️ Administrador (Nuevo Módulo):** Encargado de la supervisión global de las cuentas del sistema, consolidación del historial de transacciones para la toma de decisiones y la ejecución de tareas de mantenimiento técnico del negocio, tales como el recalculo masivo de los estados de maduración y logística de los cultivos en la base de datos.

---

## 🛠️ Stack Tecnológico Utilizado
La plataforma implementa una separación limpia de responsabilidades mediante una arquitectura desacoplada:

* **Frontend:** React (SPA), JavaScript, Axios para el consumo de API, CSS3 con diseño *Responsive* optimizado para dispositivos móviles en el campo.
* **Backend:** Java, Spring Boot, Spring Security, JWT (JSON Web Tokens) para la protección de rutas sensibles y Spring Data JPA para la abstracción de datos.
* **Base de Datos:** PostgreSQL (Sistema Relacional robusto que mapea entidades complejas como cultivos, parcelas, pedidos e historiales).

---

## 📦 Instrucciones para el Desarrollo Local

> [!IMPORTANT]
> Este proyecto utiliza **pnpm** como gestor de paquetes principal debido a su alto rendimiento y eficiencia en el manejo del almacenamiento.

Para garantizar la estabilidad de las dependencias y resolver problemas comunes de anidamiento de rutas en el entorno de desarrollo, el repositorio incluye un archivo de configuración `.npmrc` con la regla técnica `node-linker=hoisted`.

### Guía de Instalación para Colaboradores (Tus Compañeros)

Si vas a clonar el proyecto por primera vez para trabajar de forma local, colócate dentro del directorio del frontend (`agrolink-frontend`) y sigue los comandos correspondientes a tu gestor:

#### Opción A: Utilizando `pnpm` (Recomendado)
El archivo `.npmrc` obligará automáticamente a pnpm a estructurar las dependencias de forma plana:
```bash
# 1. Limpiar rastro viejo (si existiera) e instalar dependencias limpias
Remove-Item -Recurse -Force node_modules  # (En PowerShell)
pnpm install

# 2. Iniciar el servidor de desarrollo local
pnpm start

#### Opción B: Utilizando `npm` Tradicional
Si prefieres utilizar el npm clásico, el archivo `.npmrc` será ignorado sin generar ningún conflicto operativo:

```bash
# 1. Instalar dependencias generando un árbol tradicional local
npm install

# 2. Iniciar el servidor de desarrollo local
npm start

## 🎓 Información Académica (Universidad Tecnológica del Perú)
* **Curso:** Desarrollo Web Integrado - 24829
* **Docente:** Huamani Uriarte, Enrique Lee
* **Integrantes del Equipo de Desarrollo:**
  * Caro Rojas, Dayanara Marlene
  * Ferrel Julca, Rufo Piero
  * Maza Lozado, Alexis Jair
  * Guillen Canales, Eloy
  * Coronado Melgarejo, Jair
