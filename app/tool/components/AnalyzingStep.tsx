export default function AnalyzingStep() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-dark-slate mb-2">Analyzing duplicates</h2>
      <p className="text-muted-gray">
        We&apos;re processing your invoice data to identify potential duplicates. This may take a moment...
      </p>
    </div>
  );
}