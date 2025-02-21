/* eslint-disable no-param-reassign */

export function isValidCPF(cpf: string): boolean {
  cpf = `${cpf}`.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const splitCpf = cpf.split('').map((el) => +el);

  const rest = (count: number) => ((splitCpf
    .slice(0, count - 12)
    .reduce((sum, el, index) => sum + el * (count - index), 0)
      * 10)
      % 11)
    % 10;

  return rest(10) === splitCpf[9] && rest(11) === splitCpf[10];
}
