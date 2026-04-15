import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import type { Profile } from '../../types';

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (data: Omit<Profile, 'id' | 'bmr' | 'tdee' | 'waterGoal' | 'createdAt'>) => Profile;
  onDelete: () => void;
}

export default function ProfileForm({ profile, onSave, onDelete }: ProfileFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bodyFat, setBodyFat] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (profile && profile.age > 0) {
      setName(profile.name);
      setAge(profile.age.toString());
      setGender(profile.gender);
      setHeight(profile.height.toString());
      setWeight(profile.weight.toString());
      setActivityLevel(profile.activityLevel);
      setBodyFat(profile.bodyFat?.toString() || '');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel: activityLevel as 'sedentary' | 'moderate' | 'active' | 'very_active',
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
    });
  };

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (hard exercise daily)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="25"
          required
        />
        
        <Select
          label="Gender"
          value={gender}
          onChange={e => setGender(e.target.value as 'male' | 'female')}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Height (cm)"
          type="number"
          value={height}
          onChange={e => setHeight(e.target.value)}
          placeholder="175"
          required
        />
        
        <Input
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="70"
          required
        />
      </div>
      
      <Select
        label="Activity Level"
        value={activityLevel}
        onChange={e => setActivityLevel(e.target.value)}
        options={activityOptions}
      />
      
      <Input
        label="Body Fat % (optional)"
        type="number"
        value={bodyFat}
        onChange={e => setBodyFat(e.target.value)}
        placeholder="15"
      />
      
      <div className="pt-4 space-y-3">
        <Button type="submit" className="w-full">
          {profile ? 'Update Profile' : 'Save Profile'}
        </Button>
        
        {profile && profile.age > 0 ? (
          <Button
            type="button"
            variant="danger"
            className="w-full"
            onClick={() => setShowDelete(true)}
          >
            Delete Profile
          </Button>
        ) : null}
      </div>
      
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Delete Profile?</h3>
            <p className="text-muted mb-4">This will delete all your data. This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={() => {
                if (onDelete) {
                  onDelete();
                  setShowDelete(false);
                }
              }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}