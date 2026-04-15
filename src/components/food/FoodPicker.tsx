import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';
import { foodDatabase } from '../../data/foodDatabase';
import type { FoodEntry } from '../../types';

interface FoodPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: Omit<FoodEntry, 'id' | 'timestamp'> | Omit<FoodEntry, 'id' | 'timestamp'>[]) => void;
}

export default function FoodPicker({ isOpen, onClose, onAdd }: FoodPickerProps) {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [search, setSearch] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const filtered = foodDatabase.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFood = (id: string) => {
    const newSet = new Set(selectedFoods);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedFoods(newSet);
  };

  const handleAddMultiple = () => {
    if (selectedFoods.size === 0) return;
    
    const foods = Array.from(selectedFoods).map(foodId => {
      const food = foodDatabase.find(f => f.id === foodId);
      return food ? {
        foodId: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        meal,
      } : null;
    }).filter(Boolean) as Omit<FoodEntry, 'id' | 'timestamp'>[];
    
    onAdd(foods);
    handleClose();
  };

  const handleAddCustom = () => {
    onAdd({
      name: customName,
      calories: parseInt(customCalories) || 0,
      protein: parseInt(customProtein) || 0,
      carbs: parseInt(customCarbs) || 0,
      fat: parseInt(customFat) || 0,
      meal,
    });
    handleClose();
  };

  const handleClose = () => {
    setSearch('');
    setSelectedFoods(new Set());
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    onClose();
  };

  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Food">
      <div className="space-y-4">
        <Select
          label="Meal"
          value={meal}
          onChange={e => setMeal(e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
          options={mealOptions}
        />
        
        <div className="flex gap-2">
          <Button 
            variant={mode === 'preset' ? 'primary' : 'secondary'} 
            size="sm" 
            className="flex-1"
            onClick={() => setMode('preset')}
          >
            Preset
          </Button>
          <Button 
            variant={mode === 'custom' ? 'primary' : 'secondary'} 
            size="sm" 
            className="flex-1"
            onClick={() => setMode('custom')}
          >
            Custom
          </Button>
        </div>
        
        {mode === 'preset' ? (
          <>
            <Input
              placeholder="Search foods..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filtered.slice(0, 15).map(food => (
                <button
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-3 ${
                    selectedFoods.has(food.id)
                      ? 'bg-primary text-white'
                      : 'bg-background hover:bg-background/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedFoods.has(food.id)
                      ? 'border-white bg-white/20'
                      : 'border-gray-500'
                  }`}>
                    {selectedFoods.has(food.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{food.name}</div>
                    <div className="text-xs opacity-75">
                      {food.calories} cal • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <Button 
              className="w-full" 
              disabled={selectedFoods.size === 0}
              onClick={handleAddMultiple}
            >
              Add {selectedFoods.size > 0 ? `${selectedFoods.size} Foods` : 'Foods'}
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Food Name"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="e.g., Homemade Salad"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Calories"
                type="number"
                value={customCalories}
                onChange={e => setCustomCalories(e.target.value)}
                placeholder="0"
              />
              <Input
                label="Protein (g)"
                type="number"
                value={customProtein}
                onChange={e => setCustomProtein(e.target.value)}
                placeholder="0"
              />
              <Input
                label="Carbs (g)"
                type="number"
                value={customCarbs}
                onChange={e => setCustomCarbs(e.target.value)}
                placeholder="0"
              />
              <Input
                label="Fat (g)"
                type="number"
                value={customFat}
                onChange={e => setCustomFat(e.target.value)}
                placeholder="0"
              />
            </div>
            <Button 
              className="w-full" 
              disabled={!customName || !customCalories}
              onClick={handleAddCustom}
            >
              Add Custom Food
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}