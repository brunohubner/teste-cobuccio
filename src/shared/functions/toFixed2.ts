export function toFixed2(value: string | number): number {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') return Number(value.toFixed(2));

  const parsed = Number(Number(value).toFixed(2));

  if (Number.isNaN(parsed)) return null;

  return parsed;
}
