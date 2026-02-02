export default function Services() {
  const services = [
    {
      icon: '🩺',
      title: 'General Checkups',
      description: 'Regular health examinations to keep your pet in optimal condition',
    },
    {
      icon: '💉',
      title: 'Vaccinations',
      description: 'Essential vaccinations to protect your pet from diseases',
    },
    {
      icon: '🏨',
      title: 'Pet Hotel',
      description: 'Safe and comfortable boarding for your pets while you\'re away',
    },
    {
      icon: '🐕',
      title: 'Surgery',
      description: 'Skilled surgical procedures with modern equipment',
    },
    {
      icon: '📋',
      title: 'Emergency Care',
      description: '24/7 emergency veterinary services for urgent situations',
    },
    {
      icon: '💊',
      title: 'Pet Pharmacy',
      description: 'Complete range of medications and healthcare products',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">
            Comprehensive veterinary care for your beloved pets
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
