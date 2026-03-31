import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';

export function OrderSuccess() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <CheckCircle size={80} className="mx-auto text-green-600 mb-6" />
        <h1 className="text-4xl mb-4">¡Pedido Confirmado!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gracias por tu compra. Hemos recibido tu pedido y te enviaremos un email de confirmación con los detalles.
        </p>

        <div className="bg-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
              <p className="text-lg">#{Math.floor(Math.random() * 1000000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha</p>
              <p className="text-lg">30 de Marzo, 2026</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Entrega Estimada</p>
              <p className="text-lg">5-7 días hábiles</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors"
          >
            Continuar Comprando
          </Link>
          <Link
            to="/"
            className="border border-gray-300 px-8 py-4 hover:border-black transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
