import { useState, useEffect, useCallback } from 'react';
import type { Profile, DailyData, FoodEntry, ActivityEntry } from '../types';
import { calculateBMR, calculateTDEE, calculateWaterGoal } from '../utils/calculations';
import { formatDate } from '../utils/formatters';
import { v4 as uuid } from 'uuid';

interface UserData {
  profile: Profile;
  dailyData: Record<string, DailyData>;
}

const STORAGE_KEY_USERS = 'fittrack_users';
const STORAGE_KEY_CURRENT = 'fittrack_current_user';

function loadFromStorage<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useFitTrack() {
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUsers = loadFromStorage<Record<string, UserData>>(STORAGE_KEY_USERS, {});
    const storedCurrent = loadFromStorage<string | null>(STORAGE_KEY_CURRENT, null);
    
    if (!storedCurrent || !storedUsers[storedCurrent]) {
      const userId = uuid();
      const defaultProfile: Profile = {
        id: userId,
        name: 'User 1',
        age: 0,
        gender: 'male',
        height: 0,
        weight: 0,
        activityLevel: 'moderate',
        bmr: 0,
        tdee: 0,
        waterGoal: 0,
        createdAt: new Date().toISOString()
      };
      const newUsers = {
        [userId]: { 
          profile: defaultProfile, 
          dailyData: {} 
        }
      };
      setUsers(newUsers);
      setCurrentUserId(userId);
    } else {
      setUsers(storedUsers);
      setCurrentUserId(storedCurrent);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      saveToStorage(STORAGE_KEY_USERS, users);
    }
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      saveToStorage(STORAGE_KEY_CURRENT, currentUserId);
    }
  }, [currentUserId]);

  const today = formatDate(new Date());
  
  const currentUser = currentUserId ? users[currentUserId] : null;
  const profile = currentUser?.profile || null;
  const dailyData = currentUser?.dailyData || {};

  const getUserList = useCallback((): { id: string; name: string }[] => {
    return Object.entries(users)
      .filter(([, u]) => u.profile?.name)
      .map(([id, u]) => ({ id, name: u.profile?.name || 'User' }));
  }, [users]);

  const createAndSaveUser = useCallback((data: Omit<Profile, 'id' | 'bmr' | 'tdee' | 'waterGoal' | 'createdAt'>): Profile => {
    const userId = uuid();
    const userCount = Object.keys(users).length;
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const waterGoal = calculateWaterGoal(data.weight);
    
    const newProfile: Profile = {
      ...data,
      id: userId,
      name: data.name || `User ${userCount + 1}`,
      bmr, tdee, waterGoal,
      createdAt: new Date().toISOString()
    };
    
    const newUsers = {
      ...users,
      [userId]: { 
        profile: newProfile, 
        dailyData: {} 
      }
    };
    
    setUsers(newUsers);
    setCurrentUserId(userId);
    return newProfile;
  }, [users]);

  const createNewUser = useCallback((): string => {
    const userId = uuid();
    const userCount = Object.keys(users).length;
    const defaultProfile: Profile = {
      id: userId,
      name: `User ${userCount + 1}`,
      age: 0,
      gender: 'male',
      height: 0,
      weight: 0,
      activityLevel: 'moderate',
      bmr: 0,
      tdee: 0,
      waterGoal: 0,
      createdAt: new Date().toISOString()
    };
    const newUsers = {
      ...users,
      [userId]: { 
        profile: defaultProfile, 
        dailyData: {} 
      }
    };
    setUsers(newUsers);
    setCurrentUserId(userId);
    return userId;
  }, [users]);

  const switchUser = useCallback((userId: string) => {
    if (users[userId]) setCurrentUserId(userId);
  }, [users]);

  const deleteUser = useCallback((userId?: string) => {
    const targetId = userId || currentUserId;
    console.log('deleteUser called', { targetId, currentUserId, users: Object.keys(users) });
    if (!targetId) return;
    
    const userCount = Object.keys(users).length;
    console.log('userCount:', userCount);
    if (userCount <= 1) {
      const newUserId = uuid();
      const defaultProfile: Profile = {
        id: newUserId,
        name: 'User 1',
        age: 0,
        gender: 'male',
        height: 0,
        weight: 0,
        activityLevel: 'moderate',
        bmr: 0,
        tdee: 0,
        waterGoal: 0,
        createdAt: new Date().toISOString()
      };
      const newUsers = {
        [newUserId]: { 
          profile: defaultProfile, 
          dailyData: {} 
        }
      };
      console.log('Resetting to new user:', newUserId);
      setUsers(newUsers);
      setCurrentUserId(newUserId);
      return;
    }
    
    const newUsers = { ...users };
    delete newUsers[targetId];
    console.log('After delete, remaining users:', Object.keys(newUsers));
    setUsers(newUsers);
    
    const remainingIds = Object.keys(newUsers);
    if (remainingIds.length > 0) {
      setCurrentUserId(remainingIds[0]);
    }
  }, [currentUserId, users]);

  const getTodayData = useCallback((): DailyData => {
    return dailyData[today] || { date: today, foods: [], activities: [], water: [] };
  }, [dailyData, today]);

  const saveProfile = useCallback((data: Omit<Profile, 'id' | 'bmr' | 'tdee' | 'waterGoal' | 'createdAt'>): Profile => {
    if (!currentUserId) return {} as Profile;
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const waterGoal = calculateWaterGoal(data.weight);
    const newProfile: Profile = {
      ...data,
      id: profile?.id || uuid(),
      bmr, tdee, waterGoal,
      createdAt: profile?.createdAt || new Date().toISOString()
    };
    setUsers({
      ...users,
      [currentUserId]: { ...users[currentUserId], profile: newProfile }
    });
    return newProfile;
  }, [currentUserId, profile, users]);

  const addFood = useCallback((food: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    if (!currentUserId) return null;
    const entry = { ...food, id: uuid(), timestamp: new Date().toISOString() };
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            foods: [...data.foods, entry] 
          } 
        } 
      }
    });
    return entry;
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const removeFood = useCallback((id: string) => {
    if (!currentUserId) return;
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            foods: data.foods.filter(f => f.id !== id) 
          } 
        } 
      }
    });
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const addActivity = useCallback((activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    if (!currentUserId) return null;
    const entry = { ...activity, id: uuid(), timestamp: new Date().toISOString() };
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            activities: [...data.activities, entry] 
          } 
        } 
      }
    });
    return entry;
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const removeActivity = useCallback((id: string) => {
    if (!currentUserId) return;
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            activities: data.activities.filter(a => a.id !== id) 
          } 
        } 
      }
    });
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const addWater = useCallback((amount: number) => {
    if (!currentUserId) return null;
    const entry = { id: uuid(), amount, timestamp: new Date().toISOString() };
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            water: [...(data.water || []), entry] 
          } 
        } 
      }
    });
    return entry;
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const removeWater = useCallback((id: string) => {
    if (!currentUserId) return;
    const data = getTodayData();
    setUsers({
      ...users,
      [currentUserId]: { 
        ...users[currentUserId], 
        dailyData: { 
          ...dailyData, 
          [today]: { 
            ...data, 
            water: (data.water || []).filter(w => w.id !== id) 
          } 
        } 
      }
    });
  }, [currentUserId, getTodayData, users, dailyData, today]);

  const getTodayCalories = useCallback(() => getTodayData().foods.reduce((s, f) => s + (f.calories || 0), 0), [getTodayData]);
  const getTodayProtein = useCallback(() => getTodayData().foods.reduce((s, f) => s + (f.protein || 0), 0), [getTodayData]);
  const getTodayCarbs = useCallback(() => getTodayData().foods.reduce((s, f) => s + (f.carbs || 0), 0), [getTodayData]);
  const getTodayFat = useCallback(() => getTodayData().foods.reduce((s, f) => s + (f.fat || 0), 0), [getTodayData]);
  const getTodayBurned = useCallback(() => getTodayData().activities.reduce((s, a) => s + (a.calories || 0), 0), [getTodayData]);
  const getTodayWater = useCallback(() => (getTodayData().water || []).reduce((s, w) => s + (w.amount || 0), 0), [getTodayData]);
  const getTodayActivities = useCallback(() => getTodayData().activities, [getTodayData]);

  const getWeeklyCalories = useCallback(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = formatDate(d);
      const day = dailyData[ds] || { foods: [], activities: [], water: [] };
      result.push({
        date: ds,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: day.foods.reduce((s, f) => s + (f.calories || 0), 0),
        burned: day.activities.reduce((s, a) => s + (a.calories || 0), 0),
        netCalories: 0,
        water: (day.water || []).reduce((s, w) => s + (w.amount || 0), 0)
      });
    }
    return result;
  }, [dailyData, today]);

  const getStreak = useCallback(() => {
    const dates = Object.keys(dailyData).sort().reverse();
    if (!dates.length) return 0;
    let streak = 0;
    const td = new Date();
    for (let i = 0; i < dates.length; i++) {
      const cd = new Date(td);
      cd.setDate(cd.getDate() - i);
      if (dates.includes(formatDate(cd))) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [dailyData]);

  return {
    profile, 
    users: getUserList(), 
    currentUserId,
    switchUser, 
    createNewUser, 
    createAndSaveUser,
    saveProfile, 
    deleteUser,
    addFood, 
    removeFood, 
    addActivity, 
    removeActivity, 
    addWater, 
    removeWater,
    getTodayCalories, 
    getTodayProtein, 
    getTodayCarbs, 
    getTodayFat,
    getTodayBurned, 
    getTodayWater, 
    getTodayActivities, 
    getWeeklyCalories,
    getStreak, 
    getTodayData
  };
}
