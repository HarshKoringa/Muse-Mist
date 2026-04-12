import AboutHero from "@/components/about/AboutHero";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import AboutFounder from "@/components/about/AboutFounder";
import AboutIngredients from "@/components/about/AboutIngredients";
import AboutContact from "@/components/about/AboutContact";

export const metadata = {
  title: "About | Muse & Mist",
  description:
    "Where science meets serenity. Learn about Muse & Mist, our philosophy, and the ingredients we swear by.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <AboutPhilosophy />
      <AboutFounder />
      <AboutIngredients />
      <AboutContact />
    </main>
  );
}
