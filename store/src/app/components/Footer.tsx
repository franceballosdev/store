import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-grey-olive-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl mb-4 text-grey-olive-100">STORE</h3>
            <p className="text-grey-olive-300 text-sm">
              Tu destino para productos premium y de alta calidad. Innovación y estilo en cada producto.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm mb-4 text-grey-olive-100">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm mb-4 text-grey-olive-100">Servicio al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Envíos
                </a>
              </li>
              <li>
                <a href="#" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-grey-olive-300 hover:text-white text-sm transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm mb-4 text-grey-olive-100">Newsletter</h4>
            <p className="text-grey-olive-300 text-sm mb-4">
              Suscríbete para recibir ofertas exclusivas
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 bg-grey-olive-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-grey-olive-400 placeholder-grey-olive-400"
              />
              <button className="bg-grey-olive-600 text-white px-4 hover:bg-grey-olive-500 transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-grey-olive-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-grey-olive-300 text-sm">
            © 2026 STORE. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-grey-olive-300 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-grey-olive-300 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-grey-olive-300 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
