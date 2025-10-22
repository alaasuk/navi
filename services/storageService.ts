import { SavedPlan } from '../types';

const STORAGE_KEY = 'addressNavigator_savedPlans';

export function getSavedPlans(): SavedPlan[] {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Failed to parse saved plans from localStorage", error);
    return [];
  }
}

function savePlans(plans: SavedPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Failed to save plans to localStorage", error);
    throw new Error("Could not save the plan. The browser's local storage might be full.");
  }
}

export function addPlan(newPlan: SavedPlan): SavedPlan[] {
  const plans = getSavedPlans();
  const updatedPlans = [newPlan, ...plans];
  savePlans(updatedPlans);
  return updatedPlans;
}

export function deletePlan(planId: string): SavedPlan[] {
  const plans = getSavedPlans();
  const updatedPlans = plans.filter(plan => plan.id !== planId);
  savePlans(updatedPlans);
  return updatedPlans;
}