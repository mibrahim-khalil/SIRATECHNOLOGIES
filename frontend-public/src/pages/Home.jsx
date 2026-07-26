import PageHero from "../components/ui/PageHero.jsx";
import HomeServices from "../components/home/HomeServices.jsx";
import HomePopularBuilds from "../components/home/HomePopularBuilds.jsx";
import HomeWork from "../components/home/HomeWork.jsx";
import HomeProcess from "../components/home/HomeProcess.jsx";
import HomeReviews from "../components/home/HomeReviews.jsx";
import HomeCTA from "../components/home/HomeCTA.jsx";

export default function Home() {
  return (
    <>
      {/* Dynamic hero — pageKey="home" fetches from DB, falls back to props */}
      <PageHero
        pageKey="home"
        title="Build. Scale. Automate."
        subtitle="SIRA Technologies helps businesses design and build modern websites, web apps, AI solutions, and automation—fast, clean, and scalable."
        image="/assets/home-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="See Work"
        secondaryCtaTo="/portfolio"
      />

      <HomeServices />
      <HomePopularBuilds />
      <HomeWork />
      <HomeProcess />
      <HomeReviews />
      <HomeCTA />
    </>
  );
}