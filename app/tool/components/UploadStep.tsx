'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import type { Row } from '../page';
import { MAX_ROWS, filterValidRows } from '../csvLimit';

interface UploadStepProps {
  onUpload: (rows: Row[]) => void;
}

export default function UploadStep({ onUpload }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [parsedRows, setParsedRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processParsedRows = (allRows: Row[]) => {
    const validRows = filterValidRows(allRows);
    const validCount = validRows.length;
    setParsedRows(validRows);
    setRowCount(validCount);

    if (validCount > MAX_ROWS) {
      const message =
        `This file has ${validCount} rows, and DupeHQ currently supports up to ${MAX_ROWS} rows per analysis.`;
      setError(
        `${message}\n\nTry uploading a smaller file to continue.\n\nNeed to analyze larger files? Coming soon.`
      );
      return { validRows, isTooLarge: true };
    }

    setError(null);
    return { validRows, isTooLarge: false };
  };

  const parseFile = (fileToParse: File, autoContinue = false) => {
    Papa.parse(fileToParse, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const fatalErrors = results.errors.filter((err) => {
          return err.code !== 'TooFewFields' && err.code !== 'TooManyFields';
        });

        if (fatalErrors.length > 0) {
          setError('Error parsing CSV: ' + fatalErrors[0].message);
          return;
        }

        const allRows = results.data as Row[];
        const { validRows, isTooLarge } = processParsedRows(allRows);

        if (isTooLarge) return;

        if (autoContinue) {
          onUpload(validRows);
        }
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
      },
    });
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setRowCount(0);
    setParsedRows([]);
    parseFile(selectedFile, false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleContinue = () => {
    if (!file) return;

    if (parsedRows.length > 0 && !error) {
      onUpload(parsedRows);
      return;
    }

    parseFile(file, true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-slate mb-2">Review duplicate invoices</h1>
        <p className="text-muted-gray">
          Upload invoice data, review suspicious duplicate clusters, and export a cleaned file.
        </p>
      </div>

      <div>
        <p className="text-muted-gray mb-4">
          Upload a CSV containing invoice data to begin duplicate analysis.
        </p>

        <div className="mb-2 text-sm text-muted-gray">
          Supports up to {MAX_ROWS} invoice rows per analysis
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-accent-blue bg-blue-50' : 'border-light-gray'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-lg font-medium text-dark-slate mb-2">
                Drop your CSV file here, or{' '}
                <label className="text-accent-blue hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileSelect(selectedFile);
                    }}
                  />
                </label>
              </p>
              <p className="text-sm text-muted-gray">Only CSV files are supported.</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-light-gray rounded-md space-y-2">
            <p className="font-medium text-dark-slate">Selected file: {file.name}</p>
            <p className="text-sm text-muted-gray">Rows: {rowCount > 0 ? rowCount : 'pending count'}</p>

            <button
              className="text-sm text-accent-blue hover:underline"
              onClick={() => {
                setFile(null);
                setError(null);
                setRowCount(0);
                setParsedRows([]);
              }}
            >
              Remove file
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="font-semibold text-red-700">This file is too large</p>
            <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!file}
          className="bg-accent-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}