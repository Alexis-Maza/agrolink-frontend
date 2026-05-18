import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar'; // Importamos el nuevo Navbar

function PublicHome() {
    return (
        <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', scrollBehavior: 'smooth' }}>

            {/* INCLUSIÓN DEL NAVBAR */}
            <Navbar />

            {/* 1. HERO SECTION */}
            <header style={{
                color: 'white',
                padding: '100px 20px',
                textAlign: 'center',
                background: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.7)), url([ImagenConceptoCampoSunrise]) no-repeat center/cover',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-titles)', marginBottom: '20px', lineHeight: '1.2' }}>
                    Asegura la Cosecha del Futuro, Hoy
                </h1>
                <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                    Agrolink conecta la tierra con el mercado mediante preventas agrícolas garantizadas y trazabilidad en tiempo real desde la siembra.
                </p>
                <Link to="/buyer" style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'white',
                    padding: '15px 40px',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    display: 'inline-block'
                }}>
                    Explorar Preventas Abiertas
                </Link>
            </header>

            {/* 2. EL CONCEPTO AGROLINK / NOSOTROS */}
            <section id="about" style={{ maxWidth: '1200px', margin: '60px auto', padding: '40px 20px' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '50px', fontSize: '2.5rem', fontFamily: 'var(--font-titles)' }}>
                    Una Cadena de Suministro Transparente
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center', marginBottom: '60px' }}>
                    <img src="[ImagenAgricultorConTablet]" alt="Agricultor registrando siembra" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h3 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.8rem' }}>El Agricultor Reporta</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                            Publica tus cultivos desde la etapa inicial. Registra tus hectáreas, el tipo de producto, la cantidad estimada de cosecha, el inicio del siembro y la etapa actual. Además, reporta incidencias o problemas directamente en tu panel.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
                    <div style={{ order: 2 }}>
                        <img src="[ImagenCompradorMonitoreando]" alt="Comprador viendo crecimiento" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                    </div>
                    <div style={{ order: 1 }}>
                        <h3 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.8rem' }}>El Comprador Monitorea</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#555' }}>
                            Asegura productos frescos comprando de antemano. Accede al historial de trazabilidad del producto que adquiriste: ve el seguimiento visual de cómo va creciendo y reportes del estado de la tierra.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. MISIÓN Y VISIÓN */}
            <section style={{ backgroundColor: 'white', padding: '80px 20px', marginBottom: '60px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                    {/* Misión ID */}
                    <div id="mission" style={{
                        border: '1px solid #e2e8f0',
                        padding: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'white url([IconoMisionManosTierra]) no-repeat right 20px top 20px/60px'
                    }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '20px', fontSize: '2rem', fontFamily: 'var(--font-titles)' }}>Nuestra Misión</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)' }}>
                            Conectar eficientemente el campo con el mercado mediante tecnología innovadora, garantizando transparencia, trazabilidad y comercio justo. Buscamos empoderar al agricultor asegurando su venta desde la siembra.
                        </p>
                    </div>

                    {/* Visión ID */}
                    <div id="vision" style={{
                        border: '1px solid #e2e8f0',
                        padding: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'white url([IconoVisionOjoCampo]) no-repeat right 20px top 20px/60px'
                    }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '20px', fontSize: '2rem', fontFamily: 'var(--font-titles)' }}>Nuestra Visión</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text)' }}>
                            Ser la plataforma líder en Latinoamérica en la digitalización del comercio de "futuros agrícolas", revolucionando la cadena de suministro global y garantizando la seguridad alimentaria.
                        </p>
                    </div>

                </div>
            </section>

            {/* 4. CTA FINAL */}
            <footer style={{
                textAlign: 'center',
                padding: '80px 20px',
                backgroundColor: 'var(--color-text)',
                color: 'white',
                borderTop: '5px solid var(--color-secondary)'
            }}>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '20px', fontFamily: 'var(--font-titles)' }}>¿Listo para Transformar el Agro Comercio?</h3>
                <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>Regístrate hoy mismo y elige tu perfil durante el proceso.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        border: '2px solid white'
                    }}>
                        Iniciar Sesión
                    </button>
                    <button style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        border: '2px solid var(--color-secondary)'
                    }}>
                        Registrarse
                    </button>
                </div>
            </footer>

        </div>
    );
}

export default PublicHome;