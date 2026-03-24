export default function Problem() {
  const pains = [
    {
      title: "Exact-match systems miss near duplicates",
      description: "Most accounting software only catches identical invoices. Real duplicates often have slight variations in vendor names, invoice numbers, or dates."
    },
    {
      title: "Manual review is slow and error-prone",
      description: "Teams rely on spreadsheets and manual checks, which are time-consuming and prone to human error when processing hundreds of invoices."
    },
    {
      title: "Reconciliation catches issues too late",
      description: "By the time duplicates are found during reconciliation, the money has already been paid out, leading to costly recovery processes."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark-slate mb-12">
          Duplicate invoices are easy to miss.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pains.map((pain, index) => (
            <div key={index} className="bg-background p-6 rounded-lg border border-light-gray">
              <h3 className="text-lg font-semibold text-dark-slate mb-3">
                {pain.title}
              </h3>
              <p className="text-muted-gray">
                {pain.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}