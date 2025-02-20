import { maskJSONFields } from 'maskdata';

export function mask(body: object, fields: string[], maskWith = '*') {
  return maskJSONFields(body, {
    fields,
    maskWith,
  });
}

export const maskBody = (body: object) => {
  const fields = [
    'cvv',
    'cardNumber',
    'cardHolderName',
    'cardExpirationDate',
  ];

  return mask(body, fields);
};
