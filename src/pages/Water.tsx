import Button from '../components/common/Button';
import Card from '../components/common/Card';
import WaterProgress from '../components/water/WaterProgress';
import { useFitTrackContext } from '../context/FitTrackContext';
import { formatWater } from '../utils/formatters';
import type { WaterEntry } from '../types';

export default function Water() {
  const { profile, addWater, removeWater, getTodayWater, getTodayData } = useFitTrackContext();
  
  const current = getTodayWater();
  const goal = profile?.waterGoal || 2000;
  const waterData = getTodayData().water || [];

  const quickAmounts = [
    { label: '250ml', value: 250 },
    { label: '500ml', value: 500 },
    { label: '750ml', value: 750 },
  ];

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Water</h2>
      
      <Card>
        <WaterProgress current={current} goal={goal} />
      </Card>
      
      <div className="grid grid-cols-3 gap-3">
        {quickAmounts.map(amount => (
          <Button
            key={amount.value}
            variant="secondary"
            onClick={() => addWater(amount.value)}
          >
            {amount.label}
          </Button>
        ))}
      </div>
      
      <Card>
        <h3 className="font-semibold mb-3">Today</h3>
        {waterData.length === 0 ? (
          <p className="text-muted text-center py-4">No water logged yet</p>
        ) : (
          <div className="space-y-2">
            {waterData.slice().reverse().map((entry: WaterEntry) => (
              <div key={entry.id} className="flex justify-between items-center py-2 border-b border-background last:border-0">
                <span>{formatWater(entry.amount)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <button 
                    onClick={() => removeWater(entry.id)}
                    className="text-danger hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}