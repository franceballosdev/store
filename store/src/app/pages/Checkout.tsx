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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      <h1 className="text-4xl mb-8 text-foreground">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-card border border-border p-6">
              <h2 className="text-xl mb-6 text-foreground">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-card border border-border p-6">
              <h2 className="text-xl mb-6 text-foreground">Información de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Apellido</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-muted-foreground">Dirección</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Ciudad</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Código Postal</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-muted-foreground">Teléfono</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card border border-border p-6">
              <h2 className="text-xl mb-6 flex items-center gap-2 text-foreground">
                <CreditCard size={24} className="text-grey-olive-600 dark:text-grey-olive-400" />
                Información de Pago
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Número de Tarjeta</label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Vencimiento</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      className="w-full px-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Lock size={16} />
                  <span>Tus datos están protegidos y encriptados</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-grey-olive-700 text-white py-4 px-6 hover:bg-grey-olive-800 transition-colors disabled:bg-grey-olive-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border p-6 sticky top-24">
            <h2 className="text-xl mb-6 text-foreground">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-background"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    <p className="text-sm mt-1 text-grey-olive-600 dark:text-grey-olive-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (21%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg">
                  <span className="text-foreground font-medium">Total</span>
                  <span className="text-foreground font-medium">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
