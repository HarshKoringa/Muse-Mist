"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = { products: Product[] };

// Routine-order slugs: cleanser → serums → moisturiser → sunscreen
const ROUTINE_ORDER = [
  "cleanse-clear-calm",
  "smooth-and-spotless",
  "reset-to-radiance",
  "barrier-repair",
  "invisible-glow-shield",
];

function sortByRoutine(products: Product[]): Product[] {
  const indexed = new Map(products.map((p) => [p.slug, p]));
  const ordered: Product[] = [];
  for (const slug of ROUTINE_ORDER) {
    const p = indexed.get(slug);
    if (p) ordered.push(p);
  }
  // append any products not in the routine order list
  for (const p of products) {
    if (!ROUTINE_ORDER.includes(p.slug)) ordered.push(p);
  }
  return ordered;
}

export default function ProductGrid({ products }: Props) {
  const sorted = sortByRoutine(products);

  return (
    <>
      {/* Mobile: horizontal scroll carousel */}
      <div className="lg:hidden -mx-6 sm:-mx-12">
        <div
          className="flex overflow-x-auto scrollbar-hide px-6 sm:px-12 gap-3"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {sorted.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[65%]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
          {/* Trailing spacer so last card has a right margin */}
          <div className="flex-none w-4" aria-hidden />
        </div>
      </div>

      {/* Desktop: vertical 3-column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} variant="full" />
        ))}
      </div>
    </>
  );
}
