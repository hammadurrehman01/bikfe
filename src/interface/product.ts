export type TProduct = {
  id?: number;
  url: string;
  name: string;
  oem: string;
  image: string;
  label?: string;
};
export type TProducts = TProduct[];

export type CreateProductInput = {
  id?: string;
  name: string;
  oem: string;
  image?: string | File[] | any;
};
export type IProductInput = {
  name: string;
  oem: string;
  image: string | File | null;
};

export type IProduct = {
  name: string;
  oem: string;
  image?: string;
};
