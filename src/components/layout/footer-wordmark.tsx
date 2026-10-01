// Oversized brand wordmark that bleeds off the bottom edge of the footer.
// SVG textLength keeps it exactly edge-to-edge at every viewport width.
export function FooterWordmark() {
  return (
    <svg
      viewBox="0 0 1000 170"
      className="mt-16 block w-full select-none"
      aria-hidden
      focusable="false"
    >
      <text
        x="500"
        y="205"
        textAnchor="middle"
        textLength="960"
        lengthAdjust="spacing"
        fill="var(--lagoon)"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 250,
        }}
      >
        treasure
      </text>
    </svg>
  )
}
