import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te responderemos pronto.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl mb-6">Contáctanos</h1>
        <p className="text-xl text-gray-600">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8">
            <h2 className="text-2xl mb-6">Envíanos un Mensaje</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Teléfono</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Asunto</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Mensaje</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-gray-100 p-6">
            <h3 className="text-xl mb-6">Información de Contacto</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-3">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-sm">info@store.com</p>
                  <p className="text-sm">soporte@store.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-3">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="text-sm">+34 900 123 456</p>
                  <p className="text-sm">+34 900 123 457</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-3">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dirección</p>
                  <p className="text-sm">Calle Principal 123</p>
                  <p className="text-sm">28001 Madrid, España</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-3">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Horario</p>
                  <p className="text-sm">Lun - Vie: 9:00 - 20:00</p>
                  <p className="text-sm">Sáb - Dom: 10:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-6">
            <h3 className="text-lg mb-4">¿Necesitas Ayuda Rápida?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Consulta nuestra sección de preguntas frecuentes o chatea con nosotros en tiempo real.
            </p>
            <button className="w-full bg-white text-black py-3 px-6 hover:bg-gray-200 transition-colors">
              Chat en Vivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
