import Link from 'next/link';
import ProductMockup from './ProductMockup';

export default function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark-slate leading-tight">
            Stop duplicate payments before they turn into messy refunds.
          </h1>
          <p className="text-lg text-muted-gray leading-relaxed">
            Upload your invoices, review flagged duplicates, and prevent costly overpayments before money goes out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tool" className="bg-accent-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg text-center">
              Try free audit
            </Link>
            <Link href="#how-it-works" className="border border-light-gray text-dark-slate px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium text-lg text-center">
              See how it works
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}