
import React, { useState } from 'react';
import { UserData, CatState } from '../types';
import { ICONS } from '../constants';
import CatAvatar from './CatAvatar';

interface GrowthViewProps {
  userData: UserData;
  updateUserData: (updater: (prev: UserData) => UserData) => void;
  onBack: () => void;
}

const GrowthView: React.FC<GrowthViewProps> = ({ userData, updateUserData, onBack }) => {
  const [animStatus, setAnimStatus] = useState<'idle' | 'dropping' | 'chewing' | 'swallowing' | 'happy'>('idle');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userData.cat.name);

  const handleFeed = () => {
    if (userData.cat.foodCount <= 0) {
      alert("没有猫粮啦，快去运动打卡换取吧！");
      return;
    }

    setAnimStatus('dropping');
    setTimeout(() => setAnimStatus('chewing'), 800);
    setTimeout(() => {
      setAnimStatus('swallowing');
      updateUserData(prev => {
        const nextFoodCount = prev.cat.foodCount - 1;
        const feedsNeeded = 5;
        const newWeight = Math.min(10.0, prev.cat.weight + 0.1 / feedsNeeded);
        return {
          ...prev,
          cat: {
            ...prev.cat,
            foodCount: nextFoodCount,
            weight: Number(newWeight.toFixed(2)),
            lastFeedingDate: new Date().toISOString().split('T')[0]
          }
        };
      });
    }, 1800);
    setTimeout(() => setAnimStatus('happy'), 2400);
    setTimeout(() => setAnimStatus('idle'), 4000);
  };

  const handleNameSave = () => {
    updateUserData(prev => ({
      ...prev,
      cat: { ...prev.cat, name: tempName || "小橘" }
    }));
    setEditingName(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 text-xl">←</button>
        <h1 className="text-lg font-bold text-gray-700">我的小猫成长记</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex flex-col items-center bg-white p-6 rounded-[3rem] shadow-sm border border-orange-50">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <CatAvatar status={animStatus} weight={userData.cat.weight} breed={userData.cat.breed} size="lg" />
          {animStatus === 'dropping' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-food-drop text-5xl pointer-events-none z-10">🍗</div>
          )}
        </div>
        
        <div className="mt-6 text-center space-y-2">
          {editingName ? (
            <div className="flex items-center space-x-2">
              <input 
                value={tempName} 
                onChange={e => setTempName(e.target.value)}
                className="bg-gray-50 p-2 rounded-xl text-center font-bold outline-none border border-orange-200"
              />
              <button onClick={handleNameSave} className="bg-orange-400 text-white p-2 rounded-xl text-xs">保存</button>
            </div>
          ) : (
            <h2 className="text-2xl font-cartoon text-gray-700 flex items-center justify-center">
              {userData.cat.name} 
              <button onClick={() => setEditingName(true)} className="ml-2 text-sm text-gray-300">✎</button>
            </h2>
          )}
          <p className="text-gray-400">当前体重：<span className="text-orange-400 font-bold">{userData.cat.weight.toFixed(1)}kg</span></p>
        </div>

        <button 
          onClick={handleFeed}
          disabled={animStatus !== 'idle'}
          className={`mt-6 w-full py-4 rounded-3xl font-bold shadow-lg shadow-orange-100 transition-all ${
            animStatus === 'idle' ? 'bg-orange-400 text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {animStatus === 'idle' ? '投喂 1 份猫粮' : animStatus === 'dropping' ? '等一下...' : animStatus === 'chewing' ? '嚼嚼嚼...' : '好次！'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100">
           <p className="text-xs text-gray-400 mb-2">已囤资产</p>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between items-center"><span>猫粮</span><span className="font-bold text-orange-400">{userData.cat.foodCount} 份</span></div>
             <div className="flex justify-between items-center"><span>猫罐头</span><span className="font-bold text-orange-400">{userData.cat.canCount} 个</span></div>
             <div className="flex justify-between items-center"><span>猫条</span><span className="font-bold text-orange-400">{userData.cat.stripCount} 根</span></div>
           </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100">
           <p className="text-xs text-gray-400 mb-2">解锁玩具</p>
           <div className="flex flex-wrap gap-2">
             {userData.cat.unlockedToys.map((toy, i) => (
               <div key={i} className="bg-blue-50 p-2 rounded-xl text-xl">{toy === '毛线球' ? ICONS.BALL : ICONS.TOY_WAND}</div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthView;
