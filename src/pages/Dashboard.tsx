import { useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import QuickAddButtons from '../components/dashboard/QuickAddButtons';
import Card from '../components/common/Card';
import FoodPicker from '../components/food/FoodPicker';
import ActivityPicker from '../components/activity/ActivityPicker';
import ProgressRing from '../components/common/ProgressRing';
import { useFitTrackContext } from '../context/FitTrackContext';
import { formatDate } from '../utils/formatters';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  
  const {
    profile,
    addFood,
    addActivity,
    addWater,
    getTodayCalories,
    getTodayBurned,
    getTodayWater,
    getTodayData,
    getWeeklyCalories,
    getStreak,
  } = useFitTrackContext();

  const consumed = getTodayCalories();
  const burned = getTodayBurned();
  const water = getTodayWater();
  const todayActivities = getTodayData().activities || [];
  const weeklyData = getWeeklyCalories();
  const streak = getStreak();
  const tdee = profile?.tdee || 2000;
  const waterGoal = profile?.waterGoal || 2000;
  const remaining = tdee - consumed + burned;
  const maxCalories = Math.max(...weeklyData.map((d: { calories: number }) => d?.calories || 0), tdee, 1);
  const today = formatDate(new Date());

  const handleAddFood = (food: Omit<import('../types').FoodEntry, 'id' | 'timestamp'> | Omit<import('../types').FoodEntry, 'id' | 'timestamp'>[]) => {
    if (Array.isArray(food)) {
      food.forEach(f => addFood(f));
    } else {
      addFood(food);
    }
  };

  const hasProfile = profile && profile.age > 0 && profile.height > 0 && profile.weight > 0;

  if (!hasProfile) {
    return (
      <div className="space-y-6 pb-20">
        <Card className="text-center py-8">
          <h2 className="text-xl font-bold mb-2">Welcome to FitTrack!</h2>
          <p className="text-muted mb-4">Set up your profile to get started</p>
          <button 
            onClick={() => onNavigate?.('profile')}
            className="text-primary hover:underline"
          >
            Go to Profile →
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold animate-fade-in-up">Dashboard</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            label="Calories"
            value={`${consumed}`}
            subValue={`of ${tdee}`}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            label="Burned"
            value={`${burned}`}
            subValue="cal"
            color="text-accent"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            label="Water"
            value={`${Math.round(water / 100) / 10}`}
            subValue="L"
            color="text-secondary"
          />
        </div>
      </div>
      
      <Card className="animate-fade-in-up stagger-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Remaining Calories</span>
          <span className={`text-lg font-bold ${remaining < 0 ? 'text-danger' : 'text-primary'}`}>
            {remaining} cal
          </span>
        </div>
        <div className="h-3 bg-background rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              remaining < 0 ? 'bg-danger' : remaining < 200 ? 'bg-yellow-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(Math.max((consumed / tdee) * 100, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>{consumed} consumed</span>
          <span>{tdee - consumed - burned} remaining</span>
        </div>
      </Card>
      
      {streak > 0 && (
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-xl font-bold text-amber-500">{streak} Day Streak!</p>
              <p className="text-sm text-muted">Keep it up!</p>
            </div>
          </div>
        </Card>
      )}
      
      <Card>
        <h3 className="font-semibold mb-4">Weekly Progress</h3>
        <p className="text-xs text-muted mb-2">Max: {maxCalories} cal</p>
        <div className="flex items-end justify-between gap-1 h-28">
          {weeklyData.length === 0 ? (
            <p className="text-muted text-center w-full py-4">No data yet</p>
          ) : (
            weeklyData.map((day: { date: string; calories: number; day: string }, index: number) => {
              const height = maxCalories > 0 ? Math.min((day.calories / maxCalories) * 100, 100) : 0;
              const isToday = day.date === today;
              return (
                <div key={index} className="flex flex-col items-center flex-1 w-full">
                  <span className="text-xs mb-1">{day.calories}</span>
                  <div 
                    className={`w-4 sm:w-6 rounded-t-md transition-all ${
                      isToday ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                  />
                  <span className={`text-xs mt-1 ${isToday ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>
      
      <Card>
        <h3 className="font-semibold mb-4 text-center">Today's Progress</h3>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="text-center">
            <ProgressRing
              progress={Math.min((consumed / tdee) * 100, 100)}
              size={80}
              strokeWidth={6}
              color="#10B981"
              value={`${consumed}`}
            />
            <p className="text-xs text-muted mt-2">Calories</p>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={Math.min((todayActivities.length / 3) * 100, 100)}
              size={80}
              strokeWidth={6}
              color="#EC4899"
              value={`${todayActivities.length}`}
            />
            <p className="text-xs text-muted mt-2">Activities</p>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={Math.min((water / waterGoal) * 100, 100)}
              size={80}
              strokeWidth={6}
              color="#3B82F6"
              value={`${Math.round(water / 100)}`}
            />
            <p className="text-xs text-muted mt-2">Water (ml)</p>
          </div>
        </div>
      </Card>
      
      <QuickAddButtons
        onAddFood={() => setShowFoodPicker(true)}
        onAddActivity={() => setShowActivityPicker(true)}
        onAddWater={() => addWater(250)}
      />
      
      <FoodPicker
        isOpen={showFoodPicker}
        onClose={() => setShowFoodPicker(false)}
        onAdd={handleAddFood}
      />
      
      <ActivityPicker
        isOpen={showActivityPicker}
        onClose={() => setShowActivityPicker(false)}
        onAdd={addActivity}
      />
    </div>
  );
}