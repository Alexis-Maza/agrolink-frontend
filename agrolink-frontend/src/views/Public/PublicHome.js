import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { initialCatalog } from '../../data/mockBuyerData';

const AVAILABLE_CERTIFICATIONS = [
    'Certificación de Buenas Prácticas Agrícolas',
    'Certificación Orgánica Nacional',
    'Certificación de Comercio Justo',
    'Certificación de Agricultura Familiar',
    'Certificación GlobalG.A.P'
];

function PublicHome() {
    const navigate = useNavigate();

    // 1. Estados de Datos, Filtros y Paginación
    const [catalog] = useState(initialCatalog);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCertifications, setSelectedCertifications] = useState([]);
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 2. Estados de Carrito y Modales
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('agrolink_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error loading cart", e);
            }
        }
        return [];
    });
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [purchaseData, setPurchaseData] = useState({ cantidad: '', loteParcial: '', metodoPago: 'Transferencia Bancaria', porcentajeAdelanto: 30 });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [companyModal, setCompanyModal] = useState(null); // 'about' | 'mission' | 'vision' | null

    // Sincronizar carrito con localStorage
    useEffect(() => {
        localStorage.setItem('agrolink_cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    }, [cartItems]);

    // Resetear paginación a la página 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCertifications]);

    // 3. Lógica de Filtrado
    const filteredCrops = catalog.filter(crop => {
        const matchesSearch = 
            crop.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.agricultor.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCertifications = selectedCertifications.length === 0 ||
            selectedCertifications.every(cert => crop.certificaciones && crop.certificaciones.includes(cert));

        return matchesSearch && matchesCertifications;
    });

    // Paginación Math
    const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

    // 4. Manejo del Carrito
    const handleAddToCart = () => {
        if (!purchaseData.cantidad || parseFloat(purchaseData.cantidad) <= 0) {
            alert('Por favor ingresa una cantidad válida.');
            return;
        }

        const priceNum = parseFloat(selectedCrop.precio);
        const qtyNum = parseFloat(purchaseData.cantidad);
        const total = priceNum * qtyNum;

        const newItem = {
            id: `CART-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            cultivoId: selectedCrop.id,
            nombre: selectedCrop.nombre,
            lote: selectedCrop.lote,
            cantidad: purchaseData.cantidad,
            precio: priceNum,
            loteParcial: purchaseData.loteParcial || `LP-${Math.floor(Math.random() * 100)}`,
            metodoPago: purchaseData.metodoPago,
            porcentajeAdelanto: purchaseData.porcentajeAdelanto,
            montoTotal: total,
            seleccionado: true,
            imagen: selectedCrop.imagen,
            agricultor: selectedCrop.agricultor
        };

        setCartItems([...cartItems, newItem]);
        alert(`¡${selectedCrop.nombre} añadido al carrito con éxito!`);
        setSelectedCrop(null);
        setPurchaseData({ cantidad: '', loteParcial: '', metodoPago: 'Transferencia Bancaria', porcentajeAdelanto: 30 });
    };

    const handleRemoveFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calcular montos de adelanto acumulados en el carrito
    const cartTotal = cartItems.reduce((acc, curr) => acc + curr.montoTotal, 0);
    const cartAdelanto = cartItems.reduce((acc, curr) => acc + (curr.montoTotal * (curr.porcentajeAdelanto / 100)), 0);

    // Checkout y control de sesión
    const handleCheckout = () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userRole = localStorage.getItem('userRole');

        if (!isAuthenticated) {
            alert("Para proceder al pago de tu preventa asegurada, necesitas iniciar sesión o registrarte.");
            setIsCartOpen(false);
            navigate('/login');
        } else if (userRole === 'BUYER') {
            setIsCartOpen(false);
            navigate('/buyer/cart');
        } else {
            alert("Has iniciado sesión como Agricultor. Para comprar, necesitas una cuenta de perfil Comprador.");
            setIsCartOpen(false);
        }
    };

    // Alternar selección de certificaciones en los filtros
    const handleCertToggle = (cert) => {
        if (selectedCertifications.includes(cert)) {
            setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
        } else {
            setSelectedCertifications([...selectedCertifications, cert]);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            
            {/* Inyección de estilos CSS responsivos */}
            <style>{`
                @media (max-width: 992px) {
                    .page-container {
                        flex-direction: column !important;
                    }
                    .sidebar-panel {
                        width: 100% !important;
                        height: auto !important;
                        position: relative !important;
                        top: 0 !important;
                        border-right: none !important;
                        border-bottom: 1px solid #e2e8f0 !important;
                        padding: 25px !important;
                    }
                    .main-content {
                        padding: 25px !important;
                    }
                }
            `}</style>

            {/* NAVBAR */}
            <Navbar onCartClick={() => setIsCartOpen(true)} />

            {/* 1. HERO SECTION */}
            <header style={{
                color: 'white',
                padding: '50px 20px',
                textAlign: 'center',
                background: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(27, 94, 32, 0.95)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) no-repeat center/cover',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-titles)', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>
                    Asegura la cosecha del futuro hoy
                </h1>
            </header>

            {/* 2. DISEÑO EN DOS COLUMNAS ESTRUCTURAL (SIDEBAR SÓLIDO + CONTENIDO) */}
            <div className="page-container" style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg)'
            }}>
                
                {/* COLUMNA IZQUIERDA: SIDEBAR SÓLIDO */}
                <aside className="sidebar-panel" style={{
                    width: '320px',
                    backgroundColor: 'white',
                    borderRight: '1px solid #e2e8f0',
                    padding: '35px 25px',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    position: 'sticky',
                    top: '76px', // Altura aproximada de la Navbar
                    height: 'calc(100vh - 76px)',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ 
                        margin: '0 0 25px 0', 
                        fontSize: '1.3rem', 
                        color: 'var(--color-text)', 
                        borderBottom: '2px solid #F4F7F5', 
                        paddingBottom: '12px',
                        fontFamily: 'var(--font-titles)',
                        fontWeight: 'bold'
                    }}>
                        Filtros de Búsqueda
                    </h3>

                    {/* Barra de búsqueda */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>🔍 Buscar Cultivo</label>
                        <input 
                            type="text" 
                            placeholder="Cultivo o Agricultor..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid #ddd', 
                                fontSize: '0.95rem', 
                                outline: 'none', 
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>

                    {/* Checkboxes de Certificaciones */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>🛡️ Certificaciones</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {AVAILABLE_CERTIFICATIONS.map((cert, idx) => {
                                const isChecked = selectedCertifications.includes(cert);
                                return (
                                    <label key={idx} style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        gap: '10px', 
                                        fontSize: '0.9rem', 
                                        color: '#444', 
                                        cursor: 'pointer',
                                        lineHeight: '1.3',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#444'}>
                                        <input 
                                            type="checkbox" 
                                            checked={isChecked}
                                            onChange={() => handleCertToggle(cert)}
                                            style={{ marginTop: '2px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                        />
                                        <span>{cert}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* COLUMNA DERECHA: CONTENIDO PRINCIPAL */}
                <main className="main-content" style={{ 
                    flex: 1, 
                    padding: '40px', 
                    boxSizing: 'border-box' 
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                            {visibleCrops.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #eee' }}>
                                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🍃</span>
                                    <p style={{ color: '#888', fontSize: '1.1rem', margin: 0 }}>No se encontraron cultivos con los filtros seleccionados.</p>
                                </div>
                            ) : (
                                visibleCrops.map(crop => (
                                    <div 
                                        key={crop.id} 
                                        style={{ 
                                            backgroundColor: 'white', 
                                            borderRadius: 'var(--radius-lg)', 
                                            overflow: 'hidden', 
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                                            border: crop.incidencia ? '1px solid #ffcdd2' : '1px solid #eee',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                        }}
                                    >
                                        <div style={{ height: '180px', backgroundImage: `url(${crop.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                            {crop.incidencia && (
                                                <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#d32f2f', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    ⚠️ Incidencia
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>LOTE: {crop.lote}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Var: <strong>{crop.variedad}</strong></span>
                                                </div>
                                                <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1.25rem', fontFamily: 'var(--font-titles)', fontWeight: 'bold' }}>{crop.nombre}</h3>
                                                
                                                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555' }}>
                                                    👤 Agricultor: <strong style={{ color: 'var(--color-text)' }}>{crop.agricultor}</strong>
                                                </p>

                                                {/* Certificaciones Badges */}
                                                {crop.certificaciones && crop.certificaciones.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                                        {crop.certificaciones.map((cert, i) => (
                                                            <span key={i} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '15px' }} title={cert}>
                                                                🛡️ {cert.length > 20 ? cert.substring(0, 18) + '...' : cert}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                                    <span style={{ color: '#666' }}>Disponible:</span>
                                                    <strong style={{ color: 'var(--color-primary)' }}>{crop.cantidadDisponible}</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Precio:</span>
                                                    <strong style={{ color: 'var(--color-secondary)', fontSize: '1.15rem' }}>S/ {crop.precio.toFixed(2)} / Kg</strong>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => setSelectedCrop(crop)} 
                                                    style={{ 
                                                        width: '100%', 
                                                        backgroundColor: 'var(--color-primary)', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        padding: '10px', 
                                                        borderRadius: 'var(--radius-md)', 
                                                        fontWeight: 'bold', 
                                                        cursor: 'pointer',
                                                        fontSize: '0.95rem',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                                                >
                                                    Asegurar Preventa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* PAGINACIÓN ELEGANTE */}
                        {totalPages > 1 && (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '10px', 
                                marginTop: '45px',
                                flexWrap: 'wrap'
                            }}>
                                {/* Botón Anterior */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #ddd',
                                        backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                                        color: currentPage === 1 ? '#aaa' : 'var(--color-text)',
                                        fontWeight: 'bold',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== 1) e.target.style.backgroundColor = '#f0f0f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== 1) e.target.style.backgroundColor = 'white';
                                    }}
                                >
                                    &laquo; Anterior
                                </button>

                                {/* Números de Página */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                    const isActive = page === currentPage;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: 'var(--radius-md)',
                                                border: isActive ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                                backgroundColor: isActive ? 'var(--color-primary)' : 'white',
                                                color: isActive ? 'white' : 'var(--color-text)',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) e.target.style.backgroundColor = '#E8F5E9';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) e.target.style.backgroundColor = 'white';
                                            }}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #ddd',
                                        backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                                        color: currentPage === totalPages ? '#aaa' : 'var(--color-text)',
                                        fontWeight: 'bold',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== totalPages) e.target.style.backgroundColor = '#f0f0f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== totalPages) e.target.style.backgroundColor = 'white';
                                    }}
                                >
                                    Siguiente &raquo;
                                </button>
                            </div>
                        )}
                    </div>
                </main>

            </div>

            {/* 3. MODAL DETALLE Y ADICIÓN AL CARRITO */}
            {selectedCrop && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setSelectedCrop(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>&times;</button>
                        
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                            <img src={selectedCrop.imagen} alt={selectedCrop.nombre} style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                            <div>
                                <h3 style={{ color: 'var(--color-primary)', margin: '0 0 10px 0', fontSize: '1.6rem', fontFamily: 'var(--font-titles)' }}>{selectedCrop.nombre} - {selectedCrop.variedad}</h3>
                                <p style={{ margin: '0 0 5px 0', color: '#555' }}>Agricultor: <strong>{selectedCrop.agricultor}</strong></p>
                                <span style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {selectedCrop.certificaciones && selectedCrop.certificaciones.map((cert, idx) => (
                                        <span key={idx} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px' }}>
                                            🛡️ {cert}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        </div>

                        {selectedCrop.incidencia && (
                            <div style={{ padding: '15px', backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', color: '#d32f2f', fontWeight: 'bold', marginBottom: '20px' }}>
                                ⚠️ Alerta de Incidencia: {selectedCrop.incidencia}
                            </div>
                        )}

                        {/* Ficha técnica comercial del Lote */}
                        <div style={{ 
                            backgroundColor: '#F1F8F5', 
                            border: '1px solid #C8E6C9', 
                            borderRadius: 'var(--radius-md)', 
                            padding: '18px', 
                            marginBottom: '25px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: '15px'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Precio x Kg</span>
                                <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>S/ {parseFloat(selectedCrop.precio).toFixed(2)}</strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Valor Total Lote</span>
                                <strong style={{ fontSize: '1.15rem', color: '#2E7D32' }}>
                                    S/ {((parseFloat(selectedCrop.precio) || 0) * (selectedCrop.cantidadTotal.toLowerCase().includes('ton') ? (parseFloat(selectedCrop.cantidadTotal) * 1000) : (parseFloat(selectedCrop.cantidadTotal) || 0))).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Total Lote Declarado</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{selectedCrop.cantidadTotal}</strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Compra Mínima</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--color-secondary)' }}>{selectedCrop.minimoVenta}</strong>
                            </div>
                        </div>

                        <h4 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.1rem' }}>Configurar Compra de la Preventa</h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cantidad a Comprar (Kg)</label>
                                <input 
                                    type="number" 
                                    name="cantidad" 
                                    placeholder={`Mínimo: ${selectedCrop.minimoVenta}`}
                                    value={purchaseData.cantidad} 
                                    onChange={(e) => setPurchaseData({...purchaseData, cantidad: e.target.value})} 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lote Parcial (Opcional)</label>
                                <input 
                                    type="text" 
                                    name="loteParcial" 
                                    placeholder="Ej: LP-Norte"
                                    value={purchaseData.loteParcial} 
                                    onChange={(e) => setPurchaseData({...purchaseData, loteParcial: e.target.value})} 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Método de Pago Preferido</label>
                                <select 
                                    value={purchaseData.metodoPago} 
                                    onChange={(e) => setPurchaseData({...purchaseData, metodoPago: e.target.value})} 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                                >
                                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                    <option value="Depósito en Efectivo">Depósito en Efectivo</option>
                                    <option value="Crédito Comercial 30 días">Crédito Comercial (30 días)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Porcentaje de Adelanto (%)</label>
                                <select 
                                    value={purchaseData.porcentajeAdelanto} 
                                    onChange={(e) => setPurchaseData({...purchaseData, porcentajeAdelanto: parseInt(e.target.value) })} 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                                >
                                    <option value={0}>Sin Adelanto (Pago 100% al entregar)</option>
                                    <option value={30}>30% Adelanto (Garantía estándar)</option>
                                    <option value={50}>50% Adelanto (Garantía prioritaria)</option>
                                </select>
                            </div>
                        </div>

                        {purchaseData.cantidad > 0 && (
                            <div style={{ backgroundColor: '#F4F7F5', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-primary)' }}>Resumen Estimado de la Preventa</h4>
                                <p style={{ margin: '0 0 8px 0' }}>Monto Total: <strong style={{fontSize: '1.1rem'}}>S/ {(parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)).toFixed(2)}</strong></p>
                                <p style={{ margin: '0 0 8px 0', color: '#2E7D32' }}>Monto Adelanto a Pagar ({purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * (purchaseData.porcentajeAdelanto / 100)).toFixed(2)}</strong></p>
                                <p style={{ margin: 0, color: '#d32f2f' }}>Monto Contraentrega ({100 - purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * ((100 - purchaseData.porcentajeAdelanto) / 100)).toFixed(2)}</strong></p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button onClick={() => setSelectedCrop(null)} style={{ background: 'transparent', border: '1px solid #ccc', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                            <button onClick={handleAddToCart} style={{ backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', padding: '10px 25px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,152,0,0.2)' }}>
                                🛒 Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SLIDING DRAWER: CARRITO PÚBLICO */}
            {isCartOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setIsCartOpen(false)}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        width: '100%', 
                        maxWidth: '450px', 
                        height: '100vh', 
                        padding: '30px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.5rem', fontFamily: 'var(--font-titles)' }}>🛒 Tu Carrito</h3>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>&times;</button>
                        </div>

                        {/* Listado de Productos */}
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🛒</span>
                                    <p style={{ color: '#888', fontSize: '1rem' }}>Tu carrito está vacío. ¡Explora el catálogo y añade productos!</p>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid #eee', position: 'relative' }}>
                                        <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)', fontSize: '1rem' }}>{item.nombre}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Agricultor: {item.agricultor}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Cant: {item.cantidad} Kg</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>Adelanto: {item.porcentajeAdelanto}%</span>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <strong style={{ color: 'var(--color-secondary)' }}>S/ {item.montoTotal.toFixed(2)}</strong>
                                            <button 
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', padding: 0 }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Resumen y Checkout */}
                        {cartItems.length > 0 && (
                            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#555' }}>Total Preventa:</span>
                                    <strong style={{ fontSize: '1.15rem' }}>S/ {cartTotal.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#2E7D32' }}>
                                    <span>Adelanto a pagar:</span>
                                    <strong style={{ fontSize: '1.15rem' }}>S/ {cartAdelanto.toFixed(2)}</strong>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 10px rgba(255, 152, 0, 0.3)'
                                    }}
                                >
                                    🔒 Proceder al Pago del Adelanto
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* 5. MODALES DE INFORMACIÓN CORPORATIVA */}
            {companyModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }} onClick={() => setCompanyModal(null)}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '550px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setCompanyModal(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>&times;</button>
                        
                        {companyModal === 'about' && (
                            <>
                                <h3 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', fontSize: '2rem', marginBottom: '15px' }}>Sobre AgroLink</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444' }}>
                                    AgroLink es una plataforma diseñada para digitalizar la cadena de suministro agropecuaria en América Latina. A través de preventas garantizadas (contratos de futuros agrícolas simplificados) y trazabilidad completa del cultivo, mitigamos el riesgo financiero tanto para el agricultor como para el comprador.
                                </p>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444', marginTop: '10px' }}>
                                    Buscamos eliminar los intermediarios innecesarios en la distribución agrícola, permitiendo que las ganancias se distribuyan de manera más justa y que los alimentos lleguen más frescos y seguros a los centros de consumo.
                                </p>
                            </>
                        )}

                        {companyModal === 'mission' && (
                            <>
                                <h3 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', fontSize: '2rem', marginBottom: '15px' }}>Nuestra Misión</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444' }}>
                                    Conectar eficientemente el campo con el mercado mediante tecnología innovadora, garantizando transparencia, trazabilidad y comercio justo. Buscamos empoderar al agricultor asegurando su venta desde el momento de la siembra, y brindar seguridad de abastecimiento y precios estables al comprador.
                                </p>
                            </>
                        )}

                        {companyModal === 'vision' && (
                            <>
                                <h3 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', fontSize: '2rem', marginBottom: '15px' }}>Nuestra Visión</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444' }}>
                                    Ser la plataforma tecnológica líder en Latinoamérica en la digitalización de pre-compras agrícolas, revolucionando la cadena de suministro global y construyendo un modelo de soberanía alimentaria sostenible, transparente y equitativo para el siglo XXI.
                                </p>
                            </>
                        )}

                        <button 
                            onClick={() => setCompanyModal(null)} 
                            style={{ 
                                marginTop: '25px', 
                                width: '100%', 
                                padding: '12px', 
                                backgroundColor: 'var(--color-primary)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: 'var(--radius-md)', 
                                fontWeight: 'bold', 
                                cursor: 'pointer' 
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* 6. PIE DE PÁGINA CORPORATIVO */}
            <footer style={{
                backgroundColor: 'var(--color-text)',
                color: '#e2e8f0',
                padding: '60px 20px 40px 20px',
                marginTop: '60px',
                borderTop: '5px solid var(--color-secondary)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                    
                    {/* Columna Logo/Descripción */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/logo.png" alt="AgroLink Logo" style={{ width: '45px', height: '45px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '50%', padding: '3px' }} />
                            <h3 style={{ color: 'white', fontFamily: 'var(--font-titles)', fontSize: '1.6rem', margin: 0 }}>
                                Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span>
                            </h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
                            Digitalizando el agro comercio en Latinoamérica mediante preventas y trazabilidad de cultivos en tiempo real.
                        </p>
                    </div>

                    {/* Columna Aspectos Corporativos */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', margin: '0 0 15px 0', borderBottom: '1px solid #4a5568', paddingBottom: '8px' }}>Aspectos de la Empresa</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li>
                                <button 
                                    onClick={() => setCompanyModal('about')}
                                    style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.95rem', padding: 0, textDecoration: 'underline', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--color-secondary)'}
                                    onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                                >
                                    Quiénes Somos
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setCompanyModal('mission')}
                                    style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.95rem', padding: 0, textDecoration: 'underline', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--color-secondary)'}
                                    onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                                >
                                    Nuestra Misión
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setCompanyModal('vision')}
                                    style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.95rem', padding: 0, textDecoration: 'underline', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--color-secondary)'}
                                    onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                                >
                                    Nuestra Visión
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Columna de Acceso Rápido */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', margin: '0 0 15px 0', borderBottom: '1px solid #4a5568', paddingBottom: '8px' }}>Acceso Rápido</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li>
                                <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem' }}
                                      onMouseEnter={(e) => e.target.style.color = 'var(--color-secondary)'}
                                      onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem' }}
                                      onMouseEnter={(e) => e.target.style.color = 'var(--color-secondary)'}
                                      onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>
                                    Crear Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Derechos Reservados */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #4a5568', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#a0aec0' }}>
                    &copy; {new Date().getFullYear()} AgroLink Inc. Todos los derechos reservados. Digitalización del campo con transparencia.
                </div>
            </footer>

        </div>
    );
}

export default PublicHome;