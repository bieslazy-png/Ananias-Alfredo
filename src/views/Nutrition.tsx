import React, { useState } from 'react';
import { AppState, MealRecord } from '../types';
import { Plus, Utensils, X, ChevronRight } from 'lucide-react';
import { cn, formatTime } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type NutritionProps = {
  state: AppState;
  addMeal: (meal: Omit<MealRecord, 'id' | 'timestamp'>) => void;
};

export default function Nutrition({ state, addMeal }: NutritionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    nutrients: { protein: 0, carbs: 0, fiber: 0, calories: 0 }
  });

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysMeals = state.meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.name) return;
    addMeal(newMeal);
    setNewMeal({ name: '', nutrients: { protein: 0, carbs: 0, fiber: 0, calories: 0 } });
    setIsAdding(false);
  };

  const handleNutrientChange = (key: keyof typeof newMeal.nutrients, val: string) => {
    const num = parseInt(val) || 0;
    setNewMeal(prev => ({
      ...prev,
      nutrients: { ...prev.nutrients, [key]: num }
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Diário Alimentar</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-teal-200"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Progress Circles or Bars would go here */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proteína</span>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
              <circle 
                cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" 
                className="text-brand-primary transition-all duration-1000" 
                strokeDasharray={175.9} 
                strokeDashoffset={175.9 * (1 - Math.min(todaysMeals.reduce((acc, m) => acc + m.nutrients.protein, 0) / 100, 1))} 
              />
            </svg>
            <span className="absolute text-sm font-bold">{todaysMeals.reduce((acc, m) => acc + m.nutrients.protein, 0)}g</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fibras</span>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
              <circle 
                cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" 
                className="text-green-500 transition-all duration-1000" 
                strokeDasharray={175.9} 
                strokeDashoffset={175.9 * (1 - Math.min(todaysMeals.reduce((acc, m) => acc + m.nutrients.fiber, 0) / 25, 1))} 
              />
            </svg>
            <span className="absolute text-sm font-bold">{todaysMeals.reduce((acc, m) => acc + m.nutrients.fiber, 0)}g</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Refeições de Hoje</h3>
        {todaysMeals.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
            <Utensils size={32} />
            <p className="text-sm font-medium">Nenhum registro ainda</p>
          </div>
        ) : (
          todaysMeals.map((meal) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={meal.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <Utensils size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{meal.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{formatTime(meal.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 block">{meal.nutrients.calories}</span>
                  <span className="text-[8px] text-slate-400 uppercase font-black">kcal</span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Nova Refeição</h3>
                <button onClick={() => setIsAdding(false)} className="bg-slate-50 p-2 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nome da Refeição</label>
                  <input 
                    autoFocus
                    placeholder="Ex: Almoço Saudável"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-primary placeholder:text-slate-300"
                    value={newMeal.name}
                    onChange={e => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Calorias (kcal)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-primary"
                      onChange={e => handleNutrientChange('calories', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Proteína (g)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-primary"
                      onChange={e => handleNutrientChange('protein', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Carbtos (g)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-primary"
                      onChange={e => handleNutrientChange('carbs', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Fibras (g)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-primary"
                      onChange={e => handleNutrientChange('fiber', e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-teal-200 mt-4 active:scale-[0.98] transition-transform"
                >
                  Salvar Refeição
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
