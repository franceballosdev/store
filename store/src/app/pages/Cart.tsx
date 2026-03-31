import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-background min-h-screen">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-grey-olive-300 dark:text-grey-olive-700 mb-4" />
          <h2 className="text-3xl mb-4 text-foreground">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">
            Agrega algunos productos para comenzar tu compra
          </p>
          <Link
            to="/shop"
            className="inline-block bg-grey-olive-700 text-white px-8 py-4 hover:bg-grey-olive-800 transition-colors"
          >
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      <h1 className="text-4xl mb-8 text-foreground">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-card border border-border p-4"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover bg-grey-olive-50 dark:bg-grey-olive-950"
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-grey-olive-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-grey-olive-500 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:border-grey-olive-500 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-lg text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border p-6 sticky top-24">
            <h2 className="text-xl mb-6 text-foreground">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">{getCartTotal() > 100 ? 'Gratis' : '$10.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (21%)</span>
                <span className="text-foreground">${(getCartTotal() * 0.21).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-foreground font-medium">Total</span>
                  <span className="text-foreground font-medium">
                    $
                    {(
                      getCartTotal() +
                      (getCartTotal() > 100 ? 0 : 10) +
                      getCartTotal() * 0.21
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-grey-olive-700 text-white text-center py-4 px-6 hover:bg-grey-olive-800 transition-colors mb-4"
            >
              Proceder al Pago
            </Link>

            <Link
              to="/shop"
              className="block w-full text-center py-4 px-6 border border-border text-foreground hover:border-grey-olive-500 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
