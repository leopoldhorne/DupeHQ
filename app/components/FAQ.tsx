export default function FAQ() {
  const faqs = [
    {
      question: "What kind of invoice data can I upload?",
      answer: "You can upload CSV files containing invoice details like vendor name, amount, date, and invoice number."
    },
    {
      question: "Does DupeHQ replace my accounting software?",
      answer: "No, DupeHQ is a lightweight layer that works alongside your existing accounting system to add duplicate detection before payments."
    },
    {
      question: "How does DupeHQ detect suspicious duplicates?",
      answer: "DupeHQ uses intelligent matching algorithms that go beyond exact matches, considering similarities in vendor names, amounts, dates, and other patterns."
    },
    {
      question: "Is DupeHQ built for small finance teams?",
      answer: "Yes, DupeHQ is designed for finance teams of all sizes, from startups to enterprises, who want a simple way to catch duplicate invoices."
    },
    {
      question: "Do I need an integration to use it?",
      answer: "No integration required. Simply upload your invoice data directly to DupeHQ for analysis."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-slate text-center mb-12">
          FAQ
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-light-gray pb-6">
              <h3 className="text-lg font-semibold text-dark-slate mb-2">
                {faq.question}
              </h3>
              <p className="text-muted-gray">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}