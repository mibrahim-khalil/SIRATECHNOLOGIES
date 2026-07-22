import { useState } from "react";

function CopyIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 9h10v10H9V9Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function InstallSnippet({ command }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="install-pill">
      <div className="install-text code">{command}</div>
      <button className="icon-btn" onClick={onCopy} aria-label="Copy command" title={copied ? "Copied" : "Copy"}>
        <CopyIcon />
      </button>
    </div>
  );
}