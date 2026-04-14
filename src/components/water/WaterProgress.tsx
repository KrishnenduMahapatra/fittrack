import ProgressRing from '../common/ProgressRing';

interface WaterProgressProps {
  current: number;
  goal: number;
}

export default function WaterProgress({ current, goal }: WaterProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="flex flex-col items-center">
      <ProgressRing
        progress={percentage}
        size={160}
        strokeWidth={12}
        color="#3B82F6"
        value={`${Math.round(current / 1000 * 10) / 10}L`}
        label={`of ${goal / 1000}L`}
      />
      <p className="text-muted mt-4">
        {remaining > 0 ? `${remaining}ml remaining` : 'Goal reached!'}
      </p>
    </div>
  );
}