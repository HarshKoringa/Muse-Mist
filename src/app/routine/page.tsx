import Header from "@/components/Header";
import RoutineHero from '@/components/routine/RoutineHero'
import RoutinePillars from '@/components/routine/RoutinePillars'
import RoutineSteps from '@/components/routine/RoutineSteps'
import RoutineSplit from '@/components/routine/RoutineSplit'
import RoutineMantra from '@/components/routine/RoutineMantra'
import RoutineCTA from '@/components/routine/RoutineCTA'

export default function RoutinePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <RoutineHero />
      <RoutinePillars />
      <RoutineSteps />
      <RoutineSplit />
      <RoutineMantra />
      <RoutineCTA />
    </main>
  )
}
