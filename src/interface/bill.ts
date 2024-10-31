export interface Bill {
  vendor_product: number;
  price: number;
  quantity: number;
}
export type BillItem1 = {
  price: number;
  quantity: number;
  product_name?: number;
  code?: string;
  product_id?: number;
};

export type IBill = {
  vendorId: string | number;
  currency: string | null | undefined;
  date: string | number | null;
  status: string;
};

export type IBillWithBillItems = {
  billData: {
    date: string | number;
    status: string;
    vendorId: number | undefined;
    currency: string | number;
  };
  billItems?: {
    price: number;
    quantity: number;
    vendorProductId: number | undefined;
  }[];
};

export type IBillUpdate = {
  id?: string | number;
  vendor: string | number;
  currency: string | number;
  date: string | number;
  bill_item: BillItem1[];
};

export type BillItem = {
  id?: number;
  code: string;
  image?: string;
  price: number;
  quantity: number;
  product_name?: string;
  vendor_product_id?: number;
  product_id?: number;
};

export type IUpdateBillWithBillItems = {
  billData: {
    id: number | undefined;
    date: string | number;
    status: string;
    vendorId: number | undefined | string;
    currency: string | number;
  };
  billItems: {
    price: number;
    quantity: number;
    vendorProductId: number | undefined;
  }[];
};
