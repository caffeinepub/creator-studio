import AppFooter from "../components/AppFooter";
import HeroSection from "../components/HeroSection";
import RequestCards from "../components/RequestCards";
import WheelOfChaos from "../components/WheelOfChaos";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <main className="flex-1">
        <HeroSection />
        <RequestCards />
        <WheelOfChaos />
      </main>
      <AppFooter />
    </div>
  );
}
