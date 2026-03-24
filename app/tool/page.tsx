'use client';

import { useCallback, useEffect, useState } from 'react';
import { ratio } from 'fuzzball';
import ToolNavbar from './components/ToolNavbar';
import { MAX_ROWS } from './csvLimit';
import UploadStep from './components/UploadStep';
import MappingStep from './components/MappingStep';
import AnalyzingStep from './components/AnalyzingStep';
import SummaryStep from './components/SummaryStep';
import ReviewStep from './components/ReviewStep';

export type Step = 'upload' | 'mapping' | 'analyzing' | 'summary' | 'review';

export interface Row {
  [key: string]: string;
}

export interface NormalizedRow {
  original: Row;
  normalizedInvoiceId: string;
  normalizedVendorName: string;
  normalizedCanonicalVendorName: string;
  normalizedAmount: number | null;
  normalizedDate: Date | null;
}

export interface Mapping {
  vendorName: string;
  invoiceId: string;
  amount: string;
  invoiceDate: string;
}

export interface Pair {
  rowA: number;
  rowB: number;
  confidence: number;
  reasons: string[];
  isApprovedEdge?: boolean;
}

export interface Cluster {
  id: string;
  rowIds: number[];
  confidence: number;
  reasons: string[];
  status: 'unreviewed' | 'skipped' | 'resolved-duplicate' | 'resolved-not-duplicate';
  selectedKeepRowId?: number;
}

export interface ReviewedRow extends NormalizedRow {
  index: number;
  clusterId?: string;
  removed: boolean;
  reviewStatus: 'kept' | 'duplicate_removed' | 'pending';
}

export default function ToolPage() {
  const [step, setStep] = useState<Step>('upload');
  const [originalRows, setOriginalRows] = useState<Row[]>([]);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [mapping, setMapping] = useState<Mapping>({
    vendorName: '',
    invoiceId: '',
    amount: '',
    invoiceDate: '',
  });
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [reviewedRows, setReviewedRows] = useState<ReviewedRow[]>([]);

  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const [pendingReload, setPendingReload] = useState(false);

  const isDirtySession =
    originalRows.length > 0 ||
    clusters.length > 0 ||
    reviewedRows.length > 0 ||
    step !== 'upload' ||
    Object.values(mapping).some(field => field.trim() !== '');

  const onBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (!isDirtySession) return;
    event.preventDefault();
    event.returnValue = 'Refreshing or leaving will clear your current analysis and progress.';
    return event.returnValue;
  }, [isDirtySession]);

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [onBeforeUnload]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isReloadKey =
        event.key === 'F5' ||
        ((event.key.toLowerCase() === 'r' || event.key === 'R') && (event.ctrlKey || event.metaKey));

      if (!isDirtySession || !isReloadKey) return;

      event.preventDefault();
      event.stopPropagation();
      setPendingReload(true);
      setShowReloadConfirm(true);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDirtySession]);

  const handleUpload = (rows: Row[]) => {
    if (rows.length > MAX_ROWS) {
      setLimitError(
        `This file has ${rows.length} rows, and DupeHQ currently supports up to ${MAX_ROWS} rows per analysis.`
      );
      setStep('upload');
      return;
    }
    setLimitError(null);
    setOriginalRows(rows);
    setStep('mapping');
  };

  const handleMapping = (newMapping: Mapping) => {
    setMapping(newMapping);

    if (originalRows.length > MAX_ROWS) {
      setLimitError(
        `This file has ${originalRows.length} rows, and DupeHQ currently supports up to ${MAX_ROWS} rows per analysis.`
      );
      setStep('upload');
      return;
    }

    setLimitError(null);
    setStep('analyzing');
    // Start analysis
    setTimeout(() => {
      try {
        const normalized = normalizeRows(originalRows, newMapping);
        const analysisClusters = analyzeDuplicates(normalized);
        setClusters(analysisClusters);
        // Initialize reviewed rows
        const initialReviewed: ReviewedRow[] = normalized.map((row, index) => ({
          ...row,
          index,
          clusterId: analysisClusters.find(c => c.rowIds.includes(index))?.id,
          removed: false,
          reviewStatus: 'pending',
        }));

        setReviewedRows(initialReviewed);
        setStep('summary');
      } catch {
        setLimitError('This file is too large. Please upload a file with fewer rows.');
        setStep('upload');
      }
    }, 1000); // Simulate processing time
  };

  const handleReviewCluster = (clusterId: string, decision: 'keep' | 'keep-all' | 'skip', keepRowId?: number) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        let status: Cluster['status'];
        if (decision === 'keep') {
          status = 'resolved-duplicate';
          c.selectedKeepRowId = keepRowId;
        } else if (decision === 'keep-all') {
          status = 'resolved-not-duplicate';
        } else {
          status = 'skipped';
        }
        return { ...c, status, selectedKeepRowId: keepRowId };
      }
      return c;
    }));
    // Update reviewed rows
    setReviewedRows(prev => prev.map((row) => {
      const cluster = clusters.find(c => c.id === clusterId);
      if (cluster && cluster.rowIds.includes(row.index)) {
        if (decision === 'keep') {
          row.reviewStatus = keepRowId === row.index ? 'kept' : 'duplicate_removed';
          row.removed = keepRowId !== row.index;
        } else if (decision === 'keep-all') {
          row.reviewStatus = 'kept';
          row.removed = false;
        } else {
          row.reviewStatus = 'pending';
          row.removed = false;
        }
      }
      return row;
    }));
  };

  const confirmReload = () => {
    if (pendingReload) {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.location.reload();
    }
    setShowReloadConfirm(false);
    setPendingReload(false);
  };

  const cancelReload = () => {
    setShowReloadConfirm(false);
    setPendingReload(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolNavbar />
      {showReloadConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Leave this analysis?</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Refreshing or leaving this page will clear your current file, analysis, and review progress. You’ll need to start again.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={cancelReload}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                onClick={confirmReload}
              >
                Refresh anyway
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-light-gray p-8">
          {limitError && (
            <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md">
              <p className="font-semibold text-red-700">This file is too large</p>
              <p className="text-sm text-red-700 mt-1">{limitError}</p>
            </div>
          )}
          {step === 'upload' && <UploadStep onUpload={handleUpload} />}
          {step === 'mapping' && (
            <MappingStep
              originalRows={originalRows}
              mapping={mapping}
              onMapping={handleMapping}
              onBack={() => setStep('upload')}
            />
          )}
          {step === 'analyzing' && <AnalyzingStep />}
          {step === 'summary' && (
            <SummaryStep
              clusters={clusters}
              originalRows={originalRows}
              onProceedToReview={() => setStep('review')}
            />
          )}
          {step === 'review' && (
            <ReviewStep
              clusters={clusters}
              reviewedRows={reviewedRows}
              originalRows={originalRows}
              mapping={mapping}
              onReviewCluster={handleReviewCluster}
              onBackToSummary={() => setStep('summary')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function normalizeRows(rows: Row[], mapping: Mapping): NormalizedRow[] {
  return rows.map(row => {
    const name = row[mapping.vendorName] || '';
    const normalizedVendorName = normalizeVendorName(name);
    return {
      original: row,
      normalizedInvoiceId: normalizeInvoiceId(row[mapping.invoiceId] || ''),
      normalizedVendorName,
      normalizedCanonicalVendorName: normalizeCanonicalVendorName(name),
      normalizedAmount: normalizeAmount(row[mapping.amount] || ''),
      normalizedDate: normalizeDate(row[mapping.invoiceDate] || ''),
    };
  });
}

function normalizeInvoiceId(id: string): string {
  return id.toLowerCase().trim().replace(/[\s\-_./]/g, '');
}

function normalizeVendorName(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\b(inc|llc|ltd|corp|co|company)\b/g, '')
    .trim();
}

function normalizeCanonicalVendorName(name: string): string {
  if (!name) return '';
  const canonical = name.toLowerCase().trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\b(inc|llc|ltd|corp|co|company|systems|technologies|technology|services|service|solutions|labs|lab|communications|corporation|holdings|group)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return canonical;
}

function normalizeAmount(amount: string): number | null {
  const cleaned = amount.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function normalizeDate(dateStr: string): Date | null {
  // Simple parsing, assume YYYY-MM-DD or MM/DD/YYYY
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function analyzeDuplicates(rows: NormalizedRow[]): Cluster[] {
  if (rows.length > MAX_ROWS) {
    throw new Error(`Row limit exceeded: ${rows.length} rows (max ${MAX_ROWS}).`);
  }

  // Phase A: Normalize done
  // Phase B: Candidate generation + approved edge creation
  const candidatePairs: Pair[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const reasons: string[] = [];
      let confidence = 0;

      const invoiceIdMatch = rows[i].normalizedInvoiceId !== '' && rows[i].normalizedInvoiceId === rows[j].normalizedInvoiceId;
      const canonicalVendorA = rows[i].normalizedCanonicalVendorName;
      const canonicalVendorB = rows[j].normalizedCanonicalVendorName;
      const vendorMatch = canonicalVendorA !== '' && canonicalVendorA === canonicalVendorB;
      const amountMatch = rows[i].normalizedAmount !== null && rows[i].normalizedAmount === rows[j].normalizedAmount;

      let closeDate = false;
      if (rows[i].normalizedDate && rows[j].normalizedDate) {
        const diff = Math.abs(rows[i].normalizedDate!.getTime() - rows[j].normalizedDate!.getTime());
        if (diff <= 7 * 24 * 60 * 60 * 1000) {
          closeDate = true;
        }
      }

      const fuzzyScore = ratio(rows[i].normalizedCanonicalVendorName, rows[j].normalizedCanonicalVendorName);
      const similarVendorName = !vendorMatch && fuzzyScore >= 80;

      if (invoiceIdMatch) {
        reasons.push('Matching invoice ID');
        confidence += 45;
      }
      if (vendorMatch) {
        reasons.push('Matching vendor name');
        confidence += 35;
      }
      if (amountMatch) {
        reasons.push('Matching amount');
        confidence += 15;
      }
      if (closeDate) {
        reasons.push('Close invoice date');
        confidence += 10;
      }
      if (similarVendorName) {
        reasons.push('Similar vendor name');
        confidence += Math.min(30, fuzzyScore / 100 * 30);
      }

      if (confidence <= 0) continue;

      const candidate: Pair = {
        rowA: i,
        rowB: j,
        confidence: Math.min(95, confidence),
        reasons,
        isApprovedEdge: false,
      };

      // Approved edge rules:
      // A. Matching invoice ID
      // B. Matching vendor name + matching amount
      // C. Matching vendor name + matching amount + close invoice date
      // D. Similar vendor name + matching amount + close invoice date
      const matchesApprovedEdge =
        invoiceIdMatch ||
        (vendorMatch && amountMatch) ||
        (similarVendorName && amountMatch && closeDate);

      if (matchesApprovedEdge) {
        candidate.isApprovedEdge = true;
      }

      candidatePairs.push(candidate);
    }
  }

  // Phase E: Cluster formation only using approved edges
  const approvedEdges = candidatePairs.filter(p => p.isApprovedEdge);
  const clusters = formClusters(approvedEdges, rows.length);

  const allClusters = clusters.map((rowIds, index) => {
    const clusterPairs = approvedEdges.filter(p => rowIds.includes(p.rowA) && rowIds.includes(p.rowB));
    const avgConfidence = clusterPairs.reduce((sum, p) => sum + p.confidence, 0) / clusterPairs.length;
    const allReasons = Array.from(new Set(clusterPairs.flatMap(p => p.reasons)));
    return {
      id: `DQ-${String(index + 1).padStart(3, '0')}`,
      rowIds,
      confidence: Math.min(95, avgConfidence || 0),
      reasons: allReasons,
      status: 'unreviewed' as const,
    };
  });

  return allClusters.filter(c => c.confidence >= 60);
}

function formClusters(pairs: Pair[], numRows: number): number[][] {
  const graph: number[][] = Array.from({ length: numRows }, () => []);
  pairs.forEach(p => {
    graph[p.rowA].push(p.rowB);
    graph[p.rowB].push(p.rowA);
  });
  const visited = new Set<number>();
  const clusters: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    if (!visited.has(i)) {
      const cluster = [];
      const stack = [i];
      while (stack.length) {
        const node = stack.pop()!;
        if (!visited.has(node)) {
          visited.add(node);
          cluster.push(node);
          stack.push(...graph[node]);
        }
      }
      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    }
  }
  return clusters;
}

