import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import Navbar from './Navbar';
import Locacion from './Locacion';
import PricingSection from './PricingSection';
import Footer from './Footer';
import Agenda from './Agenda';
import './HomePage.css';

const HomePage = () => {
    const form = useRef();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        celular: ''
    });

    // Cargar variables de entorno
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const sendEmail = (e) => {
        e.preventDefault();
    
        // Validación de campos vacíos
        if (!formData.nombre || !formData.email || !formData.celular) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor, completa todos los campos antes de enviar.",
            });
            return;
        }
    
        // Validación de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Swal.fire({
                icon: "error",
                title: "Correo no válido",
                text: "Por favor, ingresa un correo electrónico válido.",
            });
            return;
        }
    
        // Envío del correo
        const templateParams = {
            name: formData.nombre,
            to_email: formData.email,
            celular: formData.celular,
        };

        console.log("Template Params:", templateParams);
        emailjs
            .send(serviceId, templateId, templateParams, publicKey)
            .then((result) => {
                console.log('Correo enviado exitosamente:', result.text);
                Swal.fire({
                    title: "¡Correo Enviado!",
                    text: `El correo fue enviado exitosamente`,
                    icon: "success",
                });
    
                // Limpia el formulario
                setFormData({
                    nombre: '',
                    email: '',
                    celular: ''
                });
            })
            .catch((error) => {
                console.error('Error al enviar el correo:', error.text);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al enviar el correo. Por favor, intenta nuevamente.",
                });
            });
    };

    return (
        <div>
            <section className="part1">
                <div className="container">
                    <div className="content">
                        <div className="country">
                            <h1>Ecuador</h1>
                            <img src="/ecuador.png" alt="ecuador-img" className="img-country" />
                        </div>
                        <h1>INTELIGENCIA ARTIFICIAL (IA) EN LA INDUSTRIA ALIMENTARIA</h1>
                        <p>Descubre cómo la Inteligencia Artificial está revolucionando la industria alimentaria: optimización de procesos, reducción de desperdicios y personalización de productos. Únete al I Congreso Internacional en Ecuador y sé parte de la transformación hacia un futuro innovador y sostenible. ¡No te lo pierdas!</p>
                        <a href="https://hotmart.com/es/marketplace/productos/congreso-internacional-integracion-de-la-inteligencia-artificial-ia-en-la-industria-alimentaria-innovacion-transformacion-y-futuro/P96599423R" className="btndescubre">DESCUBRE</a>
                    </div>
                    <img src="/cubo.png" alt="cubo" className="img-cubo" />
                </div>
            </section>

            <section className="formulario">
                <div className="container-formulario">
                    <div className="content-formulario">
                        <h1>¿QUIERES SABER MÁS?</h1>
                        <p>Escríbenos para coordinar una reunión y contarte más de este increíble Congreso.</p>
                        <form ref={form} onSubmit={sendEmail}>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre Completo*"
                                className="input"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo electrónico*"
                                className="input"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="celular"
                                placeholder="Celular*"
                                className="input"
                                value={formData.celular}
                                onChange={handleChange}
                            />
                            <button type="submit" className="btn">ENVIAR</button>
                        </form>
                    </div>
                </div>
            </section>

            <Locacion />
            <Agenda />
            <section id="pricing-section">
                <PricingSection />
            </section>
            <section id="contact">
            <Footer />
            </section>
        </div>
    );
};

export default HomePage;