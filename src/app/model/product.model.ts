export interface Product {

  id: string;// Identifiant unique et universelle
  name: string;
  price: number;
  promotion: boolean;
}

export interface PageProduct {
  products: Product[];
  page: number;
  size: number;
  totalPages: number;
}
