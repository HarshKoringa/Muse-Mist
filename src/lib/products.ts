export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  tag: string;
  imagePath: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cloud Coat",
    category: "Moisturizer",
    price: 899,
    tag: "Hydrating",
    imagePath: "/images/cloud-coat.jpg",
  },
  {
    id: "2",
    name: "Veil SPF 50",
    category: "Sunscreen",
    price: 999,
    tag: "UV Protection",
    imagePath: "/images/veil-spf50.jpg",
  },
  {
    id: "3",
    name: "Glass Skin Gel Cream",
    category: "Hydrator",
    price: 799,
    tag: "Brightening",
    imagePath: "/images/glass-skin-gel-cream.jpg",
  },
  {
    id: "4",
    name: "Aurora C Serum",
    category: "Serum",
    price: 1299,
    tag: "Vitamin C",
    imagePath: "/images/aurora-c-serum.jpg",
  },
];
