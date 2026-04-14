import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { activityDatabase } from '../../data/foodDatabase';
import type { ActivityEntry } from '../../types';

interface ActivityPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
}

export default function ActivityPicker({ isOpen, onClose, onAdd }: ActivityPickerProps) {
  const [mode, setMode] = useState<'preset' | 'manual'>('preset');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [duration, setDuration] = useState('30');
  const [manualCalories, setManualCalories] = useState('');
  const [manualActivity, setManualActivity] = useState('');

  const handleAddPreset = () => {
    const activity = activityDatabase.find(a => a.id === selectedActivity);
    if (!activity) return;
    
    const mins = parseInt(duration);
    const calories = Math.round((activity.caloriesPerHour / 60) * mins);
    
    onAdd({
      activity: activity.name,
      calories,
      duration: mins,
    });
    handleClose();
  };

  const handleAddManual = () => {
    onAdd({
      activity: manualActivity || 'Custom Activity',
      calories: parseInt(manualCalories) || 0,
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedActivity(null);
    setDuration('30');
    setManualCalories('');
    setManualActivity('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Activity">
      <div className="space-y-4">
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
            variant={mode === 'manual' ? 'primary' : 'secondary'} 
            size="sm" 
            className="flex-1"
            onClick={() => setMode('manual')}
          >
            Manual
          </Button>
        </div>
        
        {mode === 'preset' ? (
          <>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {activityDatabase.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedActivity === activity.id
                      ? 'bg-secondary text-white'
                      : 'bg-background hover:bg-background/80'
                  }`}
                >
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-xs opacity-75">{activity.caloriesPerHour} cal/hour</div>
                </button>
              ))}
            </div>
            
            <Input
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
            
            {selectedActivity && duration && (
              <p className="text-center text-muted">
                ~{Math.round((activityDatabase.find(a => a.id === selectedActivity)?.caloriesPerHour || 0) / 60 * parseInt(duration))} calories
              </p>
            )}
            
            <Button 
              className="w-full" 
              disabled={!selectedActivity || !duration}
              onClick={handleAddPreset}
            >
              Add Activity
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Activity Name"
              value={manualActivity}
              onChange={e => setManualActivity(e.target.value)}
              placeholder="e.g., Hiking"
            />
            <Input
              label="Calories Burned"
              type="number"
              value={manualCalories}
              onChange={e => setManualCalories(e.target.value)}
              placeholder="0"
            />
            <Button 
              className="w-full" 
              disabled={!manualCalories}
              onClick={handleAddManual}
            >
              Add Activity
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
