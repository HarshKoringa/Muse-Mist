import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import ProductGrid from "@/components/ProductGrid";
import ReviewsSection from "@/components/ReviewsSection";
import HeroCarousel from "@/components/HeroCarousel";
import PhilosophySection from "@/components/PhilosophySection";
import EarlyAccessCTA from "@/components/EarlyAccessCTA";

export default async function Home() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const [{ data: products }, { count }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, slug, price, mrp, description, category, stock_count, is_active, image_url, discount_percent, discount_label, discount_active, size")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    adminSupabase
      .from("muses")
      .select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel products={products ?? []} />

      {/* Product section — White */}
      <section id="products" className="w-full px-6 sm:px-12 pt-8 sm:pt-12 pb-0 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-1 sm:gap-4">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A237E] mb-2 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                The Edit
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl sm:text-[32px] font-light text-[#0D1117] leading-tight">
                Five formulas. <em className="text-[#1A237E]">One ritual.</em>
              </h2>
            </div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-[13px] text-[#4B5563] max-w-[300px] leading-relaxed font-light sm:text-right">
              Skin that speaks before you do. Each product designed
              to work alone or as a complete ritual.
            </p>
          </div>
          <ProductGrid products={products ?? []} />
        </div>
      </section>

      <PhilosophySection />
      <ReviewsSection />
      <EarlyAccessCTA count={count ?? 0} />
    </div>
  );
}
