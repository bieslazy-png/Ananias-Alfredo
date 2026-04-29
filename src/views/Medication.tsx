import React, { useState } from 'react';
import { AppState, MedicationRecord } from '../types';
import { Plus, Syringe, History, Calendar, Bell, Trash2 } from 'lucide-react';
import { cn, formatDate, formatTime, MEDICATION_DOSES } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type MedicationProps = {
  state: AppState;
  addMedication: (med: Omit<MedicationRecord, 'id' | 'timestamp'>) => void;
  setMedicationSchedule: (s: AppState['medicationSchedule']) => void;
};

export default function Medication({ state, addMedication, setMedicationSchedule }: MedicationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingSchedule, setIsSettingSchedule] = useState(false);
  const [newMed, setNewMed] = useState({ medicationName: 'Ozempic', dose: '0.25mg', site: 'Abdômen Dir' });

  const latestMed = state.medications.length > 0 ? state.medications[0] : null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedication(newMed);
    setIsAdding(false);
  };

  const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center text-slate-800">
        <h2 className="text-xl font-bold">Acompanhamento</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-teal-200"
        >
          <Plus size={18} />
          Registrar Dose
        </button>
      </header>

      {/* Next Dose Indicator */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 card-shadow relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Próxima Aplicação</span>
            <h3 className="text-2xl font-serif italic text-brand-primary">
              {state.medicationSchedule ? WEEKDAYS[state.medicationSchedule.weekday] : 'Não agendado'}
            </h3>
            <p className="text-xs text-slate-500">
              {state.medicationSchedule ? `Lembrete às ${state.medicationSchedule.time}` : 'Defina seu dia de aplicação'}
            </p>
          </div>
          <button 
            onClick={() => setIsSettingSchedule(true)}
            className="p-2 bg-brand-soft text-brand-primary rounded-xl"
          >
            <Bell size={20} />
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-soft rounded-full -z-0 blur-xl" />
      </div>

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <History size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Histórico de doses</h3>
        </div>
        
        {state.medications.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
            <p className="text-sm">Nenhuma aplicação registrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.medications.map((med, idx) => (
              <div key={med.id} className="relative pl-6">
                {idx !== state.medications.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-[-15px] w-0.5 bg-slate-100" />
                )}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-brand-primary bg-white z-10" />
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center active:scale-[0.99] transition-transform">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{med.dose} - {med.medicationName}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDate(med.timestamp)} • {formatTime(med.timestamp)}
                    </span>
                    {med.site && (
                      <span className="ml-2 py-0.5 px-1.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">
                        {med.site}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Dose Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Registrar Aplicação</h3>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Medicamento</label>
                    <select 
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none"
                      onChange={e => setNewMed(p => ({...p, medicationName: e.target.value}))}
                    >
                      <option>Ozempic</option>
                      <option>Mounjaro</option>
                      <option>Wegovy</option>
                      <option>Saxenda</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Dose</label>
                    <select 
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none"
                      onChange={e => setNewMed(p => ({...p, dose: e.target.value}))}
                    >
                      {MEDICATION_DOSES.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Local da Aplicação</label>
                  <input 
                    placeholder="Ex: Abdômen Dir, Coxa Esq"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none"
                    onChange={e => setNewMed(p => ({...p, site: e.target.value}))}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl">Confirmar Aplicação</button>
              </form>
            </motion.div>
          </>
        )}

        {isSettingSchedule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingSchedule(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Programar Lembrete</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Dia da Semana</label>
                  <div className="grid grid-cols-4 gap-2">
                    {WEEKDAYS.map((day, i) => (
                      <button 
                        key={day}
                        onClick={() => setMedicationSchedule({ weekday: i, time: state.medicationSchedule?.time || '08:00', name: 'Aplicação' })}
                        className={cn(
                          "py-2 text-[10px] font-bold rounded-xl border transition-all",
                          state.medicationSchedule?.weekday === i 
                            ? "bg-brand-primary text-white border-brand-primary" 
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        )}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setIsSettingSchedule(false)} 
                  className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl"
                >
                  Salvar Programação
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
