import { Facebook, Instagram, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-container">
        <p className="footer-follow-text">Síguenos:</p>
        <div className="footer-social-icons">
          <a href="https://www.facebook.com/kairosigformacionyproyectos" className="footer-icon facebook">
            <Facebook size={32} />
          </a>
          <a href="https://www.instagram.com/kairosig_formacion_y_proyectos/" className="footer-icon instagram">
            <Instagram size={32} />
          </a>
          <a href="https://hotmart.com/es/marketplace/productos/afiliados-club-del-dinero/S58081490W" className="footer-icon hotmart">
            <Flame size={32} />
          </a>
        </div>
        <div className="footer-logo">
          <img src="/LOGO.png" alt="Tu Logo" className="footer-custom-logo" />
        </div>
        <p className="footer-policy-text">
          Al utilizar nuestro sitio web, usted acepta los términos de esta Política de Datos. Si
          no está de acuerdo con estos términos, le recomendamos que no utilice nuestros
          servicios. Esta política está sujeta a cambios, por lo que le recomendamos que la
          revise periódicamente.
        </p>
      </div>
    </footer>
  );
}