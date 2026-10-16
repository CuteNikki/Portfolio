// A section that rises in as it scrolls into view. The animation is plain CSS (see .scroll-reveal in globals.css),
// so this ships no JavaScript and never hides content while a page loads.
export function ScrollReveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
