export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  img_url: string;
};

export type CartProduct = Product & {
  cartItemId: number;
};
