export default function Trust() {
  const assurances = [
    {
      title: "Secure file handling",
      icon: "🔒"
    },
    {
      title: "Clear, explainable flags",
      icon: "✓"
    },
    {
      title: "Fast review process",
      icon: "⚡"
    },
    {
      title: "No bloated setup",
      icon: "✨"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white border-b border-light-gray">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-slate text-center mb-16">
          Built for trust and simplicity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assurances.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-light-gray hover:shadow-md transition">
              <div className="text-3xl mb-3 text-center">{item.icon}</div>
              <p className="text-sm font-semibold text-dark-slate text-center">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}