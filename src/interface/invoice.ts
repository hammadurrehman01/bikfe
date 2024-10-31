export interface Invoice {
  customer_product: number;
  price: number;
  quantity: number;
}
export type InvoiceItem1 = {
  price: number;
  quantity: number;
  product_name?: number;
  code?: string;
  product_id?: number;
};
export type IInvoiceUpdate = {
  id?: string | number;
  customer: string | number;
  currency: string | number;
  date: string | number;
  invoice_item: InvoiceItem1[];
};
export type IInvoice = {
  customerId: string | number;
  currency?: string | null;
  date: string | number | null;
  status: string;
};

export type IInvoiceWithInvoiceItems = {
  invoiceData: {
    date: string | number;
    status: string;
    customerId: number | undefined;
    currency: string | number;
  };
  invoiceItems: (
    | {
        price: number;
        quantity: number;
        customerProductId: number | undefined;
      }
    | undefined
  )[];
};

export type IUpdateInvoiceWithInvoiceItems = {
  invoiceData: {
    id: number | undefined;
    date: string | number;
    status: string;
    customerId: number | undefined | string;
    currency: string | number;
  };
  invoiceItems: {
    price: number;
    quantity: number;
    customerProductId: number | undefined;
  }[];
};

export type InvoiceItem = {
  id?: number;
  code: string;
  price: number;
  image?: string | null;
  quantity: number;
  product_name?: string;
  customer_product_id?: number;
  product_id?: number;
};
