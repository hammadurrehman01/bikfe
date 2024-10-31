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
export type IVendor = {
  id?: string | number;
  companyName: string;
  website: string;
  email: string;
  vendorPhoneNumbers: TContact[];
  vendorAddresses: TAddress[];
};

export type IVendors = IVendor[];

export type IListVendor = {
  id?: string;
  label?: string;
  companyName: string;
  website: string;
  email: string;
  vendorPhone: TContact[];
  vendorAddress: TAddress[];
};
export type IVendorMapping = {
  vendorId: number | string;
  code: number | string;
  productId: number | string | undefined;
};

export type IVendorAddress = {
  address: string;
  country: string;
};

export type IVendorPhone = {
  contactPerson: string;
  number: string;
};
