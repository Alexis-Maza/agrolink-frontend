import React, { useState, useEffect } from 'react';
import { initialCatalog } from '../../data/mockBuyerData';
import api from '../../api/axiosConfig'; 

const AVAILABLE_CERTIFICATIONS = [
    'Certificación de Buenas Prácticas Agrícolas',
    'Certificación Orgánica Nacional',
    'Certificación de Comercio Justo',
    'Certificación de Agricultura Familiar',
    'Certificación GlobalG.A.P'
];

function BuyerCatalog({ acquiredIds, onAddToCart }) {
    const [catalog, setCatalog] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCertifications, setSelectedCertifications] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const itemsPerPage = 9;

    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const cargarProductosBackend = async () => {
            try {
                const certsParam = selectedCertifications.join(',');
                
                const response = await api.get('/public/catalogo', {
                    params: {
                        search: searchTerm,
                        region: selectedRegion,
                        precioMax: maxPrice,
                        certificaciones: certsParam
                    }
                });
                
                setCatalog(response.data);
            } catch (error) {
                console.error("Error trayendo el catálogo del backend:", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            cargarProductosBackend();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCertifications, selectedRegion, maxPrice]);


    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('agrolink_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error reading cart from localStorage", e);
            }
        }
        return [];
    });

    // Cerrar dropdown al hacer clic fuera
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    React.useEffect(() => {
        localStorage.setItem('agrolink_cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    }, [cartItems]);

    // Resetear paginación cuando cambian los filtros
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCertifications, selectedRegion, maxPrice]);

    const getProfileAddress = () => {
        const saved = localStorage.getItem('agrolink_buyer_profile');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.direccionEntrega) return data.direccionEntrega;
            } catch (e) {}
        }
        return "Almacén Av. Industrial 1250, Callao";
    };

    const [purchaseData, setPurchaseData] = useState({ cantidad: '', metodoPago: '', porcentajeAdelanto: 0, direccionEntrega: '', fechaEntregaEstimada: '' });

    const handleCloseModal = () => {
        setSelectedCrop(null);
        setPurchaseData({ cantidad: '', metodoPago: '', porcentajeAdelanto: 0, direccionEntrega: '', fechaEntregaEstimada: '' });
    };


    // Filtrar cultivos combinando búsqueda de texto (nombre, lote, agricultor) y certificaciones
    const filteredCrops = catalog;

    // Paginación Math
    const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

    const handleAddToCart = () => {
        if (!purchaseData.cantidad || parseFloat(purchaseData.cantidad) <= 0) {
            alert('Por favor ingresa una cantidad válida.');
            return;
        }
        if (!purchaseData.metodoPago) {
            alert('Por favor selecciona un método de pago preferido.');
            return;
        }
        if (purchaseData.porcentajeAdelanto === '') {
            alert('Por favor selecciona un porcentaje de adelanto.');
            return;
        }
        if (!purchaseData.direccionEntrega || !purchaseData.direccionEntrega.trim()) {
            alert('Por favor ingresa una dirección de entrega válida.');
            return;
        }

        const priceNum = parseFloat(selectedCrop.precio);
        const qtyNum = parseFloat(purchaseData.cantidad);
        const total = priceNum * qtyNum;

        const nuevoItem = {
            id: Date.now(), 
            idCultivo: selectedCrop.idCultivo || selectedCrop.id_cultive || selectedCrop.id,
            cultivoId: selectedCrop.lote || `CULT-${selectedCrop.idCultivo || selectedCrop.id}`,
            nombre: selectedCrop.nombre,
            lote: selectedCrop.lote || 'L-General',
            loteParcial: `LP-${Math.floor(Math.random() * 1000)}`,
            cantidad: qtyNum,
            precio: priceNum,
            metodoPago: purchaseData.metodoPago,
            porcentajeAdelanto: parseInt(purchaseData.porcentajeAdelanto) || 0,
            montoTotal: total,
            seleccionado: true, 
            imagen: selectedCrop.imagen,
            agricultor: typeof selectedCrop.agricultor === 'object' && selectedCrop.agricultor !== null 
                ? (selectedCrop.agricultor.usuario?.nombre || 'Agricultor Registrado') 
                : (selectedCrop.agricultor || 'Agricultor Registrado'),
            direccionEntrega: purchaseData.direccionEntrega,
            fechaEntregaEstimada: purchaseData.fechaEntregaEstimada || null
        };

        const carritoActual = JSON.parse(localStorage.getItem('agrolink_cart') || '[]');
        const carritoActualizado = [...carritoActual, nuevoItem];
        
        localStorage.setItem('agrolink_cart', JSON.stringify(carritoActualizado));
        setCartItems(carritoActualizado); 
        window.dispatchEvent(new Event('cartUpdated')); 

        // 🎉 5. Cierre limpio de Modal
        alert(`¡${nuevoItem.nombre} añadido al carrito correctamente! 🛒\nPuedes acumular más siembras o proceder al pago desde la pestaña "Mi Carrito".`);
        handleCloseModal();
    };

    const handleCertToggle = (cert) => {
        if (selectedCertifications.includes(cert)) {
            setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
        } else {
            setSelectedCertifications([...selectedCertifications, cert]);
        }
    };

    return (
        <div>       
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '5px', fontSize: '2rem' }}>Catálogo de Cultivos</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '25px' }}>Explora las siembras disponibles y asegura tu compra con adelantos.</p>

            {/* BARRA DE FILTROS HORIZONTAL SUPERIOR */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: 'var(--radius-lg)', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
                marginBottom: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Buscador */}
                    <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1.1rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar por cultivo, agricultor o lote..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 15px 12px 45px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #ddd',
                                fontSize: '0.95rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    {/*Filtro de Región (Select Dropdown) */}
                    <div style={{ minWidth: '180px' }}>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ddd', backgroundColor: 'white', fontWeight: '500' }}
                        >
                            <option value="">🌍 Todas las Regiones</option>
                            <option value="Junín">Junín</option>
                            <option value="Lima">Lima</option>
                            <option value="Pasco">Pasco</option>
                            <option value="Cajamarca">Cajamarca</option>
                        </select>
                    </div>

                    {/* Filtro de Precio Máximo (Input Numérico) */}
                    <div style={{ minWidth: '150px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontWeight: 'bold', fontSize: '0.9rem' }}>S/ Max:</span>
                        <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={maxPrice}
                        
                            onChange={(e) => {
                            const valor = e.target.value;
                            if (valor === '' || parseFloat(valor) >= 0) {
                                setMaxPrice(valor);
                            }
                        }}
                            style={{ width: '100%', padding: '12px 15px 12px 65px', borderRadius: 'var(--radius-md)', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Selector de Certificaciones Dropdown */}
                    
                    
                    
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: selectedCertifications.length > 0 ? '#E8F5E9' : 'white',
                                border: selectedCertifications.length > 0 ? '1px solid var(--color-primary)' : '1px solid #ddd',
                                color: selectedCertifications.length > 0 ? 'var(--color-primary)' : 'var(--color-text)',
                                padding: '12px 20px',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                            }}
                        >
                            🛡️ Certificaciones {selectedCertifications.length > 0 && `(${selectedCertifications.length})`}
                            <span style={{ fontSize: '0.8rem', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                        </button>
                        

                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                border: '1px solid #eee',
                                padding: '18px',
                                width: '330px',
                                zIndex: 100,
                                boxSizing: 'border-box'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {AVAILABLE_CERTIFICATIONS.map((cert, idx) => {
                                        const isChecked = selectedCertifications.includes(cert);
                                        return (
                                            <label key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '8px',
                                                fontSize: '0.85rem',
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
                        )}
                    </div>
                </div>
                

                {/* Chips de filtros activos */}
                {(selectedCertifications.length > 0 || searchTerm || selectedRegion || (maxPrice && parseFloat(maxPrice) > 0)) && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: '15px' 
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>Filtros activos:</span>
                        
                        {searchTerm && (
                            <span style={{ 
                                backgroundColor: '#f1f1f1', 
                                color: '#333', 
                                fontSize: '0.8rem', 
                                padding: '5px 12px', 
                                borderRadius: '15px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Texto: "{searchTerm}"
                                <button 
                                    onClick={() => setSearchTerm('')} 
                                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '1rem', lineHeight: 1 }}
                                >
                                    &times;
                                </button>
                            </span>
                        )}
                        {selectedRegion && (
                            <span style={{
                                backgroundColor: '#E3F2FD',
                                color: '#1E88E5',
                                fontSize: '0.8rem',
                                padding: '5px 12px',
                                borderRadius: '15px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                🌍 Región: "{selectedRegion}"
                                <button
                                    onClick={() => setSelectedRegion('')}
                                    style={{ background: 'none', border: 'none', color: '#1E88E5', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '1rem', lineHeight: '1' }}
                                >
                                    &times;
                                </button>
                            </span>
                        )}

                        {maxPrice && (
                            <span style={{
                                backgroundColor: '#FFF3E0',
                                color: '#FB8C00',
                                fontSize: '0.8rem',
                                padding: '5px 12px',
                                borderRadius: '15px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                💰 Máx: S/ {maxPrice}
                                <button
                                    onClick={() => setMaxPrice('')}
                                    style={{ background: 'none', border: 'none', color: '#FB8C00', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '1rem', lineHeight: '1' }}
                                >
                                    &times;
                                </button>
                            </span>
                        )}

                        {selectedCertifications.map((cert, idx) => (
                            <span key={idx} style={{ 
                                backgroundColor: '#E8F5E9', 
                                color: 'var(--color-primary)', 
                                fontSize: '0.8rem', 
                                padding: '5px 12px', 
                                borderRadius: '15px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '600'
                            }}>
                                🛡️ {cert.length > 20 ? cert.substring(0, 18) + '...' : cert}
                                <button 
                                    onClick={() => handleCertToggle(cert)} 
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '1rem', lineHeight: 1 }}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}

                        <button 
                           onClick={() => {
                                    setSelectedCertifications([]); 
                                    setSearchTerm('');             
                                    setSelectedRegion('');         
                                    setMaxPrice('');               
                                }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                padding: '5px 10px',
                                marginLeft: 'auto'
                            }}
                        >
                            Limpiar todos
                        </button>
                    </div>
                )}
            </div>

            {/* GRILLA DE PRODUCTOS (100% Ancho) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '30px' }}>
                {visibleCrops.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🍃</span>
                        <p style={{ color: '#888', fontSize: '1.1rem', margin: 0 }}>No se encontraron cultivos con los filtros seleccionados.</p>
                    </div>
                ) : (
                    visibleCrops.map(crop => {
                        const infoProducto = crop.productoVariedad;
    
                        // 1. Nombre del producto (Ya te funciona bien)
                        const nombreCultivo = infoProducto?.nombreProductoVariedad || 'Cultivo Desconocido';
                        
                        // 2. CORRECCIÓN DE VARIEDAD: Mapea exactamente con 'variedadProductoVariedad'
                        const variedadCultivo = infoProducto?.variedadProductoVariedad || 'Variedad General';
                        
                        // 3. CORRECCIÓN DE PRECIO: Mapea exactamente con 'precioProductoVariedad'
                        const precioCultivo = infoProducto?.precioProductoVariedad || 0.00;
                        
                        // 4. Identificador único de Lote usando el idCultivo real
                        const codigoLote = crop.lote || `LOTE-CULT-${crop.idCultivo || '000'}`;
                        
                        // 5. Datos de producción
                        const areaSembrada = crop.areaSembrada || 0;
                        const cantidadDisponible = crop.cantidadDisponible || 'Por definir';
                        
                        // 6. Colocamos fotos referenciales automáticas según el tipo de producto para que se vea espectacular
                        let imagenCultivo = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop'; 
                        
                        const nombreLower = nombreCultivo.toLowerCase();
    
                        if (nombreLower.includes('café') || nombreLower.includes('cafe')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop';
                        } else if (nombreLower.includes('papa')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop';
                        } else if (nombreLower.includes('palta') || nombreLower.includes('hass')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop';
                        } else if (nombreLower.includes('camote') || nombreLower.includes('morado') || nombreLower.includes('jonathan')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1590005354167-6da97870c913?w=600&auto=format&fit=crop';
                        } else if (nombreLower.includes('espárrago') || nombreLower.includes('esparrago') || nombreLower.includes('verde')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1515471204580-f7c8f3513793?w=600&auto=format&fit=crop';
                        } else if (nombreLower.includes('maíz') || nombreLower.includes('maiz') || nombreLower.includes('duro')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1551754625-70c90487530d?w=600&auto=format&fit=crop';
                        }
                        else if (nombreLower.includes('quinua') || nombreLower.includes('quinoa')) {
                            imagenCultivo = 'https://images.unsplash.com/photo-1506801310323-534be5e7bb77?w=600&auto=format&fit=crop';
                        }

                            return (
                            <div 
                                key={crop.idCultivo || crop.id} 
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
                                <div style={{ height: '180px', backgroundImage: `url(${imagenCultivo})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                    {crop.incidencia && <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#d32f2f', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>⚠️ Incidencia</div>}
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>LOTE: {codigoLote}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>Var: <strong>{variedadCultivo}</strong></span>
                                        </div>
                                        <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1.25rem', fontFamily: 'var(--font-titles)', fontWeight: 'bold' }}>{nombreCultivo}</h3>
                                        
                                        <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555' }}>
                                            👤 Agricultor: <strong style={{ color: 'var(--color-text)' }}>
                                                {typeof crop.agricultor === 'object' && crop.agricultor !== null 
                                                    ? (crop.agricultor.usuario?.nombre || 'Agricultor Registrado') 
                                                    : (crop.agricultor || 'Agricultor Registrado')}
                                            </strong>
                                        </p>

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
                                            <span style={{ color: '#666' }}>Área / Disponible:</span>
                                            <strong style={{ color: 'var(--color-primary)' }}>{areaSembrada} Ha / {cantidadDisponible}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Precio:</span>
                                            <strong style={{ color: 'var(--color-secondary)', fontSize: '1.15rem' }}>S/ {parseFloat(precioCultivo).toFixed(2)} / Kg</strong>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedCrop({ ...crop, nombre: nombreCultivo, precio: precioCultivo, lote: codigoLote, variedad: variedadCultivo, imagen: imagenCultivo });
                                                setPurchaseData(prev => ({ ...prev, direccionEntrega: getProfileAddress() }));
                                            }} 
                                            style={{ 
                                                width: '100%', 
                                                backgroundColor: 'var(--color-primary)', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '12px', 
                                                borderRadius: 'var(--radius-md)', 
                                                fontWeight: 'bold', 
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                                        >
                                            Ver más detalle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
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

            {/* MODAL DETALLE Y COMPRA */}
            {selectedCrop && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>&times;</button>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                            <img src={selectedCrop.imagen} alt={selectedCrop.nombre} style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <div>
                                <h3 style={{ color: 'var(--color-primary)', margin: '0 0 10px 0', fontSize: '1.6rem', fontFamily: 'var(--font-titles)' }}>{selectedCrop.nombre} - {selectedCrop.variedad}</h3>
                                <p style={{ margin: '0 0 5px 0', color: '#555' }}>Agricultor: <strong>{typeof selectedCrop.agricultor === 'object' ? (selectedCrop.agricultor?.usuario?.nombre || 'Agricultor Registrado') : (selectedCrop.agricultor || 'Agricultor Registrado')}</strong></p>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {selectedCrop.certificaciones && selectedCrop.certificaciones.map((cert, idx) => (
                                        <span key={idx} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px' }}>
                                            🛡️ {cert}
                                        </span>
                                    ))}
                                </div>
                                <a href={`https://wa.me/${selectedCrop.telefonoFarmer}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '15px' }}>
                                    💬 Contactar por WhatsApp
                                </a>
                            </div>
                        </div>

                        {selectedCrop.incidencia && (
                            <div style={{ padding: '15px', backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', color: '#d32f2f', fontWeight: 'bold', marginBottom: '20px' }}>
                                ⚠️ Alerta de Incidencia: {selectedCrop.incidencia}
                            </div>
                        )}

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
                                <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>S/ {(parseFloat(selectedCrop.precio) || 0).toFixed(2)}</strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Valor Total Lote</span>
                                <strong style={{ fontSize: '1.15rem', color: '#2E7D32' }}>
                                    S/ {((parseFloat(selectedCrop.precio) || 0) * (parseFloat(selectedCrop.areaSembrada || selectedCrop.area_sembrada) * 10000)).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Total Lote Declarado</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                                    {(parseFloat(selectedCrop.areaSembrada || selectedCrop.area_sembrada) * 10).toFixed(1)} Toneladas
                                </strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Compra Mínima</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--color-secondary)' }}>{selectedCrop.minimoVenta || '500 Kg'}</strong>
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px', border: '1px solid #eee', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#FAFAFA' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-text)', fontSize: '1.05rem', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>🌱 Detalles de Producción y Cultivo</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Hectáreas Sembradas</span>
                                    <span style={{ fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>{selectedCrop.areaSembrada || selectedCrop.area_sembrada || 0} Ha</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Fecha de Siembra</span>
                                    <span style={{ fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>{selectedCrop.fecha_inicio || selectedCrop.fechaSiembra ? new Date(selectedCrop.fecha_inicio || selectedCrop.fechaSiembra).toLocaleDateString('es-PE') : 'No especificada'}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Variedad de Cultivo</span>
                                    <span style={{ fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>{selectedCrop.variedad || 'Estándar'}</span>
                                </div>
                            </div>
                        </div>

                        <h4 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.1rem' }}>Configurar Compra de la Preventa</h4>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cantidad a Comprar (Kg)</label>
                            <input 
                                type="number" 
                                name="cantidad" 
                                placeholder={`Mínimo: ${selectedCrop.minimoVenta || '500 Kg'}`}
                                value={purchaseData.cantidad} 
                                onChange={(e) => setPurchaseData({ ...purchaseData, cantidad: e.target.value })} 
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Dirección de Entrega para este Producto</label>
                            <input 
                                type="text" 
                                name="direccionEntrega" 
                                placeholder="Ej: Almacén Principal, Av. Industrial 1250, Callao"
                                value={purchaseData.direccionEntrega} 
                                onChange={(e) => setPurchaseData({ ...purchaseData, direccionEntrega: e.target.value })} 
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fecha de Entrega Estimada</label>
                            <input 
                                type="date"
                                name="fechaEntregaEstimada"
                                value={purchaseData.fechaEntregaEstimada}
                                min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                onChange={(e) => setPurchaseData({ ...purchaseData, fechaEntregaEstimada: e.target.value })} 
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }} 
                            />
                            <span style={{ fontSize: '0.78rem', color: '#888', marginTop: '4px', display: 'block' }}>Opcional. Si se deja vacío se calculará automáticamente (90 días).</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Método de Pago Preferido</label>
                                <select 
                                    value={purchaseData.metodoPago} 
                                    onChange={(e) => setPurchaseData({ ...purchaseData, metodoPago: e.target.value })} 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' }}
                                >
                                    <option value="">-- Seleccionar Método de Pago --</option>
                                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                    <option value="Depósito en Efectivo">Depósito en Efectivo</option>
                                    <option value="Crédito Comercial 30 días">Crédito Comercial (30 días)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Porcentaje de Adelanto (%)</label>
                                <select 
                                    value={purchaseData.porcentajeAdelanto} 
                                    onChange={(e) => setPurchaseData({ ...purchaseData, porcentajeAdelanto: parseInt(e.target.value) || 0 })} 
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
                                <p style={{ margin: '0 0 8px 0' }}>Monto Total: <strong style={{ fontSize: '1.1rem' }}>S/ {(parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)).toFixed(2)}</strong></p>
                                <p style={{ margin: '0 0 8px 0', color: '#2E7D32' }}>Adelanto a pagar ahora ({purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * (purchaseData.porcentajeAdelanto / 100)).toFixed(2)}</strong></p>
                                <p style={{ margin: 0, color: '#d32f2f' }}>Contraentrega ({100 - purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * ((100 - purchaseData.porcentajeAdelanto) / 100)).toFixed(2)}</strong></p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button onClick={handleCloseModal} style={{ background: 'transparent', border: '1px solid #ccc', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                            <button 
                                onClick={handleAddToCart} 
                                style={{ 
                                    backgroundColor: 'var(--color-secondary)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '10px 25px', 
                                    borderRadius: 'var(--radius-md)', 
                                    cursor: 'pointer', 
                                    fontWeight: 'bold', 
                                    boxShadow: '0 4px 10px rgba(255,152,0,0.2)' 
                                }}
                            >
                                🛒 Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerCatalog;