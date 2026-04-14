interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'food', label: 'Food' },
    { id: 'activity', label: 'Activity' },
    { id: 'water', label: 'Water' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700">
      <div className="max-w-2xl mx-auto flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 text-center ${
              activeTab === tab.id
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}