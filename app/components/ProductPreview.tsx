export default function ProductPreview() {
  const features = [
    {
      title: "Confidence scoring for suspicious matches",
      description: "Each flagged pair includes a confidence score based on multiple signals, helping you prioritize reviews."
    },
    {
      title: "Side-by-side invoice comparisons",
      description: "View potential duplicates alongside each other to quickly spot similarities and differences."
    },
    {
      title: "Clear reasons for every flagged result",
      description: "Understand exactly why an invoice pair was flagged. Examples include similar vendor names, matching amounts, close invoice dates, and invoice number variations."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark-slate mb-6">
          Built to show what looks wrong fast.
        </h2>
        <p className="text-lg text-muted-gray mb-12">
          DupeHQ highlights the signals that matter so finance teams can review suspicious duplicates quickly and confidently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-6 rounded-lg border border-light-gray">
              <h3 className="text-lg font-semibold text-dark-slate mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}