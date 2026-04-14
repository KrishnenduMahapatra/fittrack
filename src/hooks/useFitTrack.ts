import { useLocalStorage } from './useLocalStorage';
import type { Profile, DailyData } from '../types';
import { calculateBMR, calculateTDEE, calculateWaterGoal } from '../utils/calculations';
import { formatDate } from '../utils/formatters';
import { v4 as uuid } from 'uuid';

export function useFitTrack() {
  const [profile, setProfile] = useLocalStorage<Profile | null>('fittrack_profile', null);
  const [dailyData, setDailyData] = useLocalStorage<Record<string, DailyData>>('fittrack_data', {});

  const today = formatDate(new Date());
  const todayData = dailyData[today] || { date: today, foods: [], activities: [], water: [] };

  const saveProfile = (data: Omit<Profile, 'id' | 'bmr' | 'tdee' | 'waterGoal' | 'createdAt'>) => {
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const waterGoal = calculateWaterGoal(data.weight);
    
    const newProfile: Profile = {
      ...data,
      id: profile?.id || uuid(),
      bmr,
      tdee,
      waterGoal,
      createdAt: profile?.createdAt || new Date().toISOString(),
    };
    setProfile(newProfile);
    return newProfile;
  };

  const deleteProfile = () => {
    setProfile(null);
  };

  const addFood = (food: Omit<import('../types').FoodEntry, 'id' | 'timestamp'>) => {
    const entry = { ...food, id: uuid(), timestamp: new Date().toISOString() };
    const updated = { ...todayData, foods: [...todayData.foods, entry] };
    setDailyData({ ...dailyData, [today]: updated });
    return entry;
  };

  const removeFood = (id: string) => {
    const updated = { ...todayData, foods: todayData.foods.filter(f => f.id !== id) };
    setDailyData({ ...dailyData, [today]: updated });
  };

  const addActivity = (activity: Omit<import('../types').ActivityEntry, 'id' | 'timestamp'>) => {
    const entry = { ...activity, id: uuid(), timestamp: new Date().toISOString() };
    const updated = { ...todayData, activities: [...todayData.activities, entry] };
    setDailyData({ ...dailyData, [today]: updated });
    return entry;
  };

  const removeActivity = (id: string) => {
    const updated = { ...todayData, activities: todayData.activities.filter(a => a.id !== id) };
    setDailyData({ ...dailyData, [today]: updated });
  };

  const addWater = (amount: number) => {
    const entry = { id: uuid(), amount, timestamp: new Date().toISOString() };
    const updated = { ...todayData, water: [...todayData.water, entry] };
    setDailyData({ ...dailyData, [today]: updated });
    return entry;
  };

  const getTodayCalories = () => todayData.foods.reduce((sum, f) => sum + f.calories, 0);
  const getTodayProtein = () => todayData.foods.reduce((sum, f) => sum + f.protein, 0);
  const getTodayCarbs = () => todayData.foods.reduce((sum, f) => sum + f.carbs, 0);
  const getTodayFat = () => todayData.foods.reduce((sum, f) => sum + f.fat, 0);
  const getTodayBurned = () => todayData.activities.reduce((sum, a) => sum + a.calories, 0);
  const getTodayWater = () => todayData.water.reduce((sum, w) => sum + w.amount, 0);

  return {
    profile,
    saveProfile,
    deleteProfile,
    addFood,
    removeFood,
    addActivity,
    removeActivity,
    addWater,
    getTodayCalories,
    getTodayProtein,
    getTodayCarbs,
    getTodayFat,
    getTodayBurned,
    getTodayWater,
    todayData,
  };
}