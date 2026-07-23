import Button from "./Button.jsx";

export default function PageHero({
  title = "SIRA Technologies",
  subtitle = "",
  image = "/assets/hero.jpg",
  align = "left",
  primaryCtaLabel = "Start a Project",
  primaryCtaTo = "/start-project",
  secondaryCtaLabel = "View Work",
  secondaryCtaTo = "/portfolio"
}) {
  const isCenter = align === "center";

  return (
    <section className="page-hero">
      <div
        className="page-hero-media"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="page-hero-scrim" />

      <div className="page-hero-content">
        <div className="container">
          <div className={`page-hero-inner ${isCenter ? "center" : ""}`}>
            <h1 className="page-hero-title">{title}</h1>

            {subtitle ? <p className="page-hero-sub">{subtitle}</p> : null}

            <div className="page-hero-actions">
              <Button as="a" href={primaryCtaTo} variant="primary">
                {primaryCtaLabel}
              </Button>
              <Button as="a" href={secondaryCtaTo} variant="secondary">
                {secondaryCtaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}