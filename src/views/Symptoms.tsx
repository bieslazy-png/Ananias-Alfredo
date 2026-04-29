import React, { useState } from 'react';
import { AppState, SymptomRecord } from '../types';
import { Plus, Activity, X, Info, Clock } from 'lucide-react';
import { cn, formatDate, formatTime, SYMPTOM_TYPES } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type SymptomsProps = {
  state: AppState;
  addSymptom: (s: Omit<SymptomRecord, 'id' | 'timestamp'>) => void;
};

export default function Symptoms({ state, addSymptom }: SymptomsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSymptom, setNewSymptom] = useState({ type: '', intensity: 3, note: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptom.type) return;
    addSymptom(newSymptom);
    setNewSymptom({ type: '', intensity: 3, note: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center text-slate-800">
        <h2 className="text-xl font-bold">Registro de Sintomas</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-teal-200"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Daily Summary / Advisory */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
        <div className="text-blue-500 shrink-0"><Info size={18} /></div>
        <p className="text-xs text-blue-700 leading-relaxed">
          Monitorar seus sintomas ajuda a ajustar sua dose e dieta com segurança. Procure seu médico se os sintomas forem persistentes.
        </p>
      </div>

      {/* Symptom History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Clock size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Histórico Recente</h3>
        </div>

        {state.symptoms.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
            <Activity size={32} />
            <p className="text-sm font-medium">Nenhum sintoma registrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.symptoms.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-1.5 h-10 rounded-full",
                    s.intensity >= 4 ? "bg-red-400" : s.intensity >= 2 ? "bg-amber-400" : "bg-green-400"
                  )} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{s.type}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{formatDate(s.timestamp)} • {formatTime(s.timestamp)}</span>
                    {s.note && <p className="text-[10px] text-slate-500 mt-1 italic">"{s.note}"</p>}
                  </div>
                </div>
                <div className="text-center">
                   <span className="text-[10px] font-black text-slate-300 block leading-none">NÍVEL</span>
                   <span className={cn(
                     "text-lg font-black leading-none",
                     s.intensity >= 4 ? "text-red-500" : s.intensity >= 2 ? "text-amber-500" : "text-green-500"
                   )}>{s.intensity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Symptom Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">O que você está sentindo?</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOM_TYPES.map(type => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => setNewSymptom(p => ({...p, type}))}
                      className={cn(
                        "py-3 px-2 text-xs font-bold rounded-2xl border transition-all",
                        newSymptom.type === type 
                          ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-teal-100" 
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Intensidade (1 a 5)</label>
                    <span className="text-sm font-bold text-brand-primary leading-none">{newSymptom.intensity}</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" step="1"
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    value={newSymptom.intensity}
                    onChange={e => setNewSymptom(p => ({...p, intensity: parseInt(e.target.value)}))}
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase px-1">
                    <span>Leve</span>
                    <span>Moderado</span>
                    <span>Forte</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Notas (Opcional)</label>
                  <input 
                    placeholder="Algo mais específico?"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none"
                    value={newSymptom.note}
                    onChange={e => setNewSymptom(p => ({...p, note: e.target.value}))}
                  />
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-teal-200">Salvar Registro</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
