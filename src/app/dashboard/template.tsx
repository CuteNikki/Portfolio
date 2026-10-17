// Next mounts this afresh when moving to another part of the dashboard, so each one fades in briefly, without moving:
// a cue that the page changed, short enough not to hold anyone up
export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='animate-fade-in min-w-0'>{children}</div>;
}
