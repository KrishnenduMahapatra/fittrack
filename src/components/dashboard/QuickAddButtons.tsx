import Button from '../common/Button';

interface QuickAddButtonsProps {
  onAddFood: () => void;
  onAddActivity: () => void;
  onAddWater: () => void;
}

export default function QuickAddButtons({ onAddFood, onAddActivity, onAddWater }: QuickAddButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button variant="secondary" onClick={onAddFood}>
        🍎 Food
      </Button>
      <Button variant="secondary" onClick={onAddActivity}>
        🏃 Activity
      </Button>
      <Button variant="secondary" onClick={onAddWater}>
        💧 Water
      </Button>
    </div>
  );
}