import Button from '../common/Button';

interface QuickAddButtonsProps {
  onAddFood: () => void;
  onAddActivity: () => void;
  onAddWater: () => void;
}

export default function QuickAddButtons({ onAddFood, onAddActivity, onAddWater }: QuickAddButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button variant="secondary" onClick={onAddFood} className="animate-fade-in-up stagger-4">
        🍎 Food
      </Button>
      <Button variant="secondary" onClick={onAddActivity} className="animate-fade-in-up stagger-5">
        🏃 Activity
      </Button>
      <Button variant="secondary" onClick={onAddWater} className="animate-fade-in-up stagger-5">
        💧 Water
      </Button>
    </div>
  );
}