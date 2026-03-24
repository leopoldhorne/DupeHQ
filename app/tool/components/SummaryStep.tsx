'use client';

import type { Cluster, Row } from '../page';

interface SummaryStepProps {
  clusters: Cluster[];
  originalRows: Row[];
  onProceedToReview: () => void;
}

export default function SummaryStep({
  clusters,
  originalRows,
  onProceedToReview
}: SummaryStepProps) {
  const totalRows = originalRows.length;
  const duplicateClusters = clusters.length;
  const rowsInDuplicates = clusters.reduce((sum, c) => sum + c.rowIds.length, 0);
  const highConfidence = clusters.filter(c => c.confidence >= 80).length;
  const mediumConfidence = clusters.filter(c => c.confidence >= 60 && c.confidence < 80).length;

  // Detection breakdown: counts at cluster level
  const detectionCounts: { [key: string]: number } = {};
  clusters.forEach(cluster => {
    cluster.reasons.forEach(reason => {
      detectionCounts[reason] = (detectionCounts[reason] || 0) + 1;
    });
  });

  // Findings summary - more intelligent and tailored
  const hasExactInvoiceId = clusters.some(c => c.reasons.includes('Matching invoice ID'));
  const hasVendorDuplicates = clusters.some(c => c.reasons.includes('Matching vendor name') || c.reasons.includes('Similar vendor name'));
  const hasLargeClusters = clusters.some(c => c.rowIds.length > 2);
  const hasMediumConfidence = mediumConfidence > 0;
  
  const findingsSummaryParts = [];
  
  if (hasExactInvoiceId) {
    findingsSummaryParts.push("Exact invoice ID matches were the primary detection method");
  }
  
  if (hasVendorDuplicates) {
    findingsSummaryParts.push("Vendor-based duplicates were identified through name matching");
  }
  
  if (hasLargeClusters) {
    const largeCount = clusters.filter(c => c.rowIds.length > 2).length;
    findingsSummaryParts.push(`${largeCount} cluster${largeCount > 1 ? 's' : ''} contain${largeCount > 1 ? '' : 's'} more than two related invoices`);
  }
  
  if (hasMediumConfidence) {
    findingsSummaryParts.push(`${mediumConfidence} cluster${mediumConfidence > 1 ? 's are' : ' is'} medium confidence and may need closer review`);
  }
  
  // If no specific findings, provide a general summary
  if (findingsSummaryParts.length === 0) {
    findingsSummaryParts.push("No significant duplicate patterns detected in your invoice data");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dark-slate mb-2">Analysis complete</h2>
        <p className="text-lg text-muted-gray mb-2">
          DupeHQ identified {duplicateClusters} potential duplicate clusters across {rowsInDuplicates} invoices.
        </p>
        <p className="text-muted-gray">
          {highConfidence} {highConfidence === 1 ? 'is' : 'are'} high confidence and likely {highConfidence === 1 ? 'requires' : 'require'} action. {mediumConfidence > 0 ? `${mediumConfidence} ${mediumConfidence === 1 ? 'is' : 'are'} medium confidence and may need closer review.` : ''}
        </p>
      </div>

      {/* Summary Metrics */}
      <div>
        <h3 className="text-lg font-medium text-dark-slate mb-4">Summary metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-light-gray p-4 rounded-md">
            <div className="text-2xl font-bold text-dark-slate">{totalRows}</div>
            <div className="text-sm text-muted-gray">Total invoices analyzed</div>
          </div>
          <div className="bg-light-gray p-4 rounded-md">
            <div className="text-2xl font-bold text-dark-slate">{duplicateClusters}</div>
            <div className="text-sm text-muted-gray">Duplicate clusters found</div>
          </div>
          <div className="bg-light-gray p-4 rounded-md">
            <div className="text-2xl font-bold text-dark-slate">{rowsInDuplicates}</div>
            <div className="text-sm text-muted-gray">Rows involved in duplicates</div>
          </div>
          <div className="bg-light-gray p-4 rounded-md">
            <div className="text-2xl font-bold text-dark-slate">{highConfidence + mediumConfidence}</div>
            <div className="text-sm text-muted-gray">High + medium confidence clusters</div>
          </div>
        </div>
      </div>

      {/* Findings Summary */}
      <div>
        <h3 className="text-lg font-medium text-dark-slate mb-4">Findings summary</h3>
        <div className="bg-light-gray p-4 rounded-md">
          <p className="text-dark-slate">
            {findingsSummaryParts.join('. ') + (findingsSummaryParts.length > 1 ? '.' : '')}
          </p>
        </div>
      </div>

      {/* Detection Breakdown */}
      <div>
        <h3 className="text-lg font-medium text-dark-slate mb-4">Detection breakdown</h3>
        <div className="bg-light-gray p-4 rounded-md">
          <p className="text-sm text-muted-gray mb-2">Clusters detected by reason:</p>
          <div className="space-y-1">
            {Object.entries(detectionCounts).map(([reason, count]) => (
              <div key={reason} className="flex justify-between text-sm">
                <span>{count} clusters with {reason.toLowerCase()}</span>
                <span className="font-medium"></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onProceedToReview}
          className="bg-accent-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium text-lg"
        >
          Review duplicate clusters
        </button>
      </div>
    </div>
  );
}