// Something that rises in as the page loads, or as it scrolls into view further down (see RevealOnScroll). With parts
// inside marked data-reveal, it only groups them and they rise in one by one instead.
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
