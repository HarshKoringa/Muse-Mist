import Header from "@/components/Header";
import RoutineHero from "@/components/routine/RoutineHero";
import RoutinePhilosophy from "@/components/routine/RoutinePhilosophy";
import RoutineSteps from "@/components/routine/RoutineSteps";
import RoutineSplit from "@/components/routine/RoutineSplit";
import RoutineMantra from "@/components/routine/RoutineMantra";
import RoutineCTA from "@/components/routine/RoutineCTA";

export default function RoutinePage() {
  return (
    <div className="min-h-screen bg-[#DCD9F8] font-sans overflow-auto">
      <Header />
      <RoutineHero />
      <RoutinePhilosophy />
      <RoutineSteps />
      <RoutineSplit />
      <RoutineMantra />
      <RoutineCTA />
    </div>
  );
}
