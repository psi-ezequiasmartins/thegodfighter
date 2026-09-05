/**
 * src/utils/phone.js
 */

// Remove tudo que não for dígito
export function unmaskPhone(value) {
  return (value || '').replace(/\D/g, '');
}

// Aplica a máscara (xx) 99999-9999 (ou (xx) 9999-9999 para números com 10 dígitos)
export function maskPhone(value) {
  const digits = unmaskPhone(value).slice(0, 11);
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${ddd}`;

  const isNineDigit = rest.length > 4 && digits.length > 10;
  const prefixLength = isNineDigit ? 5 : 4;
  const prefix = rest.slice(0, prefixLength);
  const suffix = rest.slice(prefixLength, prefixLength + 4);

  return suffix ? `(${ddd}) ${prefix}-${suffix}` : `(${ddd}) ${prefix}`;
}
