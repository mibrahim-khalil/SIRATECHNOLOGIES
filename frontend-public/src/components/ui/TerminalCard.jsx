export default function TerminalCard({ lines = [] }) {
  return (
    <div className="card">
      <div className="terminal-top">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
      </div>

      <div className="terminal-body code">
        {lines.map((l, idx) => (
          <div key={idx} className={l.muted ? "term-mute" : ""}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}