export default function Solution() {
  const steps = [
    "Upload your invoice data",
    "DupeHQ flags suspicious matches",
    "Review likely duplicates before payment"
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark-slate mb-6">
          A simple pre-payment check for duplicate invoice risk.
        </h2>
        <p className="text-lg text-muted-gray mb-12">
          Upload invoice data from your accounting workflow, let DupeHQ scan for suspicious matches, and review flagged pairs before payments go out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-accent-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <p className="text-dark-slate font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}