
import React, { useState, useMemo, useEffect } from 'react';
import { UserData, AppTab, WeatherData, SportType, CheckIn } from '../types';
import { COLORS, ICONS } from '../constants';
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-700">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</h1>
          <p className="text-sm text-gray-400 flex items-center">📍 {weather.location}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl">{weather.condition === 'sunny' ? ICONS.SUNNY : weather.condition === 'rainy' ? ICONS.RAINY : ICONS.CLOUDY}</span>
          <span className="text-2xl font-bold text-orange-400">{weather.temp}°C</span>
        </div>
      </div>

      <div className="text-center bg-orange-50 py-2 rounded-full text-xs text-orange-600 font-bold border border-orange-100">
        今日运动建议：{recommendedSports.length > 0 ? '适合户外运动' : '今日不建议户外运动'}
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-700 flex items-center">🕒 我的空闲时段</h2>
          <button onClick={() => navigateTo(AppTab.SCHEDULE)} className="text-xs text-orange-400 bg-orange-50 px-3 py-1 rounded-full font-bold">管理</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {freeTimeSlots.map((slot, i) => (
            <span key={i} className="bg-gray-50 text-gray-500 px-3 py-1 rounded-xl text-sm border border-gray-100">{slot}</span>
          ))}
        </div>
      </div>

      <div className="bg-[#E2F3E1] p-4 rounded-3xl shadow-sm border border-green-100">
        <h2 className="font-bold text-green-800 mb-3 flex items-center">🏃 今日推荐运动</h2>
        {recommendedSports.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {recommendedSports.map((sport, i) => (
              <div key={i} className="bg-white/60 p-3 rounded-2xl flex items-center space-x-2">
                <span className="text-xl">{sport.includes('跑') ? ICONS.RUNNING_SHOE : sport.includes('骑') ? ICONS.BICYCLE : ICONS.MOUNTAIN}</span>
                <span className="text-sm font-bold text-green-700">{sport}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-700 opacity-60">今日天气不适宜户外运动，好好休息吧</p>
        )}
      </div>

      <button
        onClick={() => !hasCheckedInToday && setShowCheckInModal(true)}
        disabled={hasCheckedInToday}
        className={`w-full py-5 rounded-3xl text-xl font-bold transition-all transform active:scale-95 shadow-md ${
          hasCheckedInToday 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-[#FFB347] text-white hover:bg-orange-500'
        }`}
      >
        {hasCheckedInToday ? '✅ 今日运动已打卡' : '💪 今日运动打卡成功'}
      </button>

      <div className="relative pt-2 flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <CatAvatar status={animStatus} weight={userData.cat.weight} breed={userData.cat.breed} size="md" />
          {animStatus === 'dropping' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-food-drop text-4xl pointer-events-none">🍗</div>
          )}
        </div>

        <div className="mt-4 w-full bg-white rounded-3xl p-5 shadow-lg border border-orange-100">
           <div className="flex justify-between items-center mb-4">
             <div>
               <h3 className="text-lg font-bold text-gray-700">{userData.cat.name}</h3>
               <p className="text-sm text-gray-400">体重: <span className="text-orange-400 font-bold">{userData.cat.weight.toFixed(1)}kg</span></p>
             </div>
             <button onClick={() => navigateTo(AppTab.GROWTH)} className="px-4 py-2 bg-pink-50 text-pink-500 rounded-full text-xs font-bold">详情</button>
           </div>
           
           <div className="grid grid-cols-4 gap-2 text-center">
              <StatusItem label="猫粮" val={userData.cat.foodCount} unit="份" />
              <StatusItem label="罐头" val={userData.cat.canCount} unit="个" />
              <StatusItem label="猫条" val={userData.cat.stripCount} unit="根" />
              <StatusItem label="连击" val={userData.cat.streakDays} unit="天" />
           </div>
        </div>
      </div>

      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-bounce-gentle-once text-center">
            <h3 className="text-lg font-bold mb-4">请选择今日运动类型</h3>
            <div className="grid grid-cols-2 gap-3">
              {[SportType.WALK, SportType.RUNNING, SportType.CYCLING, SportType.HIKING, SportType.BADMINTON, SportType.OTHER].map(type => (
                <button
                  key={type}
                  onClick={() => handleCheckIn(type)}
                  className="py-3 bg-orange-50 rounded-2xl text-orange-700 font-bold hover:bg-orange-100 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCheckInModal(false)} className="w-full mt-6 py-3 text-gray-400 font-bold">取消</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusItem = ({ label, val, unit }: any) => (
  <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
    <p className="text-[10px] text-gray-400">{label}</p>
    <p className="text-sm font-bold text-gray-700">{val}{unit}</p>
  </div>
);

export default Home;
