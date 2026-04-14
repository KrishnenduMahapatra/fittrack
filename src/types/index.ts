export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'very_active';
  bodyFat?: number;
  bmr: number;
  tdee: number;
  waterGoal: number;
  createdAt: string;
}

export interface FoodEntry {
  id: string;
  foodId?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface ActivityEntry {
  id: string;
  activity: string;
  calories: number;
  duration?: number;
  timestamp: string;
}

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: string;
}

export interface DailyData {
  date: string;
  foods: FoodEntry[];
  activities: ActivityEntry[];
  water: WaterEntry[];
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ActivityItem {
  id: string;
  name: string;
  caloriesPerHour: number;
}