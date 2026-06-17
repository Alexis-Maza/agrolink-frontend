// Servicio simulado para la gestión de productos y variantes usando localStorage
// Esto permite un desarrollo ágil y autónomo en el frontend.

const LOCAL_STORAGE_KEY = 'agrolink_admin_productos';

const datosIniciales = [
    {
        id: 1,
        nombre: 'Papa Única',
        descripcion: 'Papa de variedad única, ideal para frituras y consumo masivo.',
        activo: true,
        variedades: [
            { id: 101, nombre: 'Papa Única Lavada' },
            { id: 102, nombre: 'Papa Única Premium (Calibre A)' }
        ]
    },
    {
        id: 2,
        nombre: 'Tomate Katya',
        descripcion: 'Tomate de mesa de alta durabilidad y excelente coloración roja.',
        activo: true,
        variedades: [
            { id: 201, nombre: 'Tomate Katya Grande' },
            { id: 202, nombre: 'Tomate Katya Mediano' }
        ]
    },
    {
        id: 3,
        nombre: 'Cebolla Roja',
        descripcion: 'Cebolla roja de exportación, cosechada en la región Arequipa.',
        activo: false,
        variedades: [
            { id: 301, nombre: 'Cebolla Roja Mediana' }
        ]
    }
];

// Inicializar datos por defecto si localStorage está vacío
const inicializarDatos = () => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosIniciales));
    }
};

inicializarDatos();

const obtenerProductosLocal = () => {
    inicializarDatos();
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
};

const guardarProductosLocal = (productos) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productos));
};

// --- API MOCK (Simula llamadas con promesas asíncronas) ---

export const listarProductosAdmin = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(obtenerProductosLocal());
        }, 300); // Simulamos retraso de red
    });
};

export const crearProducto = async (datos) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const productos = obtenerProductosLocal();
            const nuevoProducto = {
                id: Date.now(), // ID único temporal
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                activo: true,
                variedades: []
            };
            productos.push(nuevoProducto);
            guardarProductosLocal(productos);
            resolve(nuevoProducto);
        }, 300);
    });
};

export const actualizarProducto = async (id, datos) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const productos = obtenerProductosLocal();
            const index = productos.findIndex(p => p.id === Number(id));
            if (index !== -1) {
                productos[index] = {
                    ...productos[index],
                    nombre: datos.nombre !== undefined ? datos.nombre : productos[index].nombre,
                    descripcion: datos.descripcion !== undefined ? datos.descripcion : productos[index].descripcion,
                    activo: datos.activo !== undefined ? datos.activo : productos[index].activo
                };
                guardarProductosLocal(productos);
                resolve(productos[index]);
            } else {
                reject(new Error('Producto no encontrado'));
            }
        }, 300);
    });
};

export const crearVariedad = async (productoId, datos) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const productos = obtenerProductosLocal();
            const index = productos.findIndex(p => p.id === Number(productoId));
            if (index !== -1) {
                const nuevaVariedad = {
                    id: Date.now(), // ID único temporal
                    nombre: datos.nombre
                };
                productos[index].variedades.push(nuevaVariedad);
                guardarProductosLocal(productos);
                resolve(nuevaVariedad);
            } else {
                reject(new Error('Producto no encontrado para asociar variedad'));
            }
        }, 300);
    });
};

export const actualizarVariedad = async (productoId, variedadId, nuevoNombre) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const productos = obtenerProductosLocal();
            const prodIndex = productos.findIndex(p => p.id === Number(productoId));
            if (prodIndex !== -1) {
                const varIndex = productos[prodIndex].variedades.findIndex(v => v.id === Number(variedadId));
                if (varIndex !== -1) {
                    productos[prodIndex].variedades[varIndex].nombre = nuevoNombre;
                    guardarProductosLocal(productos);
                    resolve(productos[prodIndex].variedades[varIndex]);
                } else {
                    reject(new Error('Variedad no encontrada'));
                }
            } else {
                reject(new Error('Producto no encontrado'));
            }
        }, 300);
    });
};
