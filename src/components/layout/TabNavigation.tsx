interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'food', label: 'Food', icon: '🍎' },
  { id: 'activity', label: 'Activity', icon: '🏃' },
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-background z-40">
      <div className="max-w-2xl mx-auto flex justify-around px-2 py-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-primary scale-105'
                : 'text-muted hover:text-white hover:scale-105'
            }`}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <span className={`text-xl transition-transform ${activeTab === tab.id ? 'animate-bounce' : ''}`}>{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}