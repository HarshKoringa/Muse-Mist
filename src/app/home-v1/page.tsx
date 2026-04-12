import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { Pipette, Leaf, Droplets, Droplet, Sun, Shield } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ProductGrid from "@/components/ProductGrid";
import ReviewsSection from "@/components/ReviewsSection";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, description, category, stock_count, image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (
    <div className="min-h-screen bg-brand-main font-sans overflow-auto">
      <Header />

      {/* Hero with animated gradient + floating mist blob + bottle image */}
      <section className="relative pt-10 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 animated-gradient" />
        <div
          className="absolute -left-40 -top-20 w-[500px] h-[500px] blur-3xl opacity-40 rotate-12"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(220,217,248,0.6), rgba(220,239,255,0.2) 40%, transparent 60%)",
            animation: "mist 12s infinite linear",
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div>
              <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-brand-ink leading-tight mb-6 tracking-wider uppercase">
                GLAZED SKIN.
                <br />
                ZERO STICKINESS.
              </h1>
              <p className="text-brand-ink-muted text-lg mb-8 max-w-lg">
                Experience skincare that feels as good as it looks. Premium
                formulations designed for your most radiant self.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/routine"
                  className="px-6 py-4 border-2 border-brand-ink text-brand-ink font-semibold rounded-full hover:bg-brand-ink hover:text-brand-surface transition text-base"
                >
                  Meet the Routine
                </Link>
              </div>
            </div>

            <div className="hidden md:flex relative h-96">
              {/* bottle image - responsive size, no animation - hidden on mobile */}
              <div className="relative w-96 h-[500px]">
                <Image
                  src="/images/bottle.png"
                  alt="Frosted glass bottle"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .animated-gradient { background: linear-gradient(120deg, #DCD9F8 0%, #DCEFFF 50%, #FFFFFF00 100%); background-size: 200% 200%; animation: gradientShift 8s ease infinite; }
          @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes mist { 0% { transform: translateY(0) translateX(0) rotate(0deg); } 50% { transform: translateY(-20px) translateX(10px) rotate(6deg); } 100% { transform: translateY(0) translateX(0) rotate(0deg); } }
        `}</style>
      </section>

      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #DCEFFF 0%, #FFFFFF 100%)",
        }}
      >
        {/* Floating blobs for depth */}
        <div
          className="absolute top-20 left-10 w-96 h-96 blur-3xl opacity-20 rounded-full"
          style={{
            background: "#DCD9F8",
            animation: "floatBlob1 15s infinite ease-in-out",
          }}
        />
        <div
          className="absolute bottom-10 right-20 w-80 h-80 blur-3xl opacity-15 rounded-full"
          style={{
            background: "#DCD9F8",
            animation: "floatBlob2 18s infinite ease-in-out",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-ink mb-16 text-center uppercase tracking-wider">
            Science That Feels Like Self-Care
          </h2>

          {/* Desktop grid view */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Pipette,
                title: "HIGH-PERFORMANCE ACTIVES",
                desc: "Clinically proven ingredients that deliver visible results.",
              },
              {
                icon: Leaf,
                title: "CALMING BOTANICALS",
                desc: "Traditional extracts like Neem for soothing skin.",
              },
              {
                icon: Droplets,
                title: "NON-STICKY TEXTURES",
                desc: "Ultra-lightweight formulas that feel weightless on skin.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl p-8 text-center backdrop-blur-xl bg-white/20 border border-[#1A237E]/5 hover:border-[#1A237E]/40 transition-all duration-300 hover:scale-102"
                  style={{ boxShadow: "0 20px 50px rgba(220,217,248,0.12)" }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#DCEFFF]/30 p-4 rounded-full group-hover:shadow-[0_8px_24px_rgba(220,239,255,0.2)] transition">
                      <Icon className="text-[#1A237E] w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-brand-ink mb-3 uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>
                  <p className="text-brand-ink-muted text-base">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile horizontal scroll/snap carousel */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4">
            {[
              {
                icon: Pipette,
                title: "HIGH-PERFORMANCE ACTIVES",
                desc: "Clinically proven ingredients that deliver visible results.",
              },
              {
                icon: Leaf,
                title: "CALMING BOTANICALS",
                desc: "Traditional extracts like Neem for soothing skin.",
              },
              {
                icon: Droplets,
                title: "NON-STICKY TEXTURES",
                desc: "Ultra-lightweight formulas that feel weightless on skin.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex-shrink-0 w-72 snap-center rounded-2xl p-8 text-center backdrop-blur-xl bg-white/20 border border-[#1A237E]/5 hover:border-[#1A237E]/40 transition-all"
                  style={{ boxShadow: "0 20px 50px rgba(220,217,248,0.12)" }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#DCEFFF]/30 p-4 rounded-full">
                      <Icon className="text-[#1A237E] w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-brand-ink mb-3 uppercase tracking-[0.08em]">
                    {item.title}
                  </h3>
                  <p className="text-brand-ink-muted text-base">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes floatBlob1 { 0%, 100% { transform: translateY(0px) translateX(0px); } 33% { transform: translateY(-30px) translateX(20px); } 66% { transform: translateY(20px) translateX(-10px); } }
          @keyframes floatBlob2 { 0%, 100% { transform: translateY(0px) translateX(0px); } 33% { transform: translateY(25px) translateX(-15px); } 66% { transform: translateY(-20px) translateX(25px); } }
          .hover\:scale-102:hover { transform: scale(1.02); }
        `}</style>
      </section>

      <section id="products" className="w-full px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1A237E] text-center mb-2">
            The Edit
          </h2>
          <p className="text-base text-gray-400 text-center mb-12">
            Skin that speaks before you do.
          </p>
          <ProductGrid products={products ?? []} />
        </div>
      </section>

      <ReviewsSection />

      {/* Premium Trust Bar */}
      <section
        className="w-full border-t-[0.5px] border-b-[0.5px] border-[#1A237E]/10 py-8 md:py-12 px-6"
        style={{
          background: "linear-gradient(135deg, #F5F0FF 0%, #F0F8FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Desktop: 3-column grid layout */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center">
              <Droplet className="w-5 h-5 text-[#1A237E]/70 flex-shrink-0" />
              <p className="text-[10px] text-[#1A237E] font-semibold uppercase tracking-widest whitespace-nowrap">
                Niacinamide, Vitamin C, Kakadu Plum
              </p>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Sun className="w-5 h-5 text-[#1A237E]/70 flex-shrink-0" />
              <p className="text-[10px] text-[#1A237E] font-semibold uppercase tracking-widest whitespace-nowrap">
                Zero White Cast, Tested on Humid Indian Summers
              </p>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Shield className="w-5 h-5 text-[#1A237E]/70 flex-shrink-0" />
              <p className="text-[10px] text-[#1A237E] font-semibold uppercase tracking-widest whitespace-nowrap">
                Fragrance-Light, Barrier-Friendly
              </p>
            </div>
          </div>

          {/* Mobile: Auto-scrolling marquee */}
          <div className="md:hidden overflow-hidden">
            <div className="marquee-scroll">
              {[
                { icon: Droplet, text: "Niacinamide, Vitamin C, Kakadu Plum" },
                {
                  icon: Sun,
                  text: "Zero White Cast, Tested on Humid Indian Summers",
                },
                { icon: Shield, text: "Fragrance-Light, Barrier-Friendly" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 whitespace-nowrap pr-12"
                  >
                    <Icon className="w-4 h-4 text-[#1A237E]/70 flex-shrink-0" />
                    <p className="text-[9px] text-[#1A237E] font-semibold uppercase tracking-widest">
                      {item.text}
                    </p>
                  </div>
                );
              })}
              {/* Duplicate for seamless loop */}
              {[
                { icon: Droplet, text: "Niacinamide, Vitamin C, Kakadu Plum" },
                {
                  icon: Sun,
                  text: "Zero White Cast, Tested on Humid Indian Summers",
                },
                { icon: Shield, text: "Fragrance-Light, Barrier-Friendly" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`duplicate-${idx}`}
                    className="flex items-center gap-3 whitespace-nowrap pr-12"
                  >
                    <Icon className="w-4 h-4 text-[#1A237E]/70 flex-shrink-0" />
                    <p className="text-[9px] text-[#1A237E] font-semibold uppercase tracking-widest">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          .marquee-scroll {
            display: flex;
            gap: 0;
            animation: scroll 20s linear infinite;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .marquee-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
    </div>
  );
}
