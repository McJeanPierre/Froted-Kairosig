import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import './HomePage.css';
import Locacion from './Locacion';
import PricingSection from './PricingSection';  
import Footer from './footer';
import Agenda from './Agenda';

const HomePage = () => {
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
                        <p>El uso de la inteligencia artificial está cambiando la forma en que se producen, gestionan y consumen los alimentos. Este congreso abordará temas clave como la optimización de procesos productivos, el control de calidad automatizado, la sostenibilidad en la cadena alimentaria y las innovaciones en la trazabilidad de productos, donde la IA juega un papel fundamental.</p>
                        <a href="#mas-info" className="btndescubre">DESCUBRE</a>
                    </div>
                    <img src="/cubo.png" alt="cubo" className="img-cubo" />
                </div>
            </section>

            <section className="formulario">
                <div className="container-formulario">
                    <div className="content-formulario">
                        <h1>¿QUIERES SABER MÁS?</h1>
                        <p>Escríbenos para coordinar una reunión y contarte más de este increíble Congreso.</p>
                        <form>
                            <input type="text" placeholder="Nombre Completo*" className="input" />
                            <input type="email" placeholder="Correo electrónico*" className="input" />
                            <input type="text" placeholder="Celular*" className="input" />
                            <button type="submit" className="btn">ENVIAR</button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="sponsor">
                <h2 className="sponsor-title">Empresas que confían en nosotros</h2>
                <div className="container-sponsor">
                    <div className="publicidad">
                        <img src="/carpefresh.png" alt="Sponsor 1" className="sponsor-img" />
                        <img src="/mariscos-flipper.png" alt="Sponsor 2" className="sponsor-img" />
                        <img src="/SPORTMANCAR.png" alt="Sponsor 3" className="sponsor-img" />
                        <img src="/israel.png" alt="Sponsor 4" className="sponsor-img" />
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
}

export default HomePage;
