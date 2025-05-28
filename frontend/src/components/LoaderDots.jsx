export default function LoaderDots() {
  return (
    <span className="inline-flex space-x-1">
      <span className="animate-pulse">•</span>
      <span className="animate-pulse" style={{ animationDelay: "150ms" }}>•</span>
      <span className="animate-pulse" style={{ animationDelay: "300ms" }}>•</span>
    </span>
  );
}

/* Tailwind users: add this to globals if you want smoother dots
@keyframes pulse {
  0%, 80%, 100% { opacity: 0.2; }
  40%           { opacity: 1; }
}
.animate-pulse { animation: pulse 1.2s infinite; }
*/
