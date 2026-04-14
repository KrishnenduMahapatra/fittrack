interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'FitTrack' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-surface px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">{title}</h1>
      </div>
    </header>
  );
}