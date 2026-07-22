import Hero from "../components/home/Hero.jsx";
import ServicesPreview from "../components/home/ServicesPreview.jsx";
import PortfolioPreview from "../components/home/PortfolioPreview.jsx";
import CTASection from "../components/home/CTASection.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <PortfolioPreview />
      <CTASection />
    </>
  );
}