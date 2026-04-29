export type NutrientInfo = {
  protein: number;
  carbs: number;
  fiber: number;
  calories: number;
};

export type MealRecord = {
  id: string;
  timestamp: number;
  name: string;
  nutrients: NutrientInfo;
};

export type MedicationRecord = {
  id: string;
  timestamp: number;
  medicationName: string;
  dose: string;
  site?: string; // Injection site
};

export type SymptomRecord = {
  id: string;
  timestamp: number;
  type: string;
  intensity: number; // 1-5
  note?: string;
};

export type WeightRecord = {
  id: string;
  timestamp: number;
  value: number; // in kg
};

export type AppState = {
  meals: MealRecord[];
  medications: MedicationRecord[];
  symptoms: SymptomRecord[];
  weights: WeightRecord[];
  userName: string;
  medicationSchedule: {
    weekday: number; // 0-6
    time: string; // HH:mm
    name: string;
  } | null;
};
