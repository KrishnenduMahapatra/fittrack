import type { Profile } from '../types';
import { useState } from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useFitTrackContext } from '../context/FitTrackContext';

export default function Profile() {
  const { profile, saveProfile, deleteUser, createAndSaveUser, switchUser, users, currentUserId } = useFitTrackContext();
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  const userList = users;
  const userCount = userList.length;
  const isProfileSet = profile && profile.age > 0;

  const handleAddNewUser = () => {
    setShowNewUserForm(true);
  };

  const handleSaveNewUser = (data: Omit<Profile, 'id' | 'bmr' | 'tdee' | 'waterGoal' | 'createdAt'>): Profile => {
    const newProfile = createAndSaveUser(data);
    setShowNewUserForm(false);
    return newProfile;
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Profile</h2>
      
      {isProfileSet && (
        <>
          {userCount > 1 && (
            <Card>
              <h3 className="font-semibold mb-3">Switch User</h3>
              <div className="space-y-2">
                {userList.map(u => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      u.id === currentUserId ? 'bg-primary text-white' : 'bg-background'
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </Card>
          )}
          
          <Button variant="secondary" onClick={handleAddNewUser}>
            + Add New User
          </Button>
          
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
        </>
      )}
      
      {showNewUserForm ? (
        <Card>
          <h3 className="font-semibold mb-3">Create New User</h3>
          <ProfileForm
            profile={null}
            onSave={handleSaveNewUser}
            onDelete={() => setShowNewUserForm(false)}
          />
          <Button 
            variant="secondary" 
            className="w-full mt-3"
            onClick={() => setShowNewUserForm(false)}
          >
            Cancel
          </Button>
        </Card>
      ) : (
        <Card>
          <ProfileForm
            profile={profile}
            onSave={saveProfile}
            onDelete={deleteUser}
          />
          {!isProfileSet && (
            <Button variant="secondary" className="w-full mt-3" onClick={handleAddNewUser}>
              + Add Another User
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
