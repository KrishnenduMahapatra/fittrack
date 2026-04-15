import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur border-b px-4 py-3 transition-all duration-300 ${
      scrolled ? 'bg-background/95 border-surface' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-500 rounded-xl animate-pulse opacity-30"></span>
            <span className="relative bg-gradient-to-br from-primary to-emerald-400 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </span>
          <span className="flex items-baseline gap-0.5">
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Fit
            </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Track
            </span>
          </span>
        </h1>
      </div>
    </header>
  );
}
