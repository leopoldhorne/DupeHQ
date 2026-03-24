'use client';

import { useState } from 'react';
import type { Row, Mapping } from '../page';

interface MappingStepProps {
  originalRows: Row[];
  mapping: Mapping;
  onMapping: (mapping: Mapping) => void;
  onBack: () => void;
}

export default function MappingStep({ originalRows, mapping, onMapping, onBack }: MappingStepProps) {
  const columns = originalRows.length > 0 ? Object.keys(originalRows[0]) : [];

  const [localMapping, setLocalMapping] = useState<Mapping>(() => {
    const suggested: Partial<Mapping> = {};
    columns.forEach(col => {
      const lower = col.toLowerCase();
      if (lower.includes('vendor') && lower.includes('name')) suggested.vendorName = col;
      if (lower.includes('invoice') && lower.includes('id')) suggested.invoiceId = col;
      if (lower.includes('amount')) suggested.amount = col;
      if (lower.includes('date') && lower.includes('invoice')) suggested.invoiceDate = col;
    });
    return { ...mapping, ...suggested };
  });

  const handleSubmit = () => {
    if (!localMapping.vendorName || !localMapping.invoiceId || !localMapping.amount || !localMapping.invoiceDate) {
      alert('Please map all required fields.');
      return;
    }
    onMapping(localMapping);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-slate mb-2">Map your fields</h2>
        <p className="text-muted-gray">
          Select the columns from your CSV that correspond to the required fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark-slate mb-2">Vendor Name</label>
          <select
            value={localMapping.vendorName}
            onChange={(e) => setLocalMapping(prev => ({ ...prev, vendorName: e.target.value }))}
            className="w-full border border-light-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select column</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-slate mb-2">Invoice ID</label>
          <select
            value={localMapping.invoiceId}
            onChange={(e) => setLocalMapping(prev => ({ ...prev, invoiceId: e.target.value }))}
            className="w-full border border-light-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select column</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-slate mb-2">Amount</label>
          <select
            value={localMapping.amount}
            onChange={(e) => setLocalMapping(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full border border-light-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select column</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-slate mb-2">Invoice Date</label>
          <select
            value={localMapping.invoiceDate}
            onChange={(e) => setLocalMapping(prev => ({ ...prev, invoiceDate: e.target.value }))}
            className="w-full border border-light-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select column</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
      </div>

      {originalRows.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-dark-slate mb-4">Preview of your data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-light-gray rounded-md">
              <thead className="bg-light-gray">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-4 py-2 text-left text-sm font-medium text-dark-slate border-b border-light-gray">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {originalRows.slice(0, 3).map((row, index) => (
                  <tr key={index} className="border-b border-light-gray">
                    {columns.map(col => (
                      <td key={col} className="px-4 py-2 text-sm text-muted-gray">
                        {row[col] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="border border-light-gray text-dark-slate px-6 py-2 rounded-md hover:bg-light-gray font-medium"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-accent-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Analyze duplicates
        </button>
      </div>
    </div>
  );
}