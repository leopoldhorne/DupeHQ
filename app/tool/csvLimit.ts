export const MAX_ROWS = 100;

export interface UnknownRow {
  [key: string]: unknown;
}

// A valid row has at least one non-empty cell after trimming.
// Header row is not counted in this row set (as parsed with header: true).
export function isValidRow(row: UnknownRow): boolean {
  return Object.values(row).some((cell) => {
    if (cell === null || cell === undefined) return false;
    const asString = String(cell).trim();
    return asString !== '';
  });
}

export function getValidRowCount(rows: UnknownRow[]): number {
  return rows.filter(isValidRow).length;
}

export function filterValidRows<T extends UnknownRow>(rows: T[]): T[] {
  return rows.filter(isValidRow);
}
