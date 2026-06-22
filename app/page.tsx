import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950">
      <Navbar />
      <Hero />
      <Tokenomics />
      <Roadmap />
      <TrustBadges />
      <Footer />
    </main>
  );
}
