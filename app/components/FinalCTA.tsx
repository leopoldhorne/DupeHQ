import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark-slate mb-6">
          Run a free invoice audit with DupeHQ
        </h2>
        <p className="text-lg text-muted-gray mb-8">
          See which duplicate invoices your current workflow might be missing.
        </p>
        <Link href="/tool" className="bg-accent-blue text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg">
          Try free audit
        </Link>
      </div>
    </section>
  );
}