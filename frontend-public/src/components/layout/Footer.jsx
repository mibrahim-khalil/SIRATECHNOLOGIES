export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <a href="/services">Services</a>
          <a href="/portfolio">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/contact">Contact</a>
          <span style={{ color: "var(--mute)" }}>© {new Date().getFullYear()} SIRA Technologies</span>
        </div>
      </div>
    </footer>
  );
}