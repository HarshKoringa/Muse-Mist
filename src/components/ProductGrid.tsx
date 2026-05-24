"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = { products: Product[] };

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
