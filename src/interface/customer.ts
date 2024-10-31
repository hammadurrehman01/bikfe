export type TContact = {
  id?: string | number | undefined;
  image?: string | undefined;
  number: string | null;
  contactPerson: string | number;
};

export type TAddress = {
  image?: string | undefined;
  id?: string | number | undefined;
  address: string;
  country: string;
};
export type ICustomer = {
  id?: number;
  companyName: string;
  website: string;
  email: string;
  customerPhoneNumbers: TContact[];
  customerAddresses: TAddress[];
};

export type ICustomers = ICustomer[];

export type IListCustomer = {
  id?: number | undefined;
  label?: string;
  companyName: string;
  website: string;
  email: string;
  customerPhone: TContact[];
  customerAddress: TAddress[];
};
export type ICustomerMapping = {
  customerId: number | string;
  code: number | string;
  productId: number | string | undefined;
};
export type IUpdateCustomerMapping = {
  code: string;
  customerProductId: string | number;
};

export type ICustomerAddress = {
  address: string;
  country: string;
};

export type ICustomerPhone = {
  contactPerson: string;
  number: string;
};
