'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import type { Cluster, ReviewedRow, Row } from '../page';

interface ReviewStepProps {
  clusters: Cluster[];
  reviewedRows: ReviewedRow[];
  originalRows: Row[];
  mapping: { vendorName: string; invoiceId: string; amount: string; invoiceDate: string };
  onReviewCluster: (clusterId: string, decision: 'keep' | 'keep-all' | 'skip', keepRowId?: number) => void;
  onBackToSummary: () => void;
}

export default function ReviewStep({
  clusters,
  reviewedRows,
  originalRows,
  mapping,
  onReviewCluster,
  onBackToSummary
}: ReviewStepProps) {
  const [reviewingCluster, setReviewingCluster] = useState<Cluster | null>(null);
  const [selectedKeepRow, setSelectedKeepRow] = useState<number | null>(null);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);

  const handleReview = (cluster: Cluster) => {
    setReviewingCluster(cluster);
    setSelectedKeepRow(cluster.selectedKeepRowId || null);
  };

  const handleDecision = (decision: 'keep' | 'keep-all' | 'skip') => {
    if (!reviewingCluster) return;
    onReviewCluster(reviewingCluster.id, decision, selectedKeepRow || undefined);
    setReviewingCluster(null);
    setSelectedKeepRow(null);
  };

  const downloadDedupedCSV = () => {
    // Check if any changes have been made
    const hasChanges = clusters.some(c => c.status !== 'unreviewed');
    
    if (!hasChanges) {
      setShowDownloadWarning(true);
      return;
    }
    
    performDedupedDownload();
  };

  const performDedupedDownload = () => {
    const keptRows = reviewedRows.filter(r => !r.removed).map(r => originalRows[r.index]);
    const csv = Papa.unparse(keptRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deduped_invoices.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAuditReport = () => {
    const auditRows = reviewedRows.map((r) => {
      const original = originalRows[r.index];
      return {
        ...original,
        dupehq_cluster_id: r.clusterId || '',
        dupehq_confidence: clusters.find(c => c.id === r.clusterId)?.confidence || '',
        dupehq_reasons: clusters.find(c => c.id === r.clusterId)?.reasons.join('; ') || '',
        dupehq_status: r.reviewStatus,
      };
    });
    const csv = Papa.unparse(auditRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-dark-slate mb-2">Review duplicate clusters</h2>
          <p className="text-muted-gray">
            Select which row to keep, keep all, or skip clusters. Export results at any time.
          </p>
        </div>
        <button
          onClick={onBackToSummary}
          className="text-accent-blue hover:text-blue-700 text-sm font-medium"
        >
          ← Back to summary
        </button>
      </div>

      {/* Audit Table */}
      <div>
        <h3 className="text-lg font-medium text-dark-slate mb-4">Audit table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-light-gray rounded-md">
            <thead className="bg-light-gray">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Cluster ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Representative Vendor</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Size</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Confidence</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Reasons</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">Action</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map(cluster => {
                const repRow = reviewedRows.find(r => r.index === cluster.rowIds[0]);
                const repVendor = repRow?.normalizedVendorName || '';
                return (
                  <tr key={cluster.id} className="border-b border-light-gray hover:bg-light-gray">
                    <td className="px-4 py-2 text-sm text-dark-slate">{cluster.id}</td>
                    <td className="px-4 py-2 text-sm text-muted-gray">{repVendor}</td>
                    <td className="px-4 py-2 text-sm text-muted-gray">{cluster.rowIds.length}</td>
                    <td className="px-4 py-2 text-sm text-muted-gray">{Math.round(cluster.confidence)}%</td>
                    <td className="px-4 py-2 text-sm text-muted-gray">{cluster.reasons.join(', ')}</td>
                    <td className="px-4 py-2 text-sm text-muted-gray capitalize">{cluster.status.replace('-', ' ')}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => handleReview(cluster)}
                        className="text-accent-blue hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export */}
      <div>
        <h3 className="text-lg font-medium text-dark-slate mb-4">Export results</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-gray mb-2">
              Download a cleaned CSV with duplicates removed.
            </p>
            <button
              onClick={downloadDedupedCSV}
              className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Download Deduped CSV
            </button>
          </div>
          <div>
            <p className="text-sm text-muted-gray mb-2">
              Download a full audit report with DupeHQ annotations.
            </p>
            <button
              onClick={downloadAuditReport}
              className="border border-light-gray text-dark-slate px-4 py-2 rounded-md hover:bg-light-gray font-medium"
            >
              Download Audit Report
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingCluster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-dark-slate">Cluster {reviewingCluster.id}</h3>
              <button
                onClick={() => setReviewingCluster(null)}
                className="text-muted-gray hover:text-dark-slate"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-gray">Confidence: {Math.round(reviewingCluster.confidence)}%</p>
              <p className="text-sm text-muted-gray">Reasons: {reviewingCluster.reasons.join(', ')}</p>
            </div>
            <div className="space-y-4">
              {reviewingCluster.rowIds.map(rowId => {
                const row = reviewedRows.find(r => r.index === rowId)!;
                const original = originalRows[rowId];
                return (
                  <div key={rowId} className="border border-light-gray rounded-md p-4">
                    <div className="text-xs text-muted-gray mb-2">Status: {row.reviewStatus}</div>
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="keep"
                        checked={selectedKeepRow === rowId}
                        onChange={() => setSelectedKeepRow(rowId)}
                        className="mr-2"
                      />
                      <span className="font-medium text-dark-slate">Row {rowId + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Vendor:</span> {original[mapping.vendorName]}
                      </div>
                      <div>
                        <span className="font-medium">Invoice ID:</span> {original[mapping.invoiceId]}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> {original[mapping.amount]}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {original[mapping.invoiceDate]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => handleDecision('skip')}
                className="border border-light-gray text-dark-slate px-4 py-2 rounded-md hover:bg-light-gray"
              >
                Skip
              </button>
              <button
                onClick={() => handleDecision('keep-all')}
                className="border border-light-gray text-dark-slate px-4 py-2 rounded-md hover:bg-light-gray"
              >
                Keep All
              </button>
              <button
                onClick={() => handleDecision('keep')}
                disabled={selectedKeepRow === null}
                className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Warning Modal */}
      {showDownloadWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-dark-slate mb-3">Download without changes?</h3>
            <p className="text-muted-gray mb-6">
              You haven&apos;t made any changes to your data yet. The exported file will be identical to your original upload.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDownloadWarning(false)}
                className="border border-light-gray text-dark-slate px-4 py-2 rounded-md hover:bg-light-gray"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDownloadWarning(false);
                  performDedupedDownload();
                }}
                className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}