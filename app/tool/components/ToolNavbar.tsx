import Link from 'next/link';

export default function ToolNavbar() {
  return (
    <nav className="bg-white border-b border-light-gray px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-deep-navy">
          DupeHQ
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-muted-gray hover:text-dark-slate transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </nav>
  );
}