import React, { useState } from 'react';
import { initialCatalog } from '../../data/mockBuyerData';

function BuyerCatalog() {
    const [catalog] = useState(initialCatalog);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);
    
    // Estado simulado del carrito
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
    
    React.useEffect(() => {
        localStorage.setItem('agrolink_cart', JSON.stringify(cartItems));
        // Disparar evento para que otros componentes (como el Navbar) actualicen el conteo
        window.dispatchEvent(new Event('cartUpdated'));
    }, [cartItems]);

    const [purchaseData, setPurchaseData] = useState({ cantidad: '', loteParcial: '', metodoPago: 'Transferencia Bancaria', porcentajeAdelanto: 30 });

    const filteredCrops = catalog.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.lote.toLowerCase().includes(searchTerm.toLowerCase()));

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

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Catálogo de Cultivos</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Explora las siembras disponibles y asegura tu compra con adelantos.</p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <input type="text" placeholder="Buscar por nombre o lote..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', maxWidth: '400px', padding: '12px 15px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', marginBottom: '25px' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {filteredCrops.map(crop => (
                        <div key={crop.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: crop.incidencia ? '1px solid #ffcdd2' : '1px solid #eee' }}>
                            <div style={{ height: '180px', backgroundImage: `url(${crop.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                {crop.incidencia && <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#d32f2f', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>⚠️ Incidencia</div>}
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ color: '#888', fontSize: '0.85rem', fontWeight: 'bold' }}>LOTE: {crop.lote}</div>
                                <h3 style={{ margin: '5px 0 15px 0', color: 'var(--color-text)', fontSize: '1.3rem' }}>{crop.nombre}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ color: '#666' }}>Disponible:</span>
                                    <strong style={{ color: 'var(--color-primary)' }}>{crop.cantidadDisponible}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ color: '#666' }}>Precio:</span>
                                    <strong style={{ color: 'var(--color-secondary)', fontSize: '1.1rem' }}>S/ {crop.precio} / Kg</strong>
                                </div>
                                <button onClick={() => setSelectedCrop(crop)} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '10px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>Ver más detalle</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DETALLE Y COMPRA */}
            {selectedCrop && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setSelectedCrop(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#888', cursor: 'pointer' }}>&times;</button>
                        
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                            <img src={selectedCrop.imagen} alt={selectedCrop.nombre} style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <div>
                                <h3 style={{ color: 'var(--color-primary)', margin: '0 0 10px 0' }}>{selectedCrop.nombre} - {selectedCrop.variedad}</h3>
                                <p style={{ margin: '0 0 5px 0', color: '#555' }}>Agricultor: <strong>{selectedCrop.agricultor}</strong></p>
                                <a href={`https://wa.me/${selectedCrop.telefonoFarmer}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '10px' }}>
                                    💬 Contactar por WhatsApp
                                </a>
                            </div>
                        </div>

                        {selectedCrop.incidencia && (
                            <div style={{ padding: '15px', backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', color: '#d32f2f', fontWeight: 'bold', marginBottom: '20px' }}>
                                ⚠️ Alerta de Incidencia: {selectedCrop.incidencia}
                            </div>
                        )}

                        <h4 style={{ color: 'var(--color-text)', marginBottom: '15px' }}>Configurar Compra y Adelanto</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cantidad a Comprar (Kg)</label>
                                <input type="number" name="cantidad" value={purchaseData.cantidad} onChange={(e) => setPurchaseData({...purchaseData, cantidad: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lote Parcial (Opcional)</label>
                                <input type="text" name="loteParcial" value={purchaseData.loteParcial} onChange={(e) => setPurchaseData({...purchaseData, loteParcial: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Método de Pago</label>
                                <select value={purchaseData.metodoPago} onChange={(e) => setPurchaseData({...purchaseData, metodoPago: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }}>
                                    <option>Transferencia Bancaria</option>
                                    <option>Depósito</option>
                                    <option>Crédito Comercial</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Porcentaje de Adelanto (%)</label>
                                <select value={purchaseData.porcentajeAdelanto} onChange={(e) => setPurchaseData({...purchaseData, porcentajeAdelanto: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }}>
                                    <option value={0}>Sin Adelanto (Pago 100% al entregar)</option>
                                    <option value={30}>30% Adelanto</option>
                                    <option value={50}>50% Adelanto</option>
                                </select>
                            </div>
                        </div>

                        {purchaseData.cantidad > 0 && (
                            <div style={{ backgroundColor: '#F4F7F5', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-primary)' }}>Resumen de Pago</h4>
                                <p style={{ margin: '0 0 5px' }}>Monto Total: <strong>S/ {(parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)).toFixed(2)}</strong></p>
                                <p style={{ margin: '0 0 5px', color: '#2E7D32' }}>Adelanto a pagar ahora ({purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * (purchaseData.porcentajeAdelanto / 100)).toFixed(2)}</strong></p>
                                <p style={{ margin: 0, color: '#d32f2f' }}>Contraentrega ({100 - purchaseData.porcentajeAdelanto}%): <strong>S/ {((parseFloat(purchaseData.cantidad) * parseFloat(selectedCrop.precio)) * ((100 - purchaseData.porcentajeAdelanto) / 100)).toFixed(2)}</strong></p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button onClick={() => setSelectedCrop(null)} style={{ background: 'transparent', border: '1px solid #ccc', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                            <button onClick={handleAddToCart} style={{ backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(255,152,0,0.2)' }}>
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