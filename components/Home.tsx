
import React, { useState, useMemo } from 'react';
import { UserData, AppTab, WeatherData, SportType, CheckIn } from '../types';
import { ICONS } from '../constants';
import CatAvatar from './CatAvatar';

interface HomeProps {
  userData: UserData;
  updateUserData: (updater: (prev: UserData) => UserData) => void;
  weather: WeatherData;
  navigateTo: (tab: AppTab) => void;
}

const Home: React.FC<HomeProps> = ({ userData, updateUserData, weather, navigateTo }) => {
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [animStatus, setAnimStatus] = useState<'idle' | 'dropping' | 'chewing' | 'swallowing' | 'happy'>('idle');

  const today = new Date().toISOString().split('T')[0];
  
  const freeTimeSlots = useMemo(() => {
    const todaySchedules = userData.schedules.filter(s => s.date === today);
    if (todaySchedules.length === 0) return ["全天候空闲"];
    
    const sorted = [...todaySchedules].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const slots: string[] = [];
    let lastEnd = "06:00";
    
    sorted.forEach(s => {
      if (s.startTime > lastEnd) {
        slots.push(`${lastEnd}-${s.startTime}`);
      }
      lastEnd = s.endTime > lastEnd ? s.endTime : lastEnd;
    });
    
    if (lastEnd < "22:00") {
      slots.push(`${lastEnd}-22:00`);
    }
    
    return slots.length > 0 ? slots : ["今日暂无空闲时段"];
  }, [userData.schedules, today]);

  const recommendedSports = useMemo(() => {
    const { temp } = weather;
    if (temp < 5 || temp > 30) return [];
    if (temp >= 5 && temp < 15) return [SportType.WALK, SportType.JOGGING, SportType.CYCLING];
    if (temp >= 15 && temp < 25) return [SportType.RUNNING, SportType.HIKING, SportType.YOGA];
    if (temp >= 25 && temp <= 30) return [SportType.FAST_WALK, SportType.NIGHT_RUN, SportType.STRETCH];
    return [];
  }, [weather]);

  const hasCheckedInToday = userData.checkIns.some(c => c.date === today);

  const triggerFeedingAnim = () => {
    setAnimStatus('dropping');
    setTimeout(() => setAnimStatus('chewing'), 800);
    setTimeout(() => setAnimStatus('swallowing'), 1800);
    setTimeout(() => setAnimStatus('happy'), 2400);
    setTimeout(() => setAnimStatus('idle'), 4000);
  };

  const handleCheckIn = (type: SportType) => {
    const newCheckIn: CheckIn = { date: today, type };
    updateUserData(prev => {
      const isYesterdayChecked = prev.cat.lastCheckInDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = isYesterdayChecked ? prev.cat.streakDays + 1 : 1;
      
      let bonusCan = 0;
      let bonusStrip = 0;
      let newToy = "";
      if (newStreak === 5) bonusCan = 1;
      if (newStreak === 10) newToy = "毛线球";
      if (newStreak === 30) bonusStrip = 1;

      const newToys = newToy && !prev.cat.unlockedToys.includes(newToy) 
        ? [...prev.cat.unlockedToys, newToy] 
        : prev.cat.unlockedToys;

      return {
        ...prev,
        checkIns: [...prev.checkIns, newCheckIn],
        cat: {
          ...prev.cat,
          foodCount: prev.cat.foodCount + 1,
          streakDays: newStreak,
          totalCheckIns: prev.cat.totalCheckIns + 1,
          lastCheckInDate: today,
          canCount: prev.cat.canCount + bonusCan,
          stripCount: prev.cat.stripCount + bonusStrip,
          unlockedToys: newToys
        }
      };
    });
    setShowCheckInModal(false);
    triggerFeedingAnim();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-cartoon text-gray-700">{new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}</h1>
          <p className="text-xs text-gray-400 mt-1 flex items-center">
            <span className="mr-1">📍</span> {weather.location}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl mb-1">{weather.condition === 'sunny' ? ICONS.SUNNY : weather.condition === 'rainy' ? ICONS.RAINY : ICONS.CLOUDY}</div>
          <p className="text-xl font-bold text-orange-400 leading-none">{weather.temp}°C</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-[2rem] border border-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-700 text-sm flex items-center">🕒 今日空闲时段</h2>
          <button onClick={() => navigateTo(AppTab.SCHEDULE)} className="text-[10px] text-orange-500 bg-orange-50 px-3 py-1 rounded-full font-bold btn-active">去调整</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {freeTimeSlots.map((slot, i) => (
            <span key={i} className="bg-gray-100/50 text-gray-500 px-4 py-1.5 rounded-2xl text-[11px] font-bold">{slot}</span>
          ))}
        </div>
      </div>

      <div className="bg-[#E2F3E1]/80 p-5 rounded-[2.5rem] border border-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🏃</div>
        <h2 className="font-bold text-green-800 mb-4 text-sm">👟 智能推荐户外运动</h2>
        {recommendedSports.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {recommendedSports.map((sport, i) => (
              <div key={i} className="bg-white/70 p-3 rounded-2xl flex items-center space-x-2 border border-green-50">
                <span className="text-lg">{sport.includes('跑') ? ICONS.RUNNING_SHOE : sport.includes('骑') ? ICONS.BICYCLE : ICONS.MOUNTAIN}</span>
                <span className="text-xs font-bold text-green-700">{sport}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-green-700 opacity-60 py-2">今日天气不适宜户外运动，建议室内休息哦</p>
        )}
      </div>

      <button
        onClick={() => !hasCheckedInToday && setShowCheckInModal(true)}
        disabled={hasCheckedInToday}
        className={`w-full py-5 rounded-[2.5rem] text-xl font-bold transition-all btn-active shadow-lg ${
          hasCheckedInToday 
          ? 'bg-gray-200 text-gray-400 shadow-none' 
          : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-orange-100'
        }`}
      >
        {hasCheckedInToday ? '✅ 今日已完成打卡' : '💪 今日运动打卡成功'}
      </button>

      <div className="relative pt-6 flex flex-col items-center">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <CatAvatar status={animStatus} weight={userData.cat.weight} breed={userData.cat.breed} size="md" />
          {animStatus === 'dropping' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-food-drop text-5xl pointer-events-none z-10">🍗</div>
          )}
        </div>

        <div className="w-full bg-white/80 rounded-[3rem] p-6 shadow-xl border border-white relative -mt-4">
           <div className="flex justify-between items-start mb-5">
             <div>
               <h3 className="text-xl font-cartoon text-gray-700">{userData.cat.name}</h3>
               <div className="flex items-center mt-1">
                 <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                   <div 
                    className="h-full bg-orange-400 transition-all duration-1000" 
                    style={{ width: `${(userData.cat.weight / 10) * 100}%` }}
                   />
                 </div>
                 <span className="text-[10px] text-orange-400 font-bold">{userData.cat.weight.toFixed(1)}kg</span>
               </div>
             </div>
             <button onClick={() => navigateTo(AppTab.GROWTH)} className="px-5 py-2 bg-orange-400 text-white rounded-full text-[10px] font-bold btn-active">培养中心</button>
           </div>
           
           <div className="grid grid-cols-4 gap-3">
              <StatusBox label="猫粮" val={userData.cat.foodCount} />
              <StatusBox label="罐头" val={userData.cat.canCount} />
              <StatusBox label="猫条" val={userData.cat.stripCount} />
              <StatusBox label="连勤" val={userData.cat.streakDays} />
           </div>
        </div>
      </div>

      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full rounded-[3rem] p-8 shadow-2xl animate-fade-in mb-4">
            <h3 className="text-xl font-cartoon text-gray-700 mb-6 text-center">记录今天的汗水</h3>
            <div className="grid grid-cols-2 gap-4">
              {[SportType.WALK, SportType.RUNNING, SportType.CYCLING, SportType.HIKING, SportType.BADMINTON, SportType.OTHER].map(type => (
                <button
                  key={type}
                  onClick={() => handleCheckIn(type)}
                  className="py-4 bg-orange-50 rounded-[1.5rem] text-orange-700 font-bold hover:bg-orange-100 btn-active text-sm"
                >
                  {type}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCheckInModal(false)} className="w-full mt-6 py-4 text-gray-400 font-bold text-sm">再等等</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBox = ({ label, val }: any) => (
  <div className="bg-gray-50/50 rounded-2xl p-2.5 border border-gray-100 text-center">
    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-700">{val}</p>
  </div>
);

export default Home;
