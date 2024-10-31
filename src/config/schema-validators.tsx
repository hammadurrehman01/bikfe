import * as yup from 'yup';
const STRING_TYPE = yup.string();
const NUMBER_TYPE = yup.number();
// const phoneRegExp =
//   /^((\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const LOGIN_FORM_SCHEMA = () =>
  yup.object({
    email: STRING_TYPE.required('REQUIRED EMAIL').email('ENTER VALID EMAIL'),
    password: STRING_TYPE.required('REQUIRED PASSWORD'),
  });
export const CUSTOMER_FORM_SCHEMA_FRONTEND = () =>
  yup.object({
    companyName: STRING_TYPE.required('REQUIRED COMPANY NAME'),
    website: STRING_TYPE.required('REQUIRED WEBSITE')
      .matches(
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)([/?].*)?$/,
        'ENTER VALID WEBSITE',
      )
      .optional(),
    email: STRING_TYPE.required('REQUIRED EMAIL')
      .email('ENTER VALID EMAIL')
      .optional(),
  });

export const CUSTOMER_UPDATED_FORM_SCHEMA_FRONTEND = () =>
  yup.object({
    companyName: STRING_TYPE.required('REQUIRED COMPANY NAME'),
    website: STRING_TYPE.matches(
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)([/?].*)?$/,
      'ENTER VALID WEBSITE',
    ).optional(),
    email: STRING_TYPE.email('ENTER VALID EMAIL').optional(),
  });

export const CUSTOMER_FORM_SCHEMA = () =>
  yup.object({
    companyName: STRING_TYPE.required('REQUIRED COMPANY NAME'),
    // website: STRING_TYPE.required('REQUIRED WEBSITE').matches(
    //   /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)([/?].*)?$/,
    //   'ENTER VALID WEBSITE',
    // ).optional(),
    // email: STRING_TYPE.required('REQUIRED EMAIL').email('ENTER VALID EMAIL').optional(),
    // phoneNumber: STRING_TYPE.matches(
    //   /^\+?[0-9]{1,4}-?[0-9]{6,12}$/,
    //   'ENTER VALID PHONE NUMBER (e.g., +1234567890 or 123-456-789012)',
    // ).required('REQUIRED PHONE NUMBER'),
  });
export const VENDOR_FORM_SCHEMA = () =>
  yup.object({
    company_name: STRING_TYPE.required('REQUIRED COMPANY NAME'),
    website: STRING_TYPE.required('REQUIRED WEBSITE'),
    email: STRING_TYPE.required('REQUIRED EMAIL').email('ENTER VALID EMAIL'),
    number: NUMBER_TYPE.required('REQUIRED NUMBER'),
    contact_person: NUMBER_TYPE.required('REQUIRED CONTACT'),
    address: STRING_TYPE.required('REQUIRED ADDRESS'),
    country: STRING_TYPE.required('REQUIRED COUNTRY'),
  });
export const PRODUCT_FORM_SCHEMA = () =>
  yup.object({
    name: STRING_TYPE.required('REQUIRED NAME'),
    oem: STRING_TYPE.required('REQUIRED OEM'),
  });
export const ADD_CUSTOMER_PRODUCT_CODE_SCHEMA = () =>
  yup.object({
    code: STRING_TYPE.required('REQUIRED CODE'),
  });
export const UPDATE_CUSTOMER_PRODUCT_CODE_SCHEMA = () =>
  yup.object({
    code: STRING_TYPE.required('REQUIRED CODE'),
  });
export const ADD_VENDOR_PRODUCT_CODE_SCHEMA = () =>
  yup.object({
    code: STRING_TYPE.required('REQUIRED CODE'),
  });
export const INVOICE_FORM_SCHEMA = () =>
  yup.object({
    currency: STRING_TYPE.required('REQUIRED CURRENCY').optional(),
  });

export const INVOICE_FORM_SCHEMA_BACKEND = () =>
  yup.object({
    invoiceData: yup.object().shape({
      currency: STRING_TYPE.required('REQUIRED CURRENCY'),
    }),
  });
export const BILL_FORM_SCHEMA = () =>
  yup.object({
    currency: STRING_TYPE.required('REQUIRED CURRENCY').optional(),
  });
export const PRODUCT_MAPPING_FORM_SCHEMA = () =>
  yup.object({
    products: STRING_TYPE.required('REQUIRED PRODUCTS'),
    customer: STRING_TYPE.required('REQUIRED CUSTOMER'),
    vendor: STRING_TYPE.required('REQUIRED VENDOR'),
  });
