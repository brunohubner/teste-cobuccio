export const REGEX = Object.freeze({
  CNPJ: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/,
  CNPJ_WITHOUT_MASK: /^[0-9]{14}$/,
  CPF: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
  CPF_WITHOUT_MASK: /^[0-9]{11}$/,
  CEP: /^[0-9]{5}-[0-9]{3}$/,
  CEP_WITHOUT_MASK: /^[0-9]{8}$/,
  PHONE: /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/,
  PHONE_WITHOUT_MASK: /^[0-9]{10,11}$/,
  EMAIL: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
  PASSWORD:
    /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"`'#%&,.:;<>=@{}~$()*+/\\?[\]^|])/,
  PERSON_NAME:
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  CREDIT_CARD_NUMBER: /^([0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4})$/i,
  CREDIT_CARD_EXPIRY_DATE: /^([0-9]{2}[/][0-9]{4})$/i,
  CVV: /^([0-9]{3,4})$/i,
  ADDRESS_NUMBER: /^([0-9]{1,10})$/i,
  STATE_REGISTRATION: /^[a-zA-Z0-9\\.-]+$/u,
  MUNICIPAL_REGISTRATION: /^[a-zA-Z0-9\\.-]+$/u,
  NUMBERS_ONLY: /^[0-9]+$/i,
  LETTERS_ONLY_AND_SPACE_ONLY: /^[a-zA-Z ]+$/i,

  'YYYY-MM-DDD': /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/i,
});
