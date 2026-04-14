import type { FoodEntry } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatTime } from '../../utils/formatters';

interface FoodListProps {
  foods: FoodEntry[];
  onDelete: (id: string) => void;
}

const mealLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
};

export default function FoodList({ foods, onDelete }: FoodListProps) {
  if (foods.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-muted">No food logged yet today</p>
      </Card>
    );
  }

  const byMeal = foods.reduce((acc, food) => {
    acc[food.meal] = acc[food.meal] || [];
    acc[food.meal].push(food);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <div className="space-y-4">
      {(Object.keys(mealLabels) as Array<keyof typeof mealLabels>).map(meal => {
        const mealFoods = byMeal[meal];
        if (!mealFoods?.length) return null;
        
        return (
          <div key={meal}>
            <h3 className="text-sm font-medium text-muted mb-2">{mealLabels[meal]}</h3>
            <Card className="divide-y divide-background">
              {mealFoods.map(food => (
                <div key={food.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{food.name}</p>
                    <p className="text-sm text-muted">
                      {food.calories} cal • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">{formatTime(new Date(food.timestamp))}</span>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(food.id)}>✕</Button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        );
      })}
    </div>
  );
}