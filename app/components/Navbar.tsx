import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-light-gray px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-deep-navy">
          DupeHQ
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-muted-gray hover:text-dark-slate transition-colors">
            How it works
          </a>
          <a href="#why-dupehq" className="text-muted-gray hover:text-dark-slate transition-colors">
            Why DupeHQ
          </a>
          <a href="#faq" className="text-muted-gray hover:text-dark-slate transition-colors">
            FAQ
          </a>
          <Link href="/tool" className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Try free audit
          </Link>
        </div>
        <div className="md:hidden">
          <Link href="/tool" className="bg-accent-blue text-white px-4 py-2 rounded-md font-medium">
            Try free audit
          </Link>
        </div>
      </div>
    </nav>
  );
}