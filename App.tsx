
import React, { useState, useEffect } from 'react';
import { AppTab, UserData, CatState, WeatherData, CatBreed } from './types';
import Home from './components/Home';
import ScheduleManager from './components/ScheduleManager';
import CalendarView from './components/CalendarView';
import GrowthView from './components/GrowthView';
import ProfileView from './components/ProfileView';
import Welcome from './components/Welcome';

const INITIAL_CAT: CatState = {
  name: '小橘',
  breed: 'orange',
  weight: 4.0,
  foodCount: 0,
  canCount: 0,
  stripCount: 0,
  unlockedToys: [],
  streakDays: 0,
  lastCheckInDate: null,
  lastFeedingDate: null,
  totalCheckIns: 0
};

const INITIAL_USER_DATA: UserData = {
  schedules: [],
  checkIns: [],
  cat: INITIAL_CAT
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('miao_motion_data'));
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('miao_motion_data');
    return saved ? JSON.parse(saved) : INITIAL_USER_DATA;
  });
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: 'sunny',
    wind: '微风',
    location: '获取中...'
  });

  useEffect(() => {
    localStorage.setItem('miao_motion_data', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setWeather(prev => ({ ...prev, location: "苏州市 姑苏区" }));
      }, () => {
        setWeather(prev => ({ ...prev, location: "阳光城" }));
      });
    }
  }, []);

  const updateUserData = (updater: (prev: UserData) => UserData) => {
    setUserData(updater);
  };

  const handleAdopt = (catName: string, breed: CatBreed) => {
    setUserData(prev => ({
      ...prev,
      cat: { ...prev.cat, name: catName, breed: breed }
    }));
    setIsFirstTime(false);
  };

  if (isFirstTime) {
    return <Welcome onAdopt={handleAdopt} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Home userData={userData} updateUserData={updateUserData} weather={weather} navigateTo={setActiveTab} />;
      case AppTab.SCHEDULE:
        return <ScheduleManager userData={userData} updateUserData={updateUserData} onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.CALENDAR:
        return <CalendarView userData={userData} onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.GROWTH:
        return <GrowthView userData={userData} updateUserData={updateUserData} onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.PROFILE:
        return <ProfileView userData={userData} updateUserData={updateUserData} onNavigate={setActiveTab} />;
      default:
        return <Home userData={userData} updateUserData={updateUserData} weather={weather} navigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto relative overflow-hidden bg-[#FDFBF0] shadow-xl">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {renderContent()}
      </main>
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-20 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)] px-4">
        <NavItem active={activeTab === AppTab.HOME} icon="🏠" label="首页" onClick={() => setActiveTab(AppTab.HOME)} />
        <NavItem active={activeTab === AppTab.CALENDAR} icon="🐾" label="日历" onClick={() => setActiveTab(AppTab.CALENDAR)} />
        <NavItem active={activeTab === AppTab.PROFILE} icon="👤" label="我的" onClick={() => setActiveTab(AppTab.PROFILE)} />
      </nav>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all duration-300 ${active ? 'scale-110' : 'opacity-60'}`}>
    <span className="text-2xl">{icon}</span>
    <span className={`text-xs font-bold ${active ? 'text-orange-400' : 'text-gray-400'}`}>{label}</span>
  </button>
);

export default App;
