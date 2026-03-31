import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock } from 'lucide-react';

export function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      navigate('/order-success');
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl mb-6">Información de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Apellido</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Dirección</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Ciudad</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Código Postal</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Teléfono</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl mb-6 flex items-center gap-2">
                <CreditCard size={24} />
                Información de Pago
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Número de Tarjeta</label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Vencimiento</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                  <Lock size={16} />
                  <span>Tus datos están protegidos y encriptados</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-100 p-6 sticky top-24">
            <h2 className="text-xl mb-6">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-white"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                    <p className="text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (21%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
