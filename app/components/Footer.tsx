export default function Footer() {
  return (
    <footer className="bg-deep-navy text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-2xl font-bold mb-4 md:mb-0">
          DupeHQ
        </div>
        {/* <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-light-gray transition-colors">Privacy</a>
          <a href="#" className="hover:text-light-gray transition-colors">Terms</a>
          <a href="#" className="hover:text-light-gray transition-colors">Contact</a>
        </div> */}
        <div className="text-sm text-muted-gray mt-4 md:mt-0">
          © 2026 DupeHQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}