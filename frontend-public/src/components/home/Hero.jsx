import Button from "../ui/Button.jsx";
import InstallSnippet from "../ui/InstallSnippet.jsx";
import TerminalCard from "../ui/TerminalCard.jsx";

export default function Hero() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 16, color: "var(--mute)", fontSize: 14 }}>
          Modern software & digital solutions
        </div>

        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 18 }}>
          Transform ideas into powerful digital experiences.
        </h1>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <InstallSnippet command={"npx sira-tech init my-project"} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 36 }}>
          <Button as="a" href="/contact">Get a Quote</Button>
          <Button as="a" href="/portfolio" variant="secondary">See Work</Button>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            <div style={{ color: "var(--charcoal)", textAlign: "left", fontWeight: 600 }}>
              Automate your work
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18, alignItems: "start" }}>
              <div style={{ textAlign: "left", color: "var(--body)" }}>
                Design, build, and ship with a team that combines UI/UX craft with full‑stack engineering, AI solutions, and automation.
              </div>

              <TerminalCard
                lines={[
                  { text: "$ sira build --type webapp" },
                  { text: "# generating UI, API, and deployment plan…", muted: true },
                  { text: "✔ UI/UX → ready" },
                  { text: "✔ Full-stack → ready" },
                  { text: "✔ Automation → ready" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}