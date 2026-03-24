export default function ProductMockup() {
  return (
    <div className="flex justify-center w-full">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-dark-slate">Cluster DQ-001</h2>
          <button className="text-slate-400 hover:text-dark-slate text-2xl font-light">×</button>
        </div>

        {/* Confidence & Reasons */}
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
          <p className="text-base mb-3">
            <span className="font-semibold text-dark-slate">Confidence:</span>{" "}
            <span className="text-lg text-accent-blue font-bold">95%</span>
          </p>
          <p className="text-sm text-muted-gray leading-relaxed">
            <span className="font-semibold text-dark-slate">Reasons:</span>{" "}
            <span className="text-accent-blue">Matching invoice ID</span>,{" "}
            <span className="text-accent-blue">Matching vendor name</span>,{" "}
            <span className="text-accent-blue">Matching amount</span>,{" "}
            <span className="text-accent-blue">Close invoice date</span>
          </p>
        </div>

        {/* Invoice List */}
        <div className="divide-y divide-slate-200">
          {/* Row 1 */}
          <div className="px-8 py-6 hover:bg-blue-50 transition">
            <div className="flex items-start gap-4">
              <input type="radio" name="selection" className="mt-1 cursor-pointer" />
              <div className="flex-1">
                <p className="font-bold text-dark-slate text-base mb-3">Row 1</p>
                <div className="text-sm text-dark-slate space-y-1.5 grid grid-cols-2 gap-x-6">
                  <p><span className="text-muted-gray">Status:</span> <span className="text-muted-gray">pending</span></p>
                  <p><span className="text-muted-gray">Vendor:</span> <span className="text-accent-blue font-medium">Stripe Inc</span></p>
                  <p><span className="text-muted-gray">Invoice ID:</span> <span className="font-medium">INV-1001</span></p>
                  <p><span className="text-muted-gray">Amount:</span> <span className="font-medium">500</span></p>
                  <p><span className="text-muted-gray">Date:</span> <span className="text-accent-blue font-medium">1/10/2024</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="px-8 py-6 hover:bg-blue-50 transition">
            <div className="flex items-start gap-4">
              <input type="radio" name="selection" className="mt-1 cursor-pointer" />
              <div className="flex-1">
                <p className="font-bold text-dark-slate text-base mb-3">Row 2</p>
                <div className="text-sm text-dark-slate space-y-1.5 grid grid-cols-2 gap-x-6">
                  <p><span className="text-muted-gray">Status:</span> <span className="text-muted-gray">pending</span></p>
                  <p><span className="text-muted-gray">Vendor:</span> <span className="text-accent-blue font-medium">Stripe</span></p>
                  <p><span className="text-muted-gray">Invoice ID:</span> <span className="font-medium">INV1001</span></p>
                  <p><span className="text-muted-gray">Amount:</span> <span className="font-medium">500</span></p>
                  <p><span className="text-muted-gray">Date:</span> <span className="text-accent-blue font-medium">1/10/2024</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-slate-200 bg-slate-50">
          <button className="px-5 py-2.5 text-sm font-medium text-dark-slate border border-slate-300 rounded-lg hover:bg-white transition">
            Skip
          </button>
          <button className="px-5 py-2.5 text-sm font-medium text-dark-slate border border-slate-300 rounded-lg hover:bg-white transition">
            Keep All
          </button>
          <button className="px-7 py-2.5 text-sm font-medium text-white bg-accent-blue rounded-lg hover:bg-blue-700 transition">
            Keep Selected
          </button>
        </div>
      </div>
    </div>
  );
}