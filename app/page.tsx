import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Presale from "@/components/Presale";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Tokenomics />
      <Roadmap />
      <Presale />
      <TrustBadges />
      <Footer />
    </main>
  );
}
