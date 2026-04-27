import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import ProductGrid from "@/components/ProductGrid";
import ReviewsSection from "@/components/ReviewsSection";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import EarlyAccessCTA from "@/components/EarlyAccessCTA";
import Footer from "@/components/Footer";

export default async function Home() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const [{ data: products }, { count }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, slug, price, description, category, stock_count, image_url")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    adminSupabase
      .from("muses")
      .select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Header />
      <HeroSection />
      <PhilosophySection />

      {/* Product section — Deep Ink Blue */}
      <section id="products" className="w-full px-6 sm:px-12 py-24 bg-[#1A237E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                The Edit
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-white leading-tight">
                Five formulas.<br />
                <em className="text-[#DCD9F8]/50">One ritual.</em>
              </h2>
            </div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-[#DCD9F8]/40 max-w-xs leading-relaxed font-light sm:text-right">
              Skin that speaks before you do. Each product designed
              to work alone or as a complete ritual.
            </p>
          </div>
          <ProductGrid products={products ?? []} />
        </div>
      </section>

      <ReviewsSection />
      <EarlyAccessCTA count={count ?? 0} />
      <Footer />
    </div>
  );
}
