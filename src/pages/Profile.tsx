import ProfileForm from '../components/profile/ProfileForm';
import Card from '../components/common/Card';
import { useFitTrack } from '../hooks/useFitTrack';

export default function Profile() {
  const { profile, saveProfile, deleteProfile } = useFitTrack();

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Profile</h2>
      
      {profile && (
        <Card className="space-y-3">
          <h3 className="font-semibold text-lg">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted">BMR</span>
              <p className="text-xl font-bold">{profile.bmr} cal</p>
            </div>
            <div>
              <span className="text-muted">Daily Target</span>
              <p className="text-xl font-bold text-primary">{profile.tdee} cal</p>
            </div>
            <div>
              <span className="text-muted">Water Goal</span>
              <p className="text-xl font-bold">{(profile.waterGoal / 1000).toFixed(1)}L</p>
            </div>
          </div>
        </Card>
      )}
      
      <Card>
        <ProfileForm
          profile={profile}
          onSave={saveProfile}
          onDelete={deleteProfile}
        />
      </Card>
    </div>
  );
}