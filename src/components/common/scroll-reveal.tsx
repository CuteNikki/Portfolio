// A section that rises in as the page loads, or as it scrolls into view further down (see RevealOnScroll). Items
// inside marked data-reveal-item rise in one after another instead of the section as a whole.
export function ScrollReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal='' className={className}>
      {children}
    </div>
  );
}
