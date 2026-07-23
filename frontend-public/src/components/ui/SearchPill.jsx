export default function SearchPill({ placeholder = "Search", onChange }) {
  return (
    <div className="search-pill" role="search" aria-label="Search">
      <svg
        className="search-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M16.5 16.5 21 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <input placeholder={placeholder} onChange={onChange} />
    </div>
  );
}