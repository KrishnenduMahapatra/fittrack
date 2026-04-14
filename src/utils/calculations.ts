export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.375,
    active: 1.55,
    very_active: 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

export function calculateWaterGoal(weight: number): number {
  return Math.round(35 * weight);
}

export function calculateCaloriesRemaining(
  tdee: number,
  consumed: number,
  burned: number
): number {
  return tdee - consumed + burned;
}