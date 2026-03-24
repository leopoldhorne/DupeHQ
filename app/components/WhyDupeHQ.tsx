export default function WhyDupeHQ() {
  const reasons = [
    "Catch duplicates before payment",
    "Faster than manual spreadsheet checks",
    "Focused on one painful problem",
    "Lightweight and easy to run"
  ];

  return (
    <section id="why-dupehq" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark-slate mb-12">
          Why teams use DupeHQ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-light-gray text-center">
              <p className="text-dark-slate font-medium">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}