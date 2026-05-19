/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Thermometer, 
  Clock, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  AlertTriangle,
  Mic,
  Plus,
  X,
  Timer
} from 'lucide-react';

// --- Types ---
type Tab = 'music' | 'sensing' | 'alarm';

interface Reminder {
  id: string;
  time: string;
  label: string;
  isDaily: boolean;
  active: boolean;
}

// --- Mock Data ---
const INITIAL_REMINDERS: Reminder[] = [
  { id: '1', time: '07:00', label: '起床鬧鐘', isDaily: true, active: true },
  { id: '2', time: '18:30', label: '晾衣服', isDaily: false, active: true },
  { id: '3', time: '20:00', label: '寫作業', isDaily: false, active: true },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('music');
  const [musicVolume, setMusicVolume] = useState(65);
  const [systemVolume, setSystemVolume] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [smokeLevel, setSmokeLevel] = useState(45);
  const [humidity, setHumidity] = useState(55);
  const [temperature, setTemperature] = useState(24.5);

  // Auto-switch smoke level for demo warning
  useEffect(() => {
    const interval = setInterval(() => {
      setSmokeLevel(prev => (prev > 80 ? 45 : prev + 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'music':
        return <MusicScreen 
          musicVolume={musicVolume} 
          setMusicVolume={setMusicVolume}
          systemVolume={systemVolume}
          setSystemVolume={setSystemVolume}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />;
      case 'sensing':
        return <SensingScreen 
          smokeLevel={smokeLevel}
          humidity={humidity}
          temperature={temperature}
        />;
      case 'alarm':
        return <AlarmScreen 
          reminders={reminders}
          setReminders={setReminders}
        />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <header className="p-4 bg-white border-b border-slate-100 flex justify-between items-center z-10">
        <h1 className="text-xl font-display font-bold text-slate-800">
          {activeTab === 'music' && '音樂播放'}
          {activeTab === 'sensing' && '環境感測'}
          {activeTab === 'alarm' && '智能鬧鐘'}
        </h1>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Connected</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav id="bottom-nav" className="bg-white border-t border-slate-100 flex justify-around p-3 pb-6">
        <NavButton 
          id="nav-music"
          active={activeTab === 'music'} 
          onClick={() => setActiveTab('music')} 
          icon={<Music />} 
          label="音樂" 
        />
        <NavButton 
          id="nav-sensing"
          active={activeTab === 'sensing'} 
          onClick={() => setActiveTab('sensing')} 
          icon={<Thermometer />} 
          label="感測" 
        />
        <NavButton 
          id="nav-alarm"
          active={activeTab === 'alarm'} 
          onClick={() => setActiveTab('alarm')} 
          icon={<Clock />} 
          label="鬧鐘" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, id }: { active: boolean, onClick: () => void, icon: ReactNode, label: string, id: string }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-blue-50' : ''}`}>
        {icon}
      </div>
      <span className="text-xs font-semibold">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" 
        />
      )}
    </button>
  );
}

// --- Screens Components ---

function MusicScreen({ musicVolume, setMusicVolume, systemVolume, setSystemVolume, isPlaying, setIsPlaying }: any) {
  return (
    <div className="p-6 space-y-8 flex flex-col h-full">
      {/* Volume Controls */}
      <div className="space-y-6">
        <VolumeSlider 
          id="music-volume"
          label="音樂聲量" 
          value={musicVolume} 
          onChange={setMusicVolume} 
          icon={<Music size={18} />} 
        />
        <VolumeSlider 
          id="system-volume"
          label="系統聲量 (鬧鐘,通知)" 
          value={systemVolume} 
          onChange={setSystemVolume} 
          icon={<Volume2 size={18} />} 
        />
      </div>

      {/* Visual Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full aspect-square max-w-[280px] bg-slate-100 rounded-3xl overflow-hidden shadow-inner group">
          <img 
            src="https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=2069&auto=format&fit=crop" 
            alt="Nature visualization"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
            <div className="text-white">
              <p className="text-xs font-medium opacity-80">Playing</p>
              <h3 className="text-lg font-bold">Forest Morning Ambience</h3>
            </div>
          </div>
          {isPlaying && (
            <div className="absolute top-4 right-4 flex gap-1 items-end h-8">
              {[0, 1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  animate={{ height: [8, 24, 12, 28, 8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1 bg-blue-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex justify-center items-center gap-8 pb-4">
        <button id="btn-prev" className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
          <SkipBack size={28} />
        </button>
        <button 
          id="btn-play-pause"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button id="btn-next" className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
          <SkipForward size={28} />
        </button>
      </div>
    </div>
  );
}

function VolumeSlider({ label, value, onChange, icon, id }: { label: string, value: number, onChange: (v: number) => void, icon: ReactNode, id: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-slate-500">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-xs font-mono">{value}%</span>
      </div>
      <div className="relative flex items-center">
        <input 
          id={id}
          type="range" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}

function SensingScreen({ smokeLevel, humidity, temperature }: any) {
  const isHighSmoke = smokeLevel > 70;

  return (
    <div className="p-6 space-y-10 flex flex-col items-center">
      {/* Hexagonal Metrics */}
      <div className="relative w-full max-w-[320px] aspect-[4/5] mt-4">
        {/* Air Concentration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <HexagonMetric 
            id="smoke-level"
            label="空氣濃度" 
            value={`${smokeLevel}%`} 
            color={isHighSmoke ? 'bg-red-500' : 'bg-blue-500'} 
          />
        </div>
        
        {/* Humidity */}
        <div className="absolute top-[35%] left-0">
          <HexagonMetric 
            id="humidity"
            label="濕度" 
            value={`${humidity}%`} 
            color="bg-teal-500" 
          />
        </div>

        {/* Temperature */}
        <div className="absolute top-[35%] right-0">
          <HexagonMetric 
            id="temperature"
            label="溫度" 
            value={`${temperature}°C`} 
            color="bg-orange-500" 
          />
        </div>
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {isHighSmoke && (
          <motion.div 
            id="smoke-alert"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-between text-red-700 shadow-sm"
          >
            <AlertTriangle className="animate-bounce" />
            <span className="font-bold text-sm tracking-tight uppercase">警告！煙霧濃度過高</span>
            <AlertTriangle className="animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button 
          id="btn-sensing-close"
          className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
        >
          <X size={20} />
          <span>關閉</span>
        </button>
        <button 
          id="btn-countdown"
          className="flex items-center justify-center gap-2 p-4 bg-blue-600 rounded-2xl text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
        >
          <Timer size={20} />
          <span>倒數計時</span>
        </button>
      </div>
    </div>
  );
}

function HexagonMetric({ label, value, color, id }: { label: string, value: string, color: string, id: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        id={id}
        className={`w-32 h-36 hexagon-clip flex items-center justify-center text-white relative shadow-xl ${color} transition-colors duration-500`}
      >
        <div className="text-center">
          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</h4>
          <p className="text-xl font-display font-bold">{value}</p>
        </div>
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-white/10 hexagon-clip" />
      </div>
    </div>
  );
}

function AlarmScreen({ reminders, setReminders }: any) {
  const dailyReminders = reminders.filter((r: Reminder) => r.isDaily);
  const tempReminders = reminders.filter((r: Reminder) => !r.isDaily);

  return (
    <div className="p-6 space-y-8 flex flex-col h-full">
      <div className="space-y-8 flex-1">
        {/* Daily Reminders */}
        <section className="space-y-3">
          <h3 id="label-daily" className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">每日固定提醒</h3>
          <div className="space-y-3">
            {dailyReminders.map((r: Reminder) => (
              <div key={r.id}>
                <ReminderItem reminder={r} />
              </div>
            ))}
          </div>
        </section>

        {/* Temporary Reminders */}
        <section className="space-y-3">
          <h3 id="label-temporary" className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">臨時提醒</h3>
          <div className="space-y-3">
            {tempReminders.map((r: Reminder) => (
              <div key={r.id}>
                <ReminderItem reminder={r} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 py-2">
        <button 
          id="btn-close-alarm"
          className="flex-1 flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100"
        >
          <div className="p-1 rounded-full"><Clock size={20} /></div>
          <span className="text-[10px] font-bold mt-1">關閉提醒</span>
        </button>
        
        <button 
          id="btn-ptt"
          className="w-20 h-20 rounded-full bg-blue-600 flex flex-col items-center justify-center text-white shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all group"
        >
          <Mic size={28} className="group-active:scale-125 transition-transform" />
          <span className="text-[10px] font-bold mt-1">按住說話</span>
        </button>

        <button 
          id="btn-add-alarm"
          className="flex-1 flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
        >
          <div className="p-1 rounded-full"><Plus size={20} /></div>
          <span className="text-[10px] font-bold mt-1">新增提醒</span>
        </button>
      </div>
    </div>
  );
}

function ReminderItem({ reminder }: { reminder: Reminder }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl font-display font-bold text-slate-700">{reminder.time}</div>
        <div>
          <div className="text-sm font-bold text-slate-800">{reminder.label}</div>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-slate-100 rounded-full group-hover:bg-blue-200 transition-colors" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-5 rounded-full relative transition-colors ${reminder.active ? 'bg-blue-100' : 'bg-slate-200'}`}>
          <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${reminder.active ? 'right-1 bg-blue-600' : 'left-1 bg-slate-400'}`} />
        </div>
      </div>
    </motion.div>
  );
}
