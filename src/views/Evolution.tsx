import React, { useState, useMemo } from 'react';
import { AppState, WeightRecord } from '../types';
import { Plus, LineChart as ChartIcon, Scale, TrendingDown, Target } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

type EvolutionProps = {
  state: AppState;
  addWeight: (v: number) => void;
};

export default function Evolution({ state, addWeight }: EvolutionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const chartData = useMemo(() => {
    return [...state.weights].reverse().map(w => ({
      date: new Date(w.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      weight: w.value
    }));
  }, [state.weights]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (isNaN(val)) return;
    addWeight(val);
    setNewWeight('');
    setIsAdding(false);
  };

  const latest = state.weights.length > 0 ? state.weights[0].value : null;
  const first = state.weights.length > 0 ? state.weights[state.weights.length - 1].value : null;
  const totalChange = latest && first ? (latest - first).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center text-slate-800">
        <h2 className="text-xl font-bold">Evolução do Peso</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-teal-200"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-teal-50 text-brand-primary rounded-lg">
              <Scale size={16} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atual</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{latest ? `${latest}kg` : '--'}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg">
              <TrendingDown size={16} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso Total</span>
          </div>
          <p className={cn(
            "text-2xl font-black",
            (parseFloat(totalChange || '0') < 0) ? "text-green-500" : "text-slate-800"
          )}>
            {totalChange ? `${totalChange}kg` : '--'}
          </p>
        </div>
      </div>

      {/* Evolution Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 card-shadow h-72 w-full">
         <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-700">Gráfico de Evolução</h3>
            <p className="text-[10px] text-slate-400">Dados baseados nos seus últimos registros</p>
         </div>
         {state.weights.length < 2 ? (
           <div className="h-40 flex flex-center flex-col items-center justify-center gap-2 opacity-30">
              <ChartIcon size={32} />
              <p className="text-xs font-medium">Registre pelo menos 2 pesos</p>
           </div>
         ) : (
           <div className="h-44 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#14b8a6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         )}
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Histórico</h3>
        <div className="space-y-2">
          {state.weights.map((w, idx) => (
            <div key={w.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">{w.value}kg</p>
                <p className="text-[10px] text-slate-400 font-medium">{formatDate(w.timestamp)}</p>
              </div>
              {idx < state.weights.length - 1 && (
                <div className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  w.value < state.weights[idx+1].value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {w.value < state.weights[idx+1].value ? '-' : '+'} 
                  {Math.abs(w.value - state.weights[idx+1].value).toFixed(1)}kg
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6 text-center">Registrar Peso Atual</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                   <input 
                    autoFocus
                    type="number"
                    step="0.1"
                    placeholder="00.0"
                    className="w-full text-6xl font-black text-center py-8 focus:outline-none placeholder:text-slate-100 text-brand-primary"
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                  />
                  <span className="absolute bottom-10 right-10 text-xl font-bold text-slate-300">kg</span>
                </div>
                <button type="submit" className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-teal-200">Confirmar Peso</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
