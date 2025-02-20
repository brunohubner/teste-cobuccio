export function currency(number: number): string {
  return Number(number).toLocaleString('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  });
}
