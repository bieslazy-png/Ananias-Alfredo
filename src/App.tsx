import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Syringe, 
  Activity, 
  LineChart,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from './hooks/useAppState';
import { cn } from './lib/utils';
import { useAuth } from './context/AuthContext';

// Views
import Dashboard from './views/Dashboard';
import Nutrition from './views/Nutrition';
import Medication from './views/Medication';
import Symptoms from './views/Symptoms';
import Evolution from './views/Evolution';

type Tab = 'dashboard' | 'nutrition' | 'medication' | 'symptoms' | 'evolution';

export default function App() {
  const { user, loading, signIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const appState = useAppState();

  const tabs = [
    { id: 'dashboard', label: 'Resumo', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils },
    { id: 'medication', label: 'Dose', icon: Syringe },
    { id: 'symptoms', label: 'Sintomas', icon: Activity },
    { id: 'evolution', label: 'Peso', icon: LineChart },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-brand-primary animate-pulse font-serif text-2xl italic">BodyReset</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen max-w-md mx-auto bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-brand-soft rounded-[40px] flex items-center justify-center text-brand-primary mb-8">
          <Activity size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-serif italic text-brand-secondary mb-4">BodyReset</h1>
        <p className="text-slate-500 mb-12 max-w-[280px]">
          Seu companheiro diário para uma jornada de saúde consciente e equilibrada.
        </p>
        <button 
          onClick={signIn}
          className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-teal-100 active:scale-[0.98] transition-transform"
        >
          <LogIn size={20} />
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif italic text-brand-secondary">BodyReset</h1>
            <p className="text-slate-500 text-sm">Olá, {appState.state.userName}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-soft border border-brand-primary/20 flex items-center justify-center text-brand-primary overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {activeTab === 'dashboard' && <Dashboard {...appState} />}
            {activeTab === 'nutrition' && <Nutrition {...appState} />}
            {activeTab === 'medication' && <Medication {...appState} />}
            {activeTab === 'symptoms' && <Symptoms {...appState} />}
            {activeTab === 'evolution' && <Evolution {...appState} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center py-3 px-2 z-50 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-brand-primary" : "text-slate-400"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-brand-soft" : "bg-transparent"
              )}>
                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                isActive ? "opacity-100" : "opacity-0 invisible h-0"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
