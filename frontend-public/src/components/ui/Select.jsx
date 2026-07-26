import { useEffect, useRef, useState } from "react";

function IconChevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Custom themed dropdown that matches SIRA design system.
 *
 * Props:
 *   value        - current selected value
 *   onChange     - (value) => void
 *   options      - array of { value, label } OR array of strings
 *   placeholder  - shown when nothing selected
 *   id           - for label association
 *   disabled     - bool
 */
export default function Select({
  value = "",
  onChange,
  options = [],
  placeholder = "— Select —",
  id,
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options — accept ["a", "b"] or [{value, label}]
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selected = normalized.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [open]);

  // Close on Escape / navigate with arrows
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((i) => Math.min(i + 1, normalized.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && highlightIdx >= 0) {
        e.preventDefault();
        onChange?.(normalized[highlightIdx].value);
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, highlightIdx, normalized, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[highlightIdx];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [highlightIdx, open]);

  function toggleOpen() {
    if (disabled) return;
    setOpen((s) => !s);
    // Set highlight to current selection
    const idx = normalized.findIndex((o) => o.value === value);
    setHighlightIdx(idx);
  }

  function selectOption(opt) {
    onChange?.(opt.value);
    setOpen(false);
  }

  return (
    <div
      ref={wrapRef}
      className={`sira-select ${open ? "sira-select-open" : ""} ${
        disabled ? "sira-select-disabled" : ""
      } ${className}`}
    >
      <button
        id={id}
        type="button"
        className="sira-select-trigger"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        {selected ? (
          <span className="sira-select-value">{selected.label}</span>
        ) : (
          <span className="sira-select-placeholder">{placeholder}</span>
        )}
        <span className="sira-select-caret" aria-hidden="true">
          <IconChevron />
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="sira-select-panel"
          role="listbox"
          tabIndex={-1}
        >
          {normalized.length === 0 && (
            <li className="sira-select-empty">No options</li>
          )}
          {normalized.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightIdx;
            return (
              <li
                key={opt.value + idx}
                role="option"
                aria-selected={isSelected}
                className={`sira-select-option ${
                  isSelected ? "sira-select-option-selected" : ""
                } ${isHighlighted ? "sira-select-option-highlight" : ""}`}
                onClick={() => selectOption(opt)}
                onMouseEnter={() => setHighlightIdx(idx)}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="sira-select-check" aria-hidden="true">
                    <IconCheck />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}