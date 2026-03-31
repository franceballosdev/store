import { Award, Users, Heart, Sparkles } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl mb-6">Sobre Nosotros</h1>
        <p className="text-xl text-gray-600">
          Somos una tienda dedicada a ofrecer productos de la más alta calidad, combinando innovación, estilo y funcionalidad.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <div className="text-center">
          <div className="bg-black text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-lg mb-2">Calidad Premium</h3>
          <p className="text-sm text-gray-600">
            Seleccionamos cuidadosamente cada producto para garantizar la máxima calidad.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-black text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg mb-2">Clientes Satisfechos</h3>
          <p className="text-sm text-gray-600">
            Miles de clientes confían en nosotros para sus compras.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-black text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h3 className="text-lg mb-2">Atención Personalizada</h3>
          <p className="text-sm text-gray-600">
            Nos preocupamos por cada cliente y ofrecemos soporte dedicado.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-black text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg mb-2">Innovación Constante</h3>
          <p className="text-sm text-gray-600">
            Siempre buscamos las últimas tendencias y tecnologías.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-gray-100 p-12 mb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl mb-6">Nuestra Historia</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              STORE nació en 2020 con una visión clara: hacer que los productos premium sean accesibles para todos. Comenzamos como una pequeña tienda online y hemos crecido hasta convertirnos en un referente en el mercado.
            </p>
            <p>
              Nuestra misión es simple pero poderosa: ofrecer productos excepcionales que mejoren la vida de nuestros clientes. Cada artículo en nuestra colección ha sido cuidadosamente seleccionado por su calidad, diseño y funcionalidad.
            </p>
            <p>
              Hoy, atendemos a clientes en todo el país y seguimos comprometidos con nuestros valores fundamentales de calidad, innovación y servicio al cliente excepcional.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-5xl mb-2">10,000+</p>
          <p className="text-sm text-gray-600">Clientes Satisfechos</p>
        </div>
        <div>
          <p className="text-5xl mb-2">500+</p>
          <p className="text-sm text-gray-600">Productos Disponibles</p>
        </div>
        <div>
          <p className="text-5xl mb-2">4.9</p>
          <p className="text-sm text-gray-600">Calificación Promedio</p>
        </div>
      </div>
    </div>
  );
}
