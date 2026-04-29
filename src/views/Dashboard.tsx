import React from 'react';
import { AppState, MealRecord } from '../types';
import { 
  ArrowUpRight, 
  Plus, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

type DashboardProps = {
  state: AppState;
  addWeight: (v: number) => void;
};

export default function Dashboard({ state }: DashboardProps) {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysMeals = state.meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === today);

  const dailyTotals = todaysMeals.reduce((acc, meal) => ({
    protein: acc.protein + meal.nutrients.protein,
    carbs: acc.carbs + meal.nutrients.carbs,
    fiber: acc.fiber + meal.nutrients.fiber,
    calories: acc.calories + meal.nutrients.calories,
  }), { protein: 0, carbs: 0, fiber: 0, calories: 0 });

  const latestWeight = state.weights.length > 0 ? state.weights[0].value : null;
  const lastMedication = state.medications.length > 0 ? state.medications[0] : null;

  return (
    <div className="space-y-6">
      {/* Weight Summary Card */}
      <section className="bg-brand-secondary text-white p-6 rounded-3xl relative overflow-hidden card-shadow">
        <div className="relative z-10">
          <span className="text-teal-100/80 text-xs font-medium uppercase tracking-[0.2em]">Progresso de Peso</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-bold">{latestWeight ? `${latestWeight}kg` : '--'}</h2>
            {latestWeight && state.weights.length > 1 && (
              <span className="text-xs flex items-center bg-white/20 px-2 py-0.5 rounded-full">
                {state.weights[0].value < state.weights[1].value ? '- ' : '+ '}
                {Math.abs(state.weights[0].value - state.weights[1].value).toFixed(1)}kg
              </span>
            )}
          </div>
          <p className="text-teal-50/60 text-xs mt-2 italic font-serif">Continue focado no seu objetivo!</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-4 right-6">
          <ArrowUpRight className="text-white/40" size={24} />
        </div>
      </section>

      {/* Medication Alert */}
      <section className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-orange-900">Próxima Aplicação</h3>
          <p className="text-xs text-orange-700">
            {state.medicationSchedule 
              ? `Agendado para ${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][state.medicationSchedule.weekday]}`
              : 'Nenhum agendamento configurado'}
          </p>
        </div>
      </section>

      {/* Daily Nutrients Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">Resumo do Dia</h3>
          <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase uppercase tracking-wider tabular-nums">
            {formatDate(Date.now())}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <NutrientCard label="Proteína" value={dailyTotals.protein} unit="g" icon="P" color="bg-blue-100 text-blue-700" target={100} />
          <NutrientCard label="Fibras" value={dailyTotals.fiber} unit="g" icon="F" color="bg-green-100 text-green-700" target={25} />
          <NutrientCard label="Carbtos" value={dailyTotals.carbs} unit="g" icon="C" color="bg-amber-100 text-amber-700" target={150} />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h3 className="font-semibold text-slate-700 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {todaysMeals.length === 0 ? (
           <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center space-y-2">
              <p className="text-slate-400 text-sm">Nenhuma refeição hoje</p>
              <button className="text-brand-primary text-xs font-bold inline-flex items-center gap-1">
                <Plus size={14} /> Adicionar Refeição
              </button>
           </div>
          ) : (
            todaysMeals.slice(0, 3).map(meal => (
              <div key={meal.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">{meal.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      {meal.nutrients.calories} kcal
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">PROT</span>
                  <span className="text-xs font-bold text-slate-700">{meal.nutrients.protein}g</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function NutrientCard({ label, value, unit, color, target }: { label: string, value: number, unit: string, icon: string, color: string, target: number }) {
  const percent = Math.min(Math.round((value / target) * 100), 100);
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-slate-800">{value}</span>
        <span className="text-[10px] text-slate-400 font-medium">{unit}</span>
      </div>
      <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", color.split(' ')[0])} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

const Utensils = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);
