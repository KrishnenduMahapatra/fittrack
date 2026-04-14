import { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FoodList from '../components/food/FoodList';
import FoodPicker from '../components/food/FoodPicker';
import { useFitTrack } from '../hooks/useFitTrack';

export default function Food() {
  const [showPicker, setShowPicker] = useState(false);
  const { 
    profile, 
    todayData, 
    addFood, 
    removeFood, 
    getTodayCalories, 
    getTodayProtein, 
    getTodayCarbs, 
    getTodayFat,
  } = useFitTrack();

  const consumed = getTodayCalories();
  const target = profile?.tdee || 2000;
  const remaining = target - consumed;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Food</h2>
      
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted text-sm">Today</p>
            <p className="text-2xl font-bold">{consumed} <span className="text-muted text-base">/ {target} cal</span></p>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${remaining < 0 ? 'text-danger' : 'text-primary'}`}>
              {remaining > 0 ? remaining : remaining} cal left
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-background rounded-lg p-2">
            <p className="text-muted">Protein</p>
            <p className="font-bold">{getTodayProtein()}g</p>
          </div>
          <div className="bg-background rounded-lg p-2">
            <p className="text-muted">Carbs</p>
            <p className="font-bold">{getTodayCarbs()}g</p>
          </div>
          <div className="bg-background rounded-lg p-2">
            <p className="text-muted">Fat</p>
            <p className="font-bold">{getTodayFat()}g</p>
          </div>
        </div>
      </Card>
      
      <Button className="w-full" onClick={() => setShowPicker(true)}>
        + Add Food
      </Button>
      
      <FoodList foods={todayData.foods} onDelete={removeFood} />
      
      <FoodPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={addFood}
      />
    </div>
  );
}