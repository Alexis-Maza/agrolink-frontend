import React, { useState, useRef } from 'react';
import { initialCrops } from '../../data/mockFarmerData';

// --- Funciones Auxiliares ---
const addDaysToDate = (dateStr, days) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    date.setDate(date.getDate() + parseInt(days || 0, 10));
    return date.toISOString().split('T')[0];
};

const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '---';
    const parts = dateStr.split('-');
    if(parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const calculateCurrentStage = (fechaSiembraStr, etapasObj) => {
    if (!fechaSiembraStr || !etapasObj) return { stage: 'Sin Iniciar', progress: 0, isCosechado: false, daysLeft: 0 };
    
    const start = new Date(fechaSiembraStr);
    start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysElapsed = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    
    const g = parseInt(etapasObj.germinacion || 0, 10);
    const c = parseInt(etapasObj.crecimiento || 0, 10);
    const f = parseInt(etapasObj.floracion || 0, 10);
    const m = parseInt(etapasObj.maduracion || 0, 10);
    const totalDays = g + c + f + m;
    
    if (daysElapsed < 0) return { stage: 'Programado', progress: 0, isCosechado: false, daysLeft: totalDays };
    if (daysElapsed >= totalDays) return { stage: 'Cosechado / Disponible', progress: 100, isCosechado: true, daysLeft: 0 };
    
    const progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
    const daysLeft = totalDays - daysElapsed;
    
    let currentStage = '';
    if (daysElapsed < g) currentStage = 'Germinación';
    else if (daysElapsed < g + c) currentStage = 'Crecimiento Vegetativo';
    else if (daysElapsed < g + c + f) currentStage = 'Floración';
    else currentStage = 'Maduración';
    
    return { stage: currentStage, progress, isCosechado: false, daysLeft };
};

function FarmerProducts() {
    // Estados de navegación
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [editCropId, setEditCropId] = useState(null);

    // Mock Data importada
    const [crops, setCrops] = useState(initialCrops);

    const defaultFormData = {
        nombre: '', variedad: '', lote: '', hectareas: '', cantidadEstimada: '', unidad: 'Kg',
        fechaSiembra: new Date().toISOString().split('T')[0], precio: '', minimoVenta: '',
        etapas: { germinacion: 10, crecimiento: 30, floracion: 15, maduracion: 15 }
    };

    // Estados de Formulario Principal
    const [formData, setFormData] = useState(defaultFormData);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Estados para el Modal de Edición de Tiempos/Incidencias
    const [editingCrop, setEditingCrop] = useState(null); 
    const [incidentData, setIncidentData] = useState({ tipo: '', descripcion: '' });

    // --- LOGICA DE NAVEGACIÓN Y APERTURA DE FORMULARIO ---
    const openCreateForm = () => {
        setFormData(defaultFormData);
        setImagePreview(null);
        setFormMode('create');
        setEditCropId(null);
        setIsFormVisible(true);
    };

    const openFullEditForm = (crop) => {
        // Parsear cantidad y unidad del string (ej. "15 Toneladas" -> 15, "Toneladas")
        const qtyParts = crop.cantidadTotal.split(' ');
        const cantEst = qtyParts[0] || '';
        const uni = qtyParts.length > 1 && qtyParts[1].includes('Ton') ? 'Toneladas' : 'Kg';

        setFormData({
            nombre: crop.nombre,
            variedad: crop.variedad || '',
            lote: crop.lote,
            hectareas: crop.hectareas || '',
            cantidadEstimada: cantEst,
            unidad: uni,
            fechaSiembra: crop.fechaSiembra,
            precio: crop.precio,
            minimoVenta: crop.minimoVenta || '',
            etapas: { ...crop.etapas }
        });
        setImagePreview(crop.imagen);
        setFormMode('edit');
        setEditCropId(crop.id);
        setIsFormVisible(true);
    };

    // --- HANDLERS DEL FORMULARIO PRINCIPAL ---
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleEtapaChange = (e) => setFormData({ ...formData, etapas: { ...formData.etapas, [e.target.name]: e.target.value } });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmitForm = (e) => {
        e.preventDefault();
        
        if (formMode === 'create') {
            alert('¡Cultivo registrado exitosamente!');
            // Aquí agregarías el nuevo cultivo al array `crops` en una app real
        } else {
            alert('¡Datos estructurales del cultivo actualizados!');
            // Lógica de update en el array
            const updated = crops.map(c => {
                if (c.id === editCropId) {
                    return {
                        ...c,
                        nombre: formData.nombre,
                        variedad: formData.variedad,
                        lote: formData.lote,
                        precio: formData.precio,
                        cantidadTotal: `${formData.cantidadEstimada} ${formData.unidad}`,
                        // No actualizamos 'cantidadDisponible' directamente sin lógica de ventas
                    };
                }
                return c;
            });
            setCrops(updated);
        }
        setIsFormVisible(false);
    };

    const handleDeleteCrop = () => {
        if (window.confirm('¿Está seguro de que desea eliminar este cultivo permanentemente? Esta acción no se puede deshacer.')) {
            const filtered = crops.filter(c => c.id !== editCropId);
            setCrops(filtered);
            setIsFormVisible(false);
        }
    };

    // --- HANDLERS DEL MODAL DE GESTION (Tiempos e Incidencias) ---
    const openGestionModal = (crop) => {
        setEditingCrop({ ...crop, etapas: { ...crop.etapas } });
        setIncidentData({ tipo: '', descripcion: '' });
    };
    const handleEditEtapaModalChange = (e) => {
        setEditingCrop({ ...editingCrop, etapas: { ...editingCrop.etapas, [e.target.name]: e.target.value } });
    };
    const saveGestionChanges = () => {
        const updatedCrops = crops.map(c => {
            if (c.id === editingCrop.id) {
                const hasIncident = incidentData.tipo !== '';
                return { ...editingCrop, incidencia: hasIncident };
            }
            return c;
        });
        setCrops(updatedCrops);
        
        if (incidentData.tipo !== '') {
            alert(`Notificación enviada a los compradores: [${incidentData.tipo}]`);
        } else {
            alert('Tiempos de cultivo actualizados correctamente.');
        }
        setEditingCrop(null);
    };


    // --- RENDERS ---

    // VISTA 1: CATÁLOGO
    const renderListView = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: '0 0 10px 0', fontSize: '2rem' }}>
                        Mis Cultivos
                    </h2>
                    <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>
                        Gestiona tus siembras actuales y reporta incidencias.
                    </p>
                </div>
                <button onClick={openCreateForm} style={{
                    backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(255,152,0,0.2)', fontSize: '1rem', transition: '0.2s'
                }}>
                    + Registrar Nueva Siembra
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {crops.map(crop => {
                    const stageData = calculateCurrentStage(crop.fechaSiembra, crop.etapas);
                    const totalD = parseInt(crop.etapas.germinacion) + parseInt(crop.etapas.crecimiento) + parseInt(crop.etapas.floracion) + parseInt(crop.etapas.maduracion);
                    const harvestDate = formatDateDisplay(addDaysToDate(crop.fechaSiembra, totalD));

                    return (
                        <div key={crop.id} style={{ 
                            backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', 
                            boxShadow: crop.incidencia ? '0 0 0 2px #d32f2f, 0 4px 15px rgba(211,47,47,0.15)' : '0 4px 15px rgba(0,0,0,0.06)', 
                            transition: 'transform 0.2s', position: 'relative'
                        }}>
                            <div style={{ height: '180px', backgroundImage: `url(${crop.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                
                                {/* Etiqueta de Estado Visual Dinámica */}
                                {crop.incidencia ? (
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#d32f2f', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                        ⚠️ Problema Reportado
                                    </div>
                                ) : (
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: stageData.isCosechado ? '#2E7D32' : 'var(--color-secondary)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                        {stageData.isCosechado ? '📦 Listo' : '🌱 En Crecimiento'}
                                    </div>
                                )}
                            </div>
                            
                            {/* Barra de Progreso */}
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0' }}>
                                <div style={{ width: `${stageData.progress}%`, height: '100%', backgroundColor: crop.incidencia ? '#d32f2f' : (stageData.isCosechado ? '#2E7D32' : 'var(--color-primary)'), transition: 'width 0.5s ease-in-out' }}></div>
                            </div>
                            
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>LOTE: {crop.lote}</div>
                                        <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)', fontSize: '1.3rem' }}>{crop.nombre}</h3>
                                    </div>
                                    <button onClick={() => openFullEditForm(crop)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }} title="Editar Información del Cultivo">
                                        ✏️
                                    </button>
                                </div>
                                
                                <div style={{ backgroundColor: crop.incidencia ? '#ffebee' : '#F4F7F5', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>Fase actual:</span>
                                        <span style={{ fontSize: '0.9rem', color: crop.incidencia ? '#d32f2f' : (stageData.isCosechado ? '#2E7D32' : 'var(--color-secondary)'), fontWeight: 'bold' }}>
                                            {stageData.stage}
                                        </span>
                                    </div>
                                    {!stageData.isCosechado && (
                                        <div style={{ fontSize: '0.8rem', color: crop.incidencia ? '#d32f2f' : '#777', textAlign: 'right' }}>
                                            Faltan {stageData.daysLeft} días para cosecha
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                                    <span style={{ color: '#666' }}>Disponible:</span>
                                    <strong style={{ color: 'var(--color-primary)' }}>{crop.cantidadDisponible} / {crop.cantidadTotal}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
                                    <span style={{ color: '#666' }}>Fecha Est. Cosecha:</span>
                                    <strong style={{ color: '#333' }}>{harvestDate}</strong>
                                </div>
                                
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.15rem' }}>S/ {crop.precio}</div>
                                    <button onClick={() => openGestionModal(crop)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(46,125,50,0.2)' }}>
                                        Gestionar ⚙️
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // VISTA 2: FORMULARIO PRINCIPAL DE REGISTRO / EDICIÓN
    const renderFormView = () => {
        const totalDaysForm = parseInt(formData.etapas.germinacion || 0) + parseInt(formData.etapas.crecimiento || 0) + parseInt(formData.etapas.floracion || 0) + parseInt(formData.etapas.maduracion || 0);
        const calculatedCosechaForm = addDaysToDate(formData.fechaSiembra, totalDaysForm);
        
        // Evaluar la regla de bloqueo transaccional
        let hasSales = false;
        if (formMode === 'edit' && editCropId) {
            const activeCrop = crops.find(c => c.id === editCropId);
            if (activeCrop && activeCrop.cantidadDisponible !== activeCrop.cantidadTotal) {
                hasSales = true;
            }
        }

        const inputStyle = { width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: hasSales ? '#f5f5f5' : 'white', cursor: hasSales ? 'not-allowed' : 'text', color: hasSales ? '#777' : '#000' };

        return (
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                    <div>
                        <h2 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.8rem' }}>
                            {formMode === 'create' ? 'Registrar Nueva Siembra' : 'Editar Información del Cultivo'}
                        </h2>
                        {hasSales && <p style={{ color: '#d32f2f', fontWeight: 'bold', margin: '5px 0 0 0', fontSize: '0.9rem' }}>🔒 Este cultivo ya tiene ventas. Algunos campos están bloqueados por seguridad.</p>}
                    </div>
                    <button onClick={() => setIsFormVisible(false)} style={{ background: 'transparent', border: '1px solid #ccc', color: '#555', padding: '8px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>
                        ← Volver a Mis Cultivos
                    </button>
                </div>

                <form onSubmit={handleSubmitForm}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                        
                        {/* COLUMNA 1 */}
                        <div>
                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '20px' }}>1. Información Básica</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Nombre del Cultivo</label>
                                    <input type="text" name="nombre" required disabled={hasSales} value={formData.nombre} onChange={handleInputChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Variedad</label>
                                    <input type="text" name="variedad" disabled={hasSales} value={formData.variedad} onChange={handleInputChange} style={inputStyle} />
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '20px' }}>2. Producción</h4>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Código de Lote Principal</label>
                                <input type="text" name="lote" required disabled={hasSales} value={formData.lote} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Hectáreas Sembradas</label>
                                    <input type="number" name="hectareas" min="0" step="0.1" required disabled={hasSales} value={formData.hectareas} onChange={handleInputChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Cantidad Estimada</label>
                                    <div style={{ display: 'flex' }}>
                                        <input type="number" name="cantidadEstimada" min="0" required disabled={hasSales} value={formData.cantidadEstimada} onChange={handleInputChange} style={{ ...inputStyle, width: '60%', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', borderRight: 'none' }} />
                                        <select name="unidad" disabled={hasSales} value={formData.unidad} onChange={handleInputChange} style={{ ...inputStyle, width: '40%', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                                            <option value="Kg">Kg</option>
                                            <option value="Toneladas">Ton</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '15px' }}>3. Etapas Agronómicas (Días)</h4>
                            <div style={{ backgroundColor: '#F4F7F5', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0, marginBottom: '15px' }}>Para realizar ajustes rápidos por clima o plagas, usa el botón "Gestionar" en el catálogo.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div><label style={{ display: 'block', fontSize: '0.9rem', color: '#555' }}>Germinación</label><input type="number" name="germinacion" required value={formData.etapas.germinacion} onChange={handleEtapaChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                    <div><label style={{ display: 'block', fontSize: '0.9rem', color: '#555' }}>Crec. Vegetativo</label><input type="number" name="crecimiento" required value={formData.etapas.crecimiento} onChange={handleEtapaChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                    <div><label style={{ display: 'block', fontSize: '0.9rem', color: '#555' }}>Floración</label><input type="number" name="floracion" required value={formData.etapas.floracion} onChange={handleEtapaChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                    <div><label style={{ display: 'block', fontSize: '0.9rem', color: '#555' }}>Maduración</label><input type="number" name="maduracion" required value={formData.etapas.maduracion} onChange={handleEtapaChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                </div>
                                <div style={{ marginTop: '15px', textAlign: 'right', fontWeight: 'bold' }}>Total: <span style={{ color: 'var(--color-primary)' }}>{totalDaysForm} días</span></div>
                            </div>
                        </div>

                        {/* COLUMNA 2 */}
                        <div>
                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '20px' }}>4. Cálculo de Fechas Clave</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Fecha de Siembra</label>
                                    <input type="date" name="fechaSiembra" required value={formData.fechaSiembra} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Cosecha Proyectada</label>
                                    <input type="date" disabled value={calculatedCosechaForm} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', backgroundColor: '#f5f5f5', color: '#2E7D32', fontWeight: 'bold' }} />
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '20px' }}>5. Comercialización</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Precio Unitario (S/)</label>
                                    <input type="number" name="precio" min="0" step="0.01" required value={formData.precio} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Venta Mínima</label>
                                    <input type="text" name="minimoVenta" required value={formData.minimoVenta} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }} />
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '15px' }}>Foto del Cultivo</h4>
                            <div style={{ border: '2px dashed #ccc', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => fileInputRef.current.click()}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                                ) : (
                                    <>
                                        <span style={{ fontSize: '2.5rem', color: '#aaa', marginBottom: '10px' }}>📷</span>
                                        <span style={{ color: '#666', fontSize: '0.95rem' }}>Haz clic para actualizar foto</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                        {/* Zona de Peligro a la izquierda */}
                        <div>
                            {formMode === 'edit' && (
                                <button type="button" onClick={handleDeleteCrop} disabled={hasSales} style={{ 
                                    background: hasSales ? '#f5f5f5' : '#FFEBEE', color: hasSales ? '#aaa' : '#d32f2f', border: `1px solid ${hasSales ? '#eee' : '#ffcdd2'}`, padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: hasSales ? 'not-allowed' : 'pointer' 
                                }} title={hasSales ? 'No puede eliminar un cultivo con ventas activas' : 'Eliminar este cultivo de su catálogo'}>
                                    🗑️ Eliminar Cultivo
                                </button>
                            )}
                        </div>

                        {/* Controles de Guardado a la derecha */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button type="button" onClick={() => setIsFormVisible(false)} style={{ background: 'transparent', color: '#555', border: '1px solid #ccc', padding: '14px 30px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', transition: '0.2s' }}>
                                Cancelar
                            </button>
                            <button type="submit" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)', transition: '0.2s' }}>
                                {formMode === 'create' ? 'Publicar Cultivo' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    // VISTA 3: MODAL DE GESTIÓN Y NOTIFICACIÓN
    const renderEditModal = () => {
        if (!editingCrop) return null;

        const eD = parseInt(editingCrop.etapas.germinacion || 0) + parseInt(editingCrop.etapas.crecimiento || 0) + parseInt(editingCrop.etapas.floracion || 0) + parseInt(editingCrop.etapas.maduracion || 0);
        const newHarvestDate = addDaysToDate(editingCrop.fechaSiembra, eD);

        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s' }}>
                    <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'var(--font-titles)' }}>Gestión de Cultivo Diario</h2>
                            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>{editingCrop.nombre} | Lote: {editingCrop.lote}</p>
                        </div>
                        <button onClick={() => setEditingCrop(null)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                    </div>

                    <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ backgroundColor: '#F8F9FA', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #eee' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-secondary)' }}>⏱️ Ajuste Rápido de Tiempos (Días)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                <div><label style={{ fontSize: '0.85rem' }}>Germinación</label><input type="number" name="germinacion" value={editingCrop.etapas.germinacion} onChange={handleEditEtapaModalChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                <div><label style={{ fontSize: '0.85rem' }}>Crecimiento</label><input type="number" name="crecimiento" value={editingCrop.etapas.crecimiento} onChange={handleEditEtapaModalChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                <div><label style={{ fontSize: '0.85rem' }}>Floración</label><input type="number" name="floracion" value={editingCrop.etapas.floracion} onChange={handleEditEtapaModalChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                                <div><label style={{ fontSize: '0.85rem' }}>Maduración</label><input type="number" name="maduracion" value={editingCrop.etapas.maduracion} onChange={handleEditEtapaModalChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
                            </div>
                            <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '5px', border: '1px solid #c8e6c9', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#2E7D32' }}>Nueva Proyección de Cosecha:</span>
                                <strong style={{ fontSize: '1.2rem', color: '#1b5e20' }}>{formatDateDisplay(newHarvestDate)}</strong>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#FFEBEE', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #ffcdd2' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#d32f2f' }}>📢 Reportar Imprevisto</h4>
                            <div style={{ marginBottom: '15px' }}>
                                <select value={incidentData.tipo} onChange={(e) => setIncidentData({...incidentData, tipo: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ef9a9a', backgroundColor: 'white' }}>
                                    <option value="">-- Sin incidencia (No notificar) --</option>
                                    <option value="Plaga o Enfermedad">🐛 Plaga o Enfermedad</option>
                                    <option value="Clima Adverso">⛈️ Clima Adverso</option>
                                    <option value="Problema Logístico">🚜 Problema Logístico</option>
                                    <option value="Otro">⚠️ Otro</option>
                                </select>
                            </div>
                            {incidentData.tipo !== '' && (
                                <div style={{ marginBottom: '15px' }}>
                                    <textarea value={incidentData.descripcion} onChange={(e) => setIncidentData({...incidentData, descripcion: e.target.value})} placeholder="Explique brevemente a sus compradores..." style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ef9a9a', minHeight: '80px', fontFamily: 'inherit' }} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ padding: '20px 30px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '15px', backgroundColor: '#f9f9f9', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                        <button onClick={() => setEditingCrop(null)} style={{ background: 'white', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#555' }}>Cancelar</button>
                        <button onClick={saveGestionChanges} style={{ background: incidentData.tipo !== '' ? '#d32f2f' : 'var(--color-primary)', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
                            {incidentData.tipo !== '' ? '🔔 Guardar y Notificar a Compradores' : '💾 Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {isFormVisible ? renderFormView() : renderListView()}
            {renderEditModal()}
        </div>
    );
}

export default FarmerProducts;
