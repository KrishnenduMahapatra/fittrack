import type { ActivityEntry } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatTime } from '../../utils/formatters';

interface ActivityListProps {
  activities: ActivityEntry[];
  onDelete: (id: string) => void;
}

export default function ActivityList({ activities, onDelete }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-muted">No activities logged yet today</p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-background">
      {activities.map(activity => (
        <div key={activity.id} className="py-3 flex justify-between items-center">
          <div>
            <p className="font-medium">{activity.activity}</p>
            <p className="text-sm text-muted">
              {activity.duration ? `${activity.duration} min • ` : ''}{activity.calories} cal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{formatTime(new Date(activity.timestamp))}</span>
            <Button variant="ghost" size="sm" onClick={() => onDelete(activity.id)}>✕</Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
