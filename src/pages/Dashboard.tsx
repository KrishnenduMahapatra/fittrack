import { useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import QuickAddButtons from '../components/dashboard/QuickAddButtons';
import Card from '../components/common/Card';
import FoodPicker from '../components/food/FoodPicker';
import ActivityPicker from '../components/activity/ActivityPicker';
import { useFitTrack } from '../hooks/useFitTrack';

export default function Dashboard() {
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
  } = useFitTrack();

  const consumed = getTodayCalories();
  const burned = getTodayBurned();
  const water = getTodayWater();
  const tdee = profile?.tdee || 2000;
  const waterGoal = profile?.waterGoal || 2000;

  const netCalories = consumed - burned;
  const calorieStatus = netCalories <= tdee ? 'text-primary' : 'text-danger';

  if (!profile) {
    return (
      <div className="space-y-6 pb-20">
        <Card className="text-center py-8">
          <h2 className="text-xl font-bold mb-2">Welcome to FitTrack!</h2>
          <p className="text-muted mb-4">Set up your profile to get started</p>
          <button 
            onClick={() => {}}
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
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Calories"
          value={`${consumed}`}
          subValue={`of ${tdee}`}
        />
        <StatCard
          label="Burned"
          value={`${burned}`}
          subValue="cal"
          color="text-accent"
        />
        <StatCard
          label="Water"
          value={`${Math.round(water / 1000 * 10) / 10}L`}
          subValue={`of ${waterGoal / 1000}L`}
          color="text-secondary"
        />
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted">Net Calories</span>
          <span className={`font-bold ${calorieStatus}`}>
            {netCalories} cal
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div 
            className={`h-full ${netCalories <= tdee ? 'bg-primary' : 'bg-danger'} transition-all`}
            style={{ width: `${Math.min((netCalories / tdee) * 100, 100)}%` }}
          />
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
        onAdd={addFood}
      />
      
      <ActivityPicker
        isOpen={showActivityPicker}
        onClose={() => setShowActivityPicker(false)}
        onAdd={addActivity}
      />
    </div>
  );
}