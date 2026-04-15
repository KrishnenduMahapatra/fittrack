import { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ActivityPicker from '../components/activity/ActivityPicker';
import ActivityList from '../components/activity/ActivityList';
import { useFitTrackContext } from '../context/FitTrackContext';

export default function Activity() {
  const [showPicker, setShowPicker] = useState(false);
  const { addActivity, removeActivity, getTodayBurned, getTodayData } = useFitTrackContext();

  const burned = getTodayBurned();
  const todayActivities = getTodayData().activities || [];

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Activity</h2>
      
      <Card>
        <div className="text-center">
          <p className="text-muted text-sm">Calories Burned Today</p>
          <p className="text-4xl font-bold text-accent">{burned}</p>
          <p className="text-muted">calories</p>
        </div>
      </Card>
      
      <Button className="w-full" onClick={() => setShowPicker(true)}>
        + Add Activity
      </Button>
      
      <ActivityList activities={todayActivities} onDelete={removeActivity} />
      
      <ActivityPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={addActivity}
      />
    </div>
  );
}
