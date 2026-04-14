import { useState } from 'react';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Activity from './pages/Activity';
import Water from './pages/Water';
import Profile from './pages/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="p-4 max-w-2xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'food' && <Food />}
        {activeTab === 'activity' && <Activity />}
        {activeTab === 'water' && <Water />}
        {activeTab === 'profile' && <Profile />}
      </main>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}